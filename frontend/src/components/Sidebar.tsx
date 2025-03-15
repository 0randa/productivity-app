import React from 'react';

interface SidebarProps {
  showSidebar: boolean;
  closeSidebar: () => void;
}

function Sidebar({ showSidebar, closeSidebar }: SidebarProps) {
  return (
    <aside className={`sidebar ${showSidebar ? 'show-sidebar' : ''}`}>
      <div className="sidebar-header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCZi-GG6-Q6s3rQsM1ckoZ6c0-qdVoXBa7uw&s"
          className="logo"
          alt="logo"
        />
        <button className="close-btn" onClick={closeSidebar}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      {/* links */}
      <ul className="links">
        <li>
          <a href="#homepage">homepage</a>
        </li>
        <li>
          <a href="#reviews">reviews</a>
        </li>
        <li>
          <a href="#modal">modal</a>
        </li>
        <li>
          <a href="#questions">questions</a>
        </li>
      </ul>
      {/* social media */}
      <ul className="social-icons">
        <li>
          <a href="https://www.facebook.com">
            <i className="fab fa-facebook"></i>
          </a>
        </li>
        <li>
          <a href="https://www.twitter.com">
            <i className="fab fa-twitter"></i>
          </a>
        </li>
        <li>
          <a href="https://www.behance.net">
            <i className="fab fa-behance"></i>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com">
            <i className="fab fa-linkedin"></i>
          </a>
        </li>
        <li>
          <a href="https://www.sketch.com">
            <i className="fab fa-sketch"></i>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;