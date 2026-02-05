# app.py (updated with title fetching)
from flask import Flask, jsonify, send_from_directory, request, Blueprint
from flask_cors import CORS
import os
import json
import csv
import requests
import re
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Path to your courses directory
COURSES_DIR = Path("./courses")
TITLES_DIR = Path("./titles")

# Create directories if they don't exist
COURSES_DIR.mkdir(exist_ok=True)
TITLES_DIR.mkdir(exist_ok=True)

# Cache for titles
TITLE_CACHE = {}

def extract_media_id(url):
    """Extract media ID from Wistia URL"""
    if not url:
        return None
    
    patterns = [
        r'/medias/([^/.]+)',
        r'/embed/iframe/([^?]+)',
        r'wistia\.com/medias/([^/.]+)',
        r'wistia\.net/embed/medias/([^/.]+)'
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
        response = requests.get(api_url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        if response.status_code == 200:
            data = response.json()
            title = data.get('media', {}).get('name', '')
            if title:
                return title
        
        # Try alternative endpoint
        alt_url = f"https://fast.wistia.com/oembed?url=https://apnacollege.wistia.com/medias/{media_id}"
        response = requests.get(alt_url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        if response.status_code == 200:
            data = response.json()
            title = data.get('title', '')
            if title:
                return title
                
    except Exception as e:
        print(f"Error fetching title for {media_id}: {e}")
    
    return f"Video {media_id}"

def load_title_cache():
    """Load all cached titles from CSV files"""
    TITLE_CACHE.clear()
    
    for csv_file in TITLES_DIR.glob("*.csv"):
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                next(reader)  # Skip header
                for row in reader:
                    if len(row) >= 2:
                        TITLE_CACHE[row[0]] = row[1]
        except Exception as e:
            print(f"Error loading cache file {csv_file}: {e}")
    
    print(f"Loaded {len(TITLE_CACHE)} cached titles")

def save_title_cache():
    """Save all cached titles to CSV files (grouped by first 2 chars)"""
    grouped_titles = {}
    
    for media_id, title in TITLE_CACHE.items():
        group_key = media_id[:2] if len(media_id) >= 2 else '00'
        if group_key not in grouped_titles:
            grouped_titles[group_key] = []
        grouped_titles[group_key].append((media_id, title))
    
    for group_key, titles in grouped_titles.items():
        csv_file = TITLES_DIR / f"titles_{group_key}.csv"
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Media ID', 'Title'])
            writer.writerows(titles)

def parse_links_file(file_path):
    """Parse links.txt file and extract lecture information"""
    lectures = []
    if not file_path.exists():
        return lectures
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            lecture_num = 1
            for line in lines:
                line = line.strip()
                if line and (line.startswith('http') or 'wistia' in line):
                    # Check if line has title format: Title|URL
                    if '|' in line:
                        title, url = line.split('|', 1)
                        title = title.strip()
                        url = url.strip()
                    else:
                        url = line
                        title = None
                    
                    media_id = extract_media_id(url)
                    if media_id and media_id in TITLE_CACHE and not title:
                        title = TITLE_CACHE[media_id]
                    
                    lecture_id = f"lec-{lecture_num:03d}"
                    lectures.append({
                        "id": lecture_id,
                        "title": title or f"Lecture {lecture_num}",
                        "duration": "00:00",
                        "url": url,
                        "media_id": media_id
                    })
                    lecture_num += 1
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
    
    return lectures

def get_course_icon(course_name):
    """Assign icons based on course name"""
    icon_map = {
        "apptitude": "🧮",
        "aptitude": "🧮",
        "dsa": "💻",
        "java": "☕",
        "mern": "⚛️",
        "projects": "🚀",
        "practice": "📝",
        "docker": "🐳",
        "cicd": "⚙️",
        "web": "🌐",
        "react": "⚛️",
        "node": "🟢",
        "mongodb": "🍃",
        "express": "🚂"
    }
    
    course_lower = course_name.lower()
    for key, icon in icon_map.items():
        if key in course_lower:
            return icon
    return "📚"

def get_course_structure():
    """Dynamically generate course structure from folder hierarchy"""
    courses = []
    
    if not COURSES_DIR.exists():
        print(f"Warning: Courses directory not found at {COURSES_DIR}")
        return courses
    
    for course_dir in sorted(COURSES_DIR.iterdir()):
        if course_dir.is_dir():
            course = {
                "id": course_dir.name.lower().replace(" ", "-").replace("[", "").replace("]", "").replace("(", "").replace(")", ""),
                "name": course_dir.name,
                "icon": get_course_icon(course_dir.name),
                "sections": []
            }
            
            # Get sections (subdirectories or files)
            has_sections = False
            for item in sorted(course_dir.iterdir()):
                if item.is_dir():
                    has_sections = True
                    section = {
                        "name": item.name,
                        "lectures": []
                    }
                    
                    # Check for links.txt in section directory
                    links_file = item / "links.txt"
                    if links_file.exists():
                        section["lectures"] = parse_links_file(links_file)
                    
                    # Check for direct .m3u8 files
                    for file in sorted(item.iterdir()):
                        if file.is_file() and file.name.endswith('.m3u8'):
                            media_id = file.stem
                            section["lectures"].append({
                                "id": f"{course['id']}-{item.name.lower().replace(' ', '-')}-{len(section['lectures']) + 1}",
                                "title": TITLE_CACHE.get(media_id, file.stem.replace('_', ' ').title()),
                                "duration": "00:00",
                                "url": f"/courses/{course_dir.name}/{item.name}/{file.name}",
                                "media_id": media_id
                            })
                    
                    if section["lectures"]:
                        course["sections"].append(section)
                
                # If no subdirectories, check for links.txt directly in course folder
                elif item.name == "links.txt" and not has_sections:
                    section = {
                        "name": "Lectures",
                        "lectures": parse_links_file(item)
                    }
                    if section["lectures"]:
                        course["sections"].append(section)
            
            if course["sections"]:
                courses.append(course)
    
    return courses

# Load cache on startup
load_title_cache()

# API Routes
@app.route('/api/courses')
def get_courses():
    """API endpoint to get course structure"""
    courses = get_course_structure()
    return jsonify({"courses": courses})

@app.route('/api/courses/<course_id>')
def get_course(course_id):
    """Get specific course by ID"""
    courses = get_course_structure()
    for course in courses:
        if course["id"] == course_id:
            return jsonify(course)
    return jsonify({"error": "Course not found"}), 404

@app.route('/api/stats')
def get_stats():
    """Get overall statistics"""
    courses = get_course_structure()
    total_lectures = 0
    
    for course in courses:
        for section in course["sections"]:
            total_lectures += len(section["lectures"])
    
    return jsonify({
        "totalCourses": len(courses),
        "totalLectures": total_lectures
    })

@app.route('/api/get-title/<media_id>')
def get_title(media_id):
    """Get title for a specific media ID"""
    if media_id in TITLE_CACHE:
        return jsonify({"title": TITLE_CACHE[media_id], "cached": True})
    
    title = fetch_title_from_wistia(media_id)
    TITLE_CACHE[media_id] = title
    save_title_cache()
    return jsonify({"title": title, "cached": False})

@app.route('/api/fetch-titles', methods=['POST'])
def fetch_titles():
    """API endpoint to fetch titles for URLs"""
    data = request.json
    urls = data.get('urls', [])
    course_name = data.get('course_name', '')
    section_name = data.get('section_name', '')
    
    results = []
    
    for url in urls:
        media_id = extract_media_id(url)
        if not media_id:
            results.append({'url': url, 'title': 'Invalid URL', 'media_id': None})
            continue
        
        # Check cache first
        if media_id in TITLE_CACHE:
            title = TITLE_CACHE[media_id]
            cached = True
        else:
            # Fetch from Wistia
            title = fetch_title_from_wistia(media_id)
            TITLE_CACHE[media_id] = title
            cached = False
        
        results.append({
            'url': url,
            'media_id': media_id,
            'title': title,
            'cached': cached
        })
    
    # Save updated cache
    save_title_cache()
    
    return jsonify({'titles': results})

@app.route('/api/bulk-fetch', methods=['POST'])
def bulk_fetch():
    """Bulk fetch titles from text content"""
    data = request.json
    links_text = data.get('links_text', '')
    course_name = data.get('course_name', '')
    
    urls = [link.strip() for link in links_text.split('\n') if link.strip()]
    return fetch_titles_for_urls(urls, course_name)

def fetch_titles_for_urls(urls, course_name):
    """Helper function to fetch titles for multiple URLs"""
    results = []
    new_titles = 0
    
    for url in urls:
        media_id = extract_media_id(url)
        if not media_id:
            continue
        
        if media_id in TITLE_CACHE:
            title = TITLE_CACHE[media_id]
            cached = True
        else:
            title = fetch_title_from_wistia(media_id)
            TITLE_CACHE[media_id] = title
            cached = False
            new_titles += 1
        
        results.append({
            'media_id': media_id,
            'title': title,
            'cached': cached
        })
    
    # Save cache if new titles were fetched
    if new_titles > 0:
        save_title_cache()
    
    return jsonify({
        'titles': results,
        'total': len(results),
        'new': new_titles,
        'cached': len(results) - new_titles
    })

@app.route('/api/refresh-cache')
def refresh_cache():
    """Refresh all titles in cache"""
    old_count = len(TITLE_CACHE)
    
    # Re-fetch all titles
    for media_id in list(TITLE_CACHE.keys()):
        new_title = fetch_title_from_wistia(media_id)
        TITLE_CACHE[media_id] = new_title
    
    save_title_cache()
    
    return jsonify({
        'message': f'Cache refreshed. Updated {len(TITLE_CACHE)} titles.',
        'old_count': old_count,
        'new_count': len(TITLE_CACHE)
    })

@app.route('/courses/<path:filename>')
def serve_course_file(filename):
    """Serve course files"""
    return send_from_directory(COURSES_DIR, filename)

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "courses_dir": str(COURSES_DIR.absolute()),
        "titles_cached": len(TITLE_CACHE)
    })

@app.route('/')
def index():
    return jsonify({
        "message": "Apna College Courses API",
        "version": "1.0.0",
        "endpoints": {
            "/api/courses": "Get all courses",
            "/api/courses/<id>": "Get specific course",
            "/api/stats": "Get statistics",
            "/api/get-title/<media_id>": "Get title for media ID",
            "/api/fetch-titles": "Fetch titles for URLs (POST)",
            "/api/refresh-cache": "Refresh title cache",
            "/health": "Health check"
        },
        "cache_stats": {
            "titles_cached": len(TITLE_CACHE)
        }
    })

if __name__ == '__main__':
    print("=" * 50)
    print("Apna College Courses Backend")
    print("=" * 50)
    print(f"Courses directory: {COURSES_DIR.absolute()}")
    print(f"Titles cached: {len(TITLE_CACHE)}")
    print(f"Server starting on http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  http://localhost:5000/api/courses")
    print("  http://localhost:5000/api/get-title/<media_id>")
    print("  http://localhost:5000/api/fetch-titles (POST)")
    print("  http://localhost:5000/health")
    print("\nPlace your courses in the 'courses' folder with this structure:")
    print("  courses/")
    print("  ├── MERN Stack Projects/")
    print("  │   ├── PROJECT 1/")
    print("  │   │   └── links.txt")
    print("  │   └── PROJECT 2/")
    print("  │       └── links.txt")
    print("=" * 50)
    
    app.run(debug=True, port=5000)