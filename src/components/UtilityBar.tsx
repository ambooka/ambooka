'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Eye, 
  Sun, 
  Moon, 
  Download, 
  Sparkles, 
  X, 
  Send, 
  FileText 
} from 'lucide-react'

interface UtilityBarProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function UtilityBar({ currentTheme, onThemeChange }: UtilityBarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const utilityBarRef = useRef<HTMLDivElement>(null)
  const chatModalRef = useRef<HTMLDivElement>(null)

  // Load saved theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      onThemeChange(savedTheme)
    }
  }, [onThemeChange])

  // Close chat modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatModalRef.current && !chatModalRef.current.contains(event.target as Node)) {
        setIsChatOpen(false)
      }
    }

    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isChatOpen])

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    onThemeChange(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleMouseEnter = (tooltip: string) => {
    setActiveTooltip(tooltip);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  const downloadResume = () => {
    // This would typically link to your actual resume file
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'your-name-resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openResumeModal = () => {
    setIsResumeModalOpen(true);
  };

  // Get the tooltip text based on the current theme
  const getThemeTooltip = () => {
    return currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
  };

  return (
    <>
      <div className="utility-bar" ref={utilityBarRef}>
        <div className="utility-container">
          {/* View Resume Button */}
          <div className="utility-btn-container">
            <button 
              className="utility-btn" 
              onClick={openResumeModal}
              aria-label="View Resume"
              onMouseEnter={() => handleMouseEnter("View Resume")}
              onMouseLeave={handleMouseLeave}
            >
              <Eye size={20} />
              {activeTooltip === "View Resume" && (
                <span className="tooltip">View Resume</span>
              )}
            </button>
          </div>

          <div className="divider"></div>
          
          {/* Theme Toggle Button */}
          <div className="utility-btn-container">
            <button 
              className="utility-btn" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              onMouseEnter={() => handleMouseEnter(getThemeTooltip())}
              onMouseLeave={handleMouseLeave}
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size极={20} />}
              {activeTooltip === getThemeTooltip() && (
                <span className="tooltip">{getThemeTooltip()}</span>
              )}
            </button>
          </div>
          
          <div className="divider"></div>
          
          {/* Download Resume Button */}
          <div className="utility-btn-container">
            <button 
              className="utility-btn" 
              onClick={downloadResume}
              aria-label="Download Resume"
              onMouseEnter={() => handleMouseEnter("Download Resume")}
              onMouseLeave={handleMouseLeave}
            >
              <Download size={20} />
              {activeTooltip === "Download Resume" && (
                <span className="tooltip">Download Resume</span>
              )}
            </button>
          </div>
          
          <div className="divider"></div>
          
          {/* AI Assistant Button */}
          <div className="utility-btn-container">
            <button 
              className="utility-btn ai-assistant" 
              onClick={() => setIsChatOpen(!isChatOpen)}
              aria-label="AI Assistant"
              onMouseEnter={() => handleMouseEnter("AI Assistant")}
              onMouseLeave={handleMouseLeave}
            >
              <Sparkles size={20} />
              {activeTooltip === "AI Assistant" && (
                <span className="tooltip">AI Assistant</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Chatbot Modal */}
      {isChatOpen && (
        <div className="chat-modal" ref={chatModalRef}>
          <div className="chat-header">
            <div className="chat-title">
              <Sparkles size={18} />
              <h3>AI Assistant</h3>
            </div>
            <button 
              className="close-chat"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="chat-messages">
            <div className="message ai-message">
              <div className="message-avatar">
                <Sparkles size={16} />
              </div>
              <div className="message-content">
                <p>Hello! I'm your AI assistant. How can I help you today?</p>
                <span className="message-time">Just now</span>
              </div>
            </div>
          </div>
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Ask something..." 
              className="form-input"
            />
            <button className="send-button">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {isResumeModalOpen && (
        <div className="resume-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>My Resume</h3>
              <button 
                className="close-modal"
                onClick={() => setIsResumeModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <iframe src="/resume.pdf" className="resume-iframe"></iframe>
              <div className="modal-actions">
                <button className="download-btn" onClick={downloadResume}>
                  <Download size={18} />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}