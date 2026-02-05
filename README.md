# Lecture Tracker Web App

A personal web application built using React (frontend) and Python (backend) to organize and stream online lectures using m3u8 links.

# Description
I built this project to manage a large number of lecture links in a structured way. All courses are stored in the backend inside a courses folder, where each course has its own folder containing a .txt file with m3u8 lecture links. The backend reads this structure and sends the data to the React frontend.

The frontend displays courses and lectures in a clean and interactive UI, allows watching lectures directly, and tracks progress such as completed lectures and overall course completion percentage.

# Features

Course-wise structured lecture management

M3U8 (HLS) video streaming

Lecture and course progress tracking

Clean and interactive UI

Easy to add new courses

Auto-start backend and frontend using a .bat file

Project Structure

project-root
frontend – React frontend
backend – Python backend
backend/courses – All course folders
Course_1/lectures.txt
Course_2/lectures.txt
start.bat – Auto starts backend and frontend
README.md

lectures.txt Format
Each lectures.txt file contains m3u8 links, one per line.

Example:
https://example.com/lecture1.m3u8

https://example.com/lecture2.m3u8

How to Run
Simply run the start.bat file.
This batch file automatically starts both the backend server and the React frontend.

Tech Stack
Frontend: React, HTML, CSS, JavaScript
Backend: Python
Streaming: HLS (m3u8)

Disclaimer
This project is built strictly for personal educational use. All lecture content belongs to its respective owners.