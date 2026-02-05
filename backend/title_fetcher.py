# title_fetcher.py
import requests
import re
import csv
import json
import os
from pathlib import Path
from flask import Blueprint, jsonify, request

title_fetcher = Blueprint('title_fetcher', __name__)

# Cache for storing fetched titles
TITLE_CACHE = {}
TITLES_DIR = Path("./titles")

def extract_media_id(url):
    """Extract media ID from Wistia URL"""
    patterns = [
        r'/medias/([^/.]+)',
        r'/embed/iframe/([^?]+)',
        r'wistia.com/medias/([^/.]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def fetch_title_from_wistia(media_id):
    """Fetch title from Wistia API"""
    try:
        # Try the standard API endpoint
        api_url = f"https://fast.wistia.com/embed/medias/{media_id}.json"
        response = requests.get(api_url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return data.get('media', {}).get('name', f'Video {media_id}')
        else:
            # Try alternative endpoint
            alt_url = f"https://fast.wistia.com/oembed?url=https://apnacollege.wistia.com/medias/{media_id}"
            response = requests.get(alt_url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return data.get('title', f'Video {media_id}')
    except Exception as e:
        print(f"Error fetching title for {media_id}: {e}")
    
    return f"Video {media_id}"

def load_title_cache(course_name, section_name=None):
    """Load cached titles from CSV file"""
    cache_file = TITLES_DIR / f"{course_name}"
    if section_name:
        cache_file = TITLES_DIR / f"{course_name}_{section_name}"
    cache_file = cache_file.with_suffix('.csv')
    
    if cache_file.exists():
        with open(cache_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 2:
                    TITLE_CACHE[row[0]] = row[1]
    return TITLE_CACHE

def save_title_cache(course_name, section_name=None):
    """Save titles to CSV file"""
    TITLES_DIR.mkdir(exist_ok=True)
    
    cache_file = TITLES_DIR / f"{course_name}"
    if section_name:
        cache_file = TITLES_DIR / f"{course_name}_{section_name}"
    cache_file = cache_file.with_suffix('.csv')
    
    with open(cache_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Media ID', 'Title'])
        for media_id, title in TITLE_CACHE.items():
            writer.writerow([media_id, title])

@title_fetcher.route('/api/fetch-titles', methods=['POST'])
def fetch_titles():
    """API endpoint to fetch titles for URLs"""
    data = request.json
    urls = data.get('urls', [])
    course_name = data.get('course_name', '')
    section_name = data.get('section_name', '')
    
    results = []
    
    # Load existing cache
    load_title_cache(course_name, section_name)
    
    for url in urls:
        media_id = extract_media_id(url)
        if not media_id:
            results.append({'url': url, 'title': 'Invalid URL', 'media_id': None})
            continue
        
        # Check cache first
        if media_id in TITLE_CACHE:
            title = TITLE_CACHE[media_id]
        else:
            # Fetch from Wistia
            title = fetch_title_from_wistia(media_id)
            TITLE_CACHE[media_id] = title
            # Save to cache immediately
            save_title_cache(course_name, section_name)
        
        results.append({
            'url': url,
            'media_id': media_id,
            'title': title
        })
    
    return jsonify({'titles': results})

@title_fetcher.route('/api/get-title/<media_id>')
def get_title(media_id):
    """Get title for a specific media ID"""
    if media_id in TITLE_CACHE:
        return jsonify({'title': TITLE_CACHE[media_id]})
    
    title = fetch_title_from_wistia(media_id)
    TITLE_CACHE[media_id] = title
    return jsonify({'title': title})

@title_fetcher.route('/api/bulk-fetch', methods=['POST'])
def bulk_fetch():
    """Bulk fetch titles from links.txt content"""
    data = request.json
    links_text = data.get('links_text', '')
    course_name = data.get('course_name', '')
    section_name = data.get('section_name', '')
    
    urls = [link.strip() for link in links_text.split('\n') if link.strip()]
    return fetch_titles_for_urls(urls, course_name, section_name)