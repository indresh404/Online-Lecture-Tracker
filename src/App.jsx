import { useEffect, useState, useRef } from "react";
import "./styles/app.css";
import "./styles/coursecard.css";
import "./styles/progress.css";
import "./styles/lecture.css";

export default function App() {
  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('courses');
  const [fetchingTitles, setFetchingTitles] = useState(false);
  const [lectureTitles, setLectureTitles] = useState({});
  const sidebarRef = useRef(null);

  // Generate a unique ID for each lecture
  const generateLectureId = (courseId, sectionName, lectureIndex) => {
    const cleanCourseId = courseId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cleanSectionName = sectionName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${cleanCourseId}-${cleanSectionName}-lecture-${lectureIndex + 1}`;
  };

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        
        if (data.courses) {
          data.courses.forEach(course => {
            course.sections.forEach((section, sectionIndex) => {
              section.lectures.forEach((lecture, lectureIndex) => {
                if (!lecture.uniqueId) {
                  lecture.uniqueId = generateLectureId(course.id, section.name, lectureIndex);
                }
                
                const key = `APNA::${lecture.uniqueId}`;
                const progressKey = `${key}_progress`;
                
                if (!localStorage.getItem(key)) {
                  localStorage.setItem(key, "false");
                }
                if (!localStorage.getItem(progressKey)) {
                  localStorage.setItem(progressKey, "0");
                }
              });
            });
          });
        }
        
        setCourses(data);
        if (data.courses && data.courses.length > 0) {
          setSelectedCourse(data.courses[0]);
          if (data.courses[0].sections.length > 0) {
            setSelectedSection(data.courses[0].sections[0]);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Load lecture titles when section changes
  useEffect(() => {
    if (selectedSection) {
      const loadLectureTitles = async () => {
        const titles = {};
        for (const lecture of selectedSection.lectures) {
          if (lecture.title && !lecture.title.includes('Lecture ') && !lecture.title.includes('Video ')) {
            titles[lecture.uniqueId] = lecture.title;
          } else {
            // Try to fetch from localStorage cache first
            const cacheKey = `title_${lecture.url}`;
            const cachedTitle = localStorage.getItem(cacheKey);
            if (cachedTitle) {
              titles[lecture.uniqueId] = cachedTitle;
            }
          }
        }
        setLectureTitles(titles);
      };
      loadLectureTitles();
    }
  }, [selectedSection]);

  // Extract media ID from URL - FIXED VERSION
  const extractMediaId = (url) => {
    if (!url) return null;
    
    // Remove any query parameters
    const cleanUrl = url.split('?')[0];
    
    const patterns = [
      /\/medias\/([^/.?#]+)/,
      /\/embed\/iframe\/([^.?&#]+)/,
      /wistia\.com\/medias\/([^/.?#]+)/,
      /wistia\.net\/embed\/medias\/([^/.?#]+)/,
      /fast\.wistia\.com\/embed\/medias\/([^/.?#]+)/,
      /\/embed\/medias\/([^/.?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Try to extract from any part of the URL
    const urlParts = cleanUrl.split('/');
    for (const part of urlParts) {
      // Look for strings that look like media IDs (8-12 alphanumeric chars)
      if (part.match(/^[a-z0-9]{8,12}$/i) && !part.includes('.') && !part.includes('?')) {
        return part;
      }
    }
    
    return null;
  };

  // Fetch title for a single lecture
  const fetchSingleTitle = async (lecture) => {
    const mediaId = extractMediaId(lecture.url);
    if (!mediaId) {
      console.log('No media ID found for URL:', lecture.url);
      return null;
    }

    try {
      console.log('Fetching title for media ID:', mediaId);
      const response = await fetch(`http://localhost:5000/api/get-title/${mediaId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Got title:', data.title);
        
        // Cache the title in localStorage
        const cacheKey = `title_${lecture.url}`;
        localStorage.setItem(cacheKey, data.title);
        
        return data.title;
      }
    } catch (error) {
      console.error('Error fetching title:', error);
    }
    
    return null;
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!courses || !courses.courses) return 0;
    
    let totalLectures = 0;
    let completedLectures = 0;
    
    courses.courses.forEach(course => {
      course.sections.forEach(section => {
        section.lectures.forEach(lecture => {
          totalLectures++;
          const key = `APNA::${lecture.uniqueId}`;
          if (localStorage.getItem(key) === "true") {
            completedLectures++;
          }
        });
      });
    });
    
    return totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  };

  // Calculate course progress
  const calculateCourseProgress = (course) => {
    if (!course) return 0;
    
    let totalLectures = 0;
    let completedLectures = 0;
    
    course.sections.forEach(section => {
      section.lectures.forEach(lecture => {
        totalLectures++;
        const key = `APNA::${lecture.uniqueId}`;
        if (localStorage.getItem(key) === "true") {
          completedLectures++;
        }
      });
    });
    
    return totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  };

  // Calculate section progress
  const calculateSectionProgress = (section) => {
    if (!section) return 0;
    
    let totalLectures = section.lectures.length;
    let completedLectures = 0;
    
    section.lectures.forEach(lecture => {
      const key = `APNA::${lecture.uniqueId}`;
      if (localStorage.getItem(key) === "true") {
        completedLectures++;
      }
    });
    
    return totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  };

  // Toggle lecture completion
  const toggleLectureCompletion = (lectureUniqueId) => {
    const key = `APNA::${lectureUniqueId}`;
    const progressKey = `${key}_progress`;
    const currentValue = localStorage.getItem(key);
    const newValue = currentValue === "true" ? "false" : "true";
    
    localStorage.setItem(key, newValue);
    
    if (newValue === "true") {
      localStorage.setItem(progressKey, "100");
      localStorage.setItem(`${key}_time`, new Date().toISOString());
    } else {
      localStorage.setItem(progressKey, "0");
      localStorage.removeItem(`${key}_time`);
    }
    
    setProgressVersion(prev => prev + 1);
  };

  // Get lecture progress
  const getLectureProgress = (lectureUniqueId) => {
    const key = `APNA::${lectureUniqueId}`;
    const progressKey = `${key}_progress`;
    const savedProgress = localStorage.getItem(progressKey);
    return savedProgress ? parseFloat(savedProgress) : 0;
  };

  // Check if lecture is completed
  const isLectureCompleted = (lectureUniqueId) => {
    const key = `APNA::${lectureUniqueId}`;
    return localStorage.getItem(key) === "true";
  };

  // Fetch all titles for current section
  const fetchAllTitles = async () => {
    if (!selectedCourse || !selectedSection) return;
    
    setFetchingTitles(true);
    const updatedTitles = { ...lectureTitles };
    let fetchedCount = 0;
    
    try {
      for (const lecture of selectedSection.lectures) {
        const mediaId = extractMediaId(lecture.url);
        if (mediaId) {
          try {
            const response = await fetch(`http://localhost:5000/api/get-title/${mediaId}`);
            if (response.ok) {
              const data = await response.json();
              if (data.title && !data.title.includes('Video ')) {
                updatedTitles[lecture.uniqueId] = data.title;
                fetchedCount++;
                
                // Cache in localStorage
                const cacheKey = `title_${lecture.url}`;
                localStorage.setItem(cacheKey, data.title);
              }
            }
          } catch (error) {
            console.error(`Error fetching title for ${mediaId}:`, error);
          }
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setLectureTitles(updatedTitles);
      
      if (fetchedCount > 0) {
        alert(`Successfully fetched ${fetchedCount} titles!`);
      } else {
        alert('No new titles could be fetched. They might already be cached.');
      }
      
    } catch (error) {
      console.error('Error fetching titles:', error);
      alert('Error fetching titles. Make sure the backend is running.');
    } finally {
      setFetchingTitles(false);
    }
  };

  // Simple Progress Circle Component (inline)
  const ProgressCircle = ({ progress, size = 'medium', showPercentage = true, glow = true }) => {
    const sizeClasses = {
      small: { outer: 50, stroke: 4 },
      medium: { outer: 100, stroke: 6 },
      large: { outer: 150, stroke: 8 }
    };
    
    const dimensions = sizeClasses[size];
    const radius = (dimensions.outer / 2) - (dimensions.stroke / 2);
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className={`progress-circle-container ${size}`}>
        <svg 
          className={`progress-circle-svg ${glow ? 'glow' : ''}`}
          width={dimensions.outer}
          height={dimensions.outer}
        >
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <radialGradient id="innerGlow">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          
          <circle
            className="progress-circle-bg"
            cx={dimensions.outer / 2}
            cy={dimensions.outer / 2}
            r={radius}
            strokeWidth={dimensions.stroke}
            fill="url(#innerGlow)"
          />
          
          <circle
            className="progress-circle-fill"
            cx={dimensions.outer / 2}
            cy={dimensions.outer / 2}
            r={radius}
            strokeWidth={dimensions.stroke}
            fill="transparent"
            stroke="url(#progressGradient)"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${dimensions.outer / 2} ${dimensions.outer / 2})`}
          />
        </svg>
        
        <div className="progress-circle-text">
          {showPercentage && (
            <span className="progress-percentage">
              {progress}%
            </span>
          )}
        </div>
        
        {progress > 0 && progress < 100 && (
          <div className="pulse-ring"></div>
        )}
      </div>
    );
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!courses || !courses.courses) return <div className="loading-container">No courses found</div>;

  return (
    <div className="app-container">
      {/* Always show sidebar */}
      <div className="sidebar" ref={sidebarRef}>
        <div className="sidebar-header">
          <div className="course-info">
            <h2 className="course-title">Apna College Courses</h2>
            <p className="course-subtitle">Indresh404</p>
          </div>
          
          {/* FIXED: Show selected course progress, not overall progress */}
          <div className="progress-summary">
            <div className="overall-progress">
              <ProgressCircle 
                progress={selectedCourse ? calculateCourseProgress(selectedCourse) : 0} 
                size="medium"
                showPercentage={true}
                glow={selectedCourse ? calculateCourseProgress(selectedCourse) > 0 : false}
              />
              <div className="progress-label">
                {selectedCourse ? selectedCourse.name : 'Select Course'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="courses-list-scroll">
          <div className="courses-list">
            {courses.courses.map((course, index) => {
              const courseProgress = calculateCourseProgress(course);
              const isActive = selectedCourse?.id === course.id && view === 'course-detail';
              
              return (
                <div 
                  key={course.id}
                  className={`course-nav-item ${isActive ? 'active' : ''} ${courseProgress === 100 ? 'completed' : ''}`}
                  onClick={() => {
                    setSelectedCourse(course);
                    setView('course-detail');
                    if (course.sections.length > 0) {
                      setSelectedSection(course.sections[0]);
                    }
                  }}
                >
                  <div className="course-nav-content">
                    <div className="course-title-container">
                      <span className="course-icon">{course.icon}</span>
                      <span className={`course-name ${courseProgress === 100 ? 'completed-text' : ''}`}>
                        {course.name}
                      </span>
                      {courseProgress === 100 && (
                        <div className="completion-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="course-metadata">
                      <span className="lecture-count">
                        {course.sections.reduce((total, section) => total + section.lectures.length, 0)} lectures
                      </span>
                      <span className="course-percent">{courseProgress}%</span>
                    </div>
                    
                    <div className="course-progress-track">
                      <div 
                        className="course-progress-fill" 
                        style={{ width: `${courseProgress}%` }}
                      />
                      <div className="progress-glow" style={{ width: `${courseProgress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {view === 'courses' ? (
          // Courses Overview Page
          <div className="courses-overview">
            <div className="overview-header">
              <h1>All Courses</h1>
              <p>Select a course to view its content</p>
            </div>
            
            <div className="courses-grid">
              {courses.courses.map(course => {
                const courseProgress = calculateCourseProgress(course);
                return (
                  <div 
                    key={course.id}
                    className={`course-card ${courseProgress > 0 ? 'glowing' : ''}`}
                    onClick={() => {
                      setSelectedCourse(course);
                      setView('course-detail');
                      if (course.sections.length > 0) {
                        setSelectedSection(course.sections[0]);
                      }
                    }}
                  >
                    <div className="course-card-header">
                      <span className="course-card-icon">{course.icon}</span>
                      <div className="course-card-progress">
                        <ProgressCircle 
                          progress={courseProgress} 
                          size="small" 
                          showPercentage={true}
                          glow={courseProgress > 0}
                        />
                      </div>
                    </div>
                    
                    <div className="course-card-body">
                      <h3 className="course-card-title">{course.name}</h3>
                      <div className="course-card-stats">
                        <span className="stat">
                          <span className="stat-number">
                            {course.sections.reduce((total, section) => total + section.lectures.length, 0)}
                          </span>
                          <span className="stat-label">Lectures</span>
                        </span>
                        <span className="stat-divider">•</span>
                        <span className="stat">
                          <span className="stat-number">
                            {course.sections.length}
                          </span>
                          <span className="stat-label">Sections</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="course-card-progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${courseProgress}%` }}
                      />
                      <div className="progress-glow" style={{ width: `${courseProgress}%` }} />
                    </div>
                    
                    {courseProgress > 0 && <div className="card-glow" />}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Course Detail Page
          <div className="course-detail">
            {selectedCourse && (
              <>
                <div className="course-header">
                  <button className="back-button" onClick={() => setView('courses')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Courses
                  </button>
                  
                  <div className="course-header-content">
                    <h1 className="course-title-main">
                      <span className="course-icon-large">{selectedCourse.icon}</span>
                      {selectedCourse.name}
                    </h1>
                    <div className="course-stats">
                      <span className="stat">
                        <span className="stat-number">
                          {selectedCourse.sections.reduce((total, section) => total + section.lectures.length, 0)}
                        </span>
                        <span className="stat-label">Lectures</span>
                      </span>
                      <span className="stat-divider">•</span>
                      <span className="stat">
                        <span className="stat-number">
                          {selectedCourse.sections.length}
                        </span>
                        <span className="stat-label">Sections</span>
                      </span>
                      <span className="stat-divider">•</span>
                      <span className="stat">
                        <span className="stat-number">
                          {calculateCourseProgress(selectedCourse)}%
                        </span>
                        <span className="stat-label">Completed</span>
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className="fetch-titles-button"
                    onClick={fetchAllTitles}
                    disabled={fetchingTitles}
                  >
                    {fetchingTitles ? 'Fetching Titles...' : 'Fetch Video Titles'}
                  </button>
                </div>

                <div className="course-detail-layout">
                  {/* Left: Sections List */}
                  <div className="sections-sidebar">
                    <div className="sections-list">
                      {selectedCourse.sections.map((section) => {
                        const sectionProgress = calculateSectionProgress(section);
                        const isActive = selectedSection?.name === section.name;
                        
                        return (
                          <div 
                            key={section.name}
                            className={`section-item ${isActive ? 'active' : ''} ${sectionProgress > 0 ? 'glowing-section' : ''}`}
                            onClick={() => setSelectedSection(section)}
                          >
                            <div className="section-item-header">
                              <span className="section-name">{section.name}</span>
                              <span className="section-progress">{sectionProgress}%</span>
                            </div>
                            <div className="section-item-progress">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${sectionProgress}%` }}
                              />
                              <div className="progress-glow" style={{ width: `${sectionProgress}%` }} />
                            </div>
                            <div className="section-item-meta">
                              <span className="section-lecture-count">{section.lectures.length} lectures</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Selected Section Lectures */}
                  <div className="section-content">
                    {selectedSection && (
                      <div className="selected-section-content">
                        <div className="section-header">
                          <h2 className="section-title">{selectedSection.name}</h2>
                          <div className="section-header-stats">
                            <span className="section-progress-stat">
                              Progress: {calculateSectionProgress(selectedSection)}%
                            </span>
                            <span className="section-lecture-stat">
                              {selectedSection.lectures.length} lectures
                            </span>
                          </div>
                        </div>
                        
                        <div className="lectures-list">
                          {selectedSection.lectures.map((lecture, index) => {
                            const isCompleted = isLectureCompleted(lecture.uniqueId);
                            const progress = getLectureProgress(lecture.uniqueId);
                            const mediaId = extractMediaId(lecture.url);
                            
                            // Determine what title to show
                            let displayTitle = lectureTitles[lecture.uniqueId] || lecture.title;
                            if (!displayTitle || displayTitle.includes('Lecture ') || displayTitle.includes('Video ')) {
                              displayTitle = `Lecture ${index + 1}`;
                            }
                            
                            return (
                              <div 
                                key={lecture.uniqueId}
                                className={`lecture-item ${isCompleted ? 'completed' : ''} ${progress > 0 ? 'glowing-lecture' : ''}`}
                                onClick={() => {
                                  if (lecture.url) {
                                    if (lecture.url.startsWith('http')) {
                                      window.open(lecture.url, '_blank');
                                    } else {
                                      window.open(`http://localhost:5000${lecture.url}`, '_blank');
                                    }
                                  }
                                }}
                              >
                                <div className="lecture-item-header">
                                  <div className="lecture-checkbox">
                                    <div className={`checkbox ${isCompleted ? 'checked' : ''}`}>
                                      {isCompleted && <span>✓</span>}
                                    </div>
                                  </div>
                                  <div className="lecture-info">
                                    <span className="lecture-title">
                                      {displayTitle}
                                    </span>
                                    <span className="lecture-duration">{lecture.duration}</span>
                                  </div>
                                  {isCompleted && (
                                    <span className="lecture-completed-badge">Completed</span>
                                  )}
                                </div>
                                
                                <div className="lecture-progress-track">
                                  <div 
                                    className="lecture-progress-fill" 
                                    style={{ width: `${progress}%` }}
                                  />
                                  <div className="lecture-progress-glow" style={{ width: `${progress}%` }} />
                                </div>
                                
                                <div className="lecture-actions">
                                  <button 
                                    className="mark-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLectureCompletion(lecture.uniqueId);
                                    }}
                                  >
                                    {isCompleted ? 'Mark as Undone' : 'Mark as Done'}
                                  </button>
                                  <button 
                                    className="open-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (lecture.url) {
                                        if (lecture.url.startsWith('http')) {
                                          window.open(lecture.url, '_blank');
                                        } else {
                                          window.open(`http://localhost:5000${lecture.url}`, '_blank');
                                        }
                                      }
                                    }}
                                  >
                                    Open Video
                                  </button>
                                  {mediaId && !lectureTitles[lecture.uniqueId] && (
                                    <button 
                                      className="fetch-title-button"
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        const title = await fetchSingleTitle(lecture);
                                        if (title) {
                                          setLectureTitles(prev => ({
                                            ...prev,
                                            [lecture.uniqueId]: title
                                          }));
                                        }
                                      }}
                                    >
                                      Get Title
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}