// components/CourseCard.jsx
import React from 'react';
import ProgressCircle from './ProgressCircle';
import '../styles/coursecard.css';

const CourseCard = ({ 
  course, 
  progress, 
  onClick, 
  isActive = false,
  showDetails = true,
  glow = true
}) => {
  return (
    <div 
      className={`course-card ${isActive ? 'active' : ''} ${glow && progress > 0 ? 'glowing' : ''}`}
      onClick={onClick}
    >
      <div className="course-card-header">
        <span className="course-card-icon">{course.icon}</span>
        <div className="course-card-progress">
          <ProgressCircle 
            progress={progress} 
            size="small" 
            showPercentage={true}
            showLabel={false}
            glow={glow}
            interactive={true}
          />
        </div>
      </div>
      
      <div className="course-card-body">
        <h3 className="course-card-title">{course.name}</h3>
        {showDetails && (
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
        )}
      </div>
      
      <div className="course-card-progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
        <div className="progress-glow" style={{ width: `${progress}%` }} />
      </div>
      
      {/* Card Glow Effect */}
      {glow && progress > 0 && <div className="card-glow" />}
    </div>
  );
};

export default CourseCard;