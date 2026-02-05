/* styles/app.css */

/* ===== RESET & BASE STYLES ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  overflow: hidden;
  background: #0a0a0a;
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* Background Gradient */
#root::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 90%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* ===== LOADING STATES ===== */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #0a0a0a;
  color: #ef4444;
  font-size: 1.2rem;
  padding: 20px;
  text-align: center;
}

/* ===== APP CONTAINER ===== */
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.95);
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 300px;
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  background: rgba(15, 23, 42, 0.9);
}

.course-info {
  margin-bottom: 20px;
}

.course-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 4px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.course-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

.progress-summary {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* Courses List */
.courses-list-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-nav-item {
  background: rgba(30, 41, 59, 0.4);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.course-nav-item:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(4px);
}

.course-nav-item.active {
  background: rgba(30, 64, 175, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.course-nav-item.completed {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.course-nav-content {
  position: relative;
  z-index: 1;
}

.course-title-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.course-icon {
  font-size: 1.2rem;
}

.course-name {
  font-weight: 600;
  color: #f1f5f9;
  flex: 1;
}

.course-name.completed-text {
  color: #22c55e;
}

.completion-icon {
  color: #22c55e;
}

.course-metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.lecture-count {
  color: #94a3b8;
}

.course-percent {
  color: #3b82f6;
  font-weight: 600;
}

.course-progress-track {
  height: 4px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.course-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.6s ease;
  position: relative;
  z-index: 2;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  filter: blur(3px);
  opacity: 0.6;
  transition: width 0.6s ease;
  z-index: 1;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Courses Overview */
.courses-overview {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background: transparent;
}

.overview-header {
  margin-bottom: 32px;
}

.overview-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.overview-header p {
  font-size: 1rem;
  color: #94a3b8;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.course-card {
  background: rgba(30, 41, 59, 0.4);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(30, 41, 59, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.course-card:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.course-card.glowing {
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.2),
    0 0 40px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: cardGlow 3s ease-in-out infinite;
}

.course-card:hover.glowing {
  animation: cardGlowHover 1.5s ease-in-out infinite;
  box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.3),
    0 0 60px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

@keyframes cardGlow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(59, 130, 246, 0.2),
      0 0 40px rgba(59, 130, 246, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 0 25px rgba(59, 130, 246, 0.3),
      0 0 50px rgba(59, 130, 246, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
}

@keyframes cardGlowHover {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(59, 130, 246, 0.3),
      0 0 60px rgba(59, 130, 246, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 0 40px rgba(59, 130, 246, 0.4),
      0 0 80px rgba(59, 130, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 70%
  );
  border-radius: 16px;
  pointer-events: none;
  z-index: 0;
}

.course-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-card-icon {
  font-size: 1.75rem;
}

.course-card-progress {
  position: relative;
}

.course-card-body {
  flex: 1;
}

.course-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 12px;
  line-height: 1.4;
}

.course-card-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.course-card-stats .stat {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.course-card-stats .stat-number {
  font-size: 0.875rem;
  font-weight: 700;
  color: #3b82f6;
}

.course-card-stats .stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.course-card-stats .stat-divider {
  color: #475569;
  font-weight: 300;
}

.course-card-progress-bar {
  height: 4px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.course-card-progress-bar .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.6s ease;
  position: relative;
  z-index: 2;
}

.course-card-progress-bar .progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  filter: blur(3px);
  opacity: 0.6;
  transition: width 0.6s ease;
  z-index: 1;
}

/* ===== COURSE DETAIL PAGE ===== */
.course-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: transparent;
}

/* Course Header */
.course-header {
  padding: 24px 32px;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(30, 41, 59, 0.3);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
}

.back-button:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
  color: #f1f5f9;
}

.course-header-content {
  flex: 1;
}

.course-title-main {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.course-icon-large {
  font-size: 2rem;
}

.course-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

.stat-divider {
  color: #475569;
  font-weight: 300;
}

.fetch-titles-button {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  height: fit-content;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.fetch-titles-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.fetch-titles-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Course Detail Layout */
.course-detail-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sections Sidebar */
.sections-sidebar {
  width: 280px;
  background: rgba(15, 23, 42, 0.6);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  overflow-y: auto;
  padding: 20px;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-item {
  background: rgba(30, 41, 59, 0.4);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.section-item:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
}

.section-item.active {
  background: rgba(30, 64, 175, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.section-item.glowing-section {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
}

.section-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-name {
  font-weight: 600;
  color: #f1f5f9;
  font-size: 0.95rem;
  flex: 1;
}

.section-progress {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  flex-shrink: 0;
}

.section-item-progress {
  height: 4px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
}

.section-item-progress .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.6s ease;
  position: relative;
  z-index: 2;
}

.section-item-progress .progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  filter: blur(3px);
  opacity: 0.6;
  transition: width 0.6s ease;
  z-index: 1;
}

.section-item-meta {
  text-align: right;
}

.section-lecture-count {
  font-size: 0.75rem;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.6);
  padding: 2px 8px;
  border-radius: 10px;
}

/* Section Content */
.section-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.selected-section-content {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.section-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header-stats {
  display: flex;
  gap: 16px;
}

.section-progress-stat,
.section-lecture-stat {
  font-size: 0.875rem;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.6);
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

/* Lectures List */
.lectures-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lecture-item {
  background: rgba(30, 41, 59, 0.4);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(30, 41, 59, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.lecture-item:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.lecture-item.completed {
  background: rgba(21, 128, 61, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.lecture-item.glowing-lecture {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}

.lecture-item-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.lecture-checkbox {
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #475569;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background: #22c55e;
  border-color: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.checkbox span {
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.lecture-info {
  flex: 1;
}

.lecture-title {
  font-size: 1.125rem;
  color: #f1f5f9;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.media-id-badge {
  font-size: 0.7rem;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.6);
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 8px;
  font-family: monospace;
}

.lecture-duration {
  font-size: 0.875rem;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.6);
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.lecture-completed-badge {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.lecture-progress-track {
  height: 4px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
}

.lecture-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.6s ease;
  position: relative;
  z-index: 2;
}

.lecture-progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  filter: blur(3px);
  opacity: 0.6;
  transition: width 0.6s ease;
  z-index: 1;
}

.lecture-actions {
  display: flex;
  gap: 12px;
}

.mark-button,
.open-button {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
}

.mark-button {
  background: rgba(30, 41, 59, 0.6);
  color: #94a3b8;
  border: 1px solid rgba(30, 41, 59, 0.3);
}

.mark-button:hover {
  background: rgba(30, 41, 59, 0.8);
  color: #f1f5f9;
}

.open-button {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.open-button:hover {
  background: rgba(59, 130, 246, 0.25);
  color: #3b82f6;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .course-detail-layout {
    flex-direction: column;
  }
  
  .sections-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
    max-height: 200px;
  }
  
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .course-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .fetch-titles-button {
    align-self: flex-start;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
    max-height: 50vh;
  }
  
  .course-header-content {
    width: 100%;
  }
  
  .course-stats {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .section-content {
    padding: 16px;
  }
} 