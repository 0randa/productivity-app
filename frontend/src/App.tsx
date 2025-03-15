import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Use your existing styles.css for all styling

function App() {
  // State for data fetch
  const [users, setUsers] = useState<string[]>([]);

  // State for toggling sidebar
  const [showSidebar, setShowSidebar] = useState(false);

  // State for counter
  const [count, setCount] = useState(0);

  // State for modal open/close
  const [isModalOpen, setIsModalOpen] = useState(true); 
  // defaulting to `true` to match homepage.js behavior (where modal opens on load)

  // ============ Data Fetch ============
  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/members');
      setUsers(response.data.members);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  // ============ Sidebar Handlers ============
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  // ============ Counter Handlers ============
  const handleDecrease = () => setCount((c) => c - 1);
  const handleIncrease = () => setCount((c) => c + 1);
  const handleReset = () => setCount(0);

  // Dynamically color the counter based on its value
  const getCountColor = () => {
    if (count > 0) return 'green';
    if (count < 0) return 'red';
    return '#222';
  };

  // ============ Modal Handlers ============
  // These two replicate the “close” and “continue as guest” behavior
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // If you really want the same “looping open/close” effect from homepage.js,
  // you can replicate that with setInterval + setTimeout. Be aware it’s not
  // typical React usage and can be jarring to the user.
  // Below is a direct mimic of that logic.
  const handleModalOpenWithLoop = () => {
    // repeated opening
    const intervalId = setInterval(() => {
      setIsModalOpen(true);
    }, 200);
    // repeated closing
    for (let i = 1; i < 1000; i++) {
      setTimeout(() => {
        setIsModalOpen(false);
      }, i * 400);
    }
    // Just for safety, clear the interval after some time
    setTimeout(() => {
      clearInterval(intervalId);
    }, 400 * 1000); // e.g. 400s later
  };

  return (
    <div>
      {/* ============ NAVBAR ============ */}
      <nav>
        <div className="nav-center">
          <h4>homepage</h4>
          <ul className="nav-links">
            <li>
              <a href="#homepage">homepage</a>
            </li>
            <li>
              <a href="#sidebar">sidebar</a>
            </li>
            <li>
              <a href="#modal">modal</a>
            </li>
            <li>
              <a href="#questions">questions</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ============ SIDEBAR TOGGLE BUTTON ============ */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {/* ============ SIDEBAR ============ */}
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

      {/* ============ HERO SECTION ============ */}
      <header className="hero" id="homepage">
        <div className="banner">
          <h1>counter</h1>
          <span
            id="value"
            style={{
              fontSize: '5rem',
              color: getCountColor(),
              display: 'block',
              margin: '1rem 0',
            }}
          >
            {count}
          </span>
          <div className="button-container">
            <button className="btn decrease" onClick={handleDecrease}>
              decrease
            </button>
            <button className="btn reset" onClick={handleReset}>
              reset
            </button>
            <button className="btn increase" onClick={handleIncrease}>
              increase
            </button>
          </div>
        </div>
      </header>

      {/* ============ MODAL ============ */}
      <div className={`modal-overlay ${isModalOpen ? 'open-modal' : ''}`}>
        <div className="modal-container">
          <h1>POMODORO TIMER</h1>

          {/* Buttons inside modal */}
          <button
            className="btn modal-login-btn"
            onClick={handleModalOpenWithLoop}
          >
            Login
          </button>
          <button
            className="btn modal-register-btn"
            onClick={handleModalOpenWithLoop}
          >
            Create account
          </button>
          <button className="btn modal-guest-btn" onClick={handleCloseModal}>
            Continue as guest
          </button>

          <button className="btn modal-close-btn" onClick={handleCloseModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* ============ MAIN SECTION (SECOND COUNTER EXAMPLE) ============ */}
      <main>
        <div className="container">
          <h1>counter</h1>
          <span
            id="value"
            style={{ fontSize: '5rem', color: getCountColor() }}
          >
            {count}
          </span>
          <div className="button-container">
            <button className="btn decrease" onClick={handleDecrease}>
              decrease
            </button>
            <button className="btn reset" onClick={handleReset}>
              reset
            </button>
            <button className="btn increase" onClick={handleIncrease}>
              increase
            </button>
          </div>
        </div>
      </main>

      {/* ============ DATA FETCHED ============ */}
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2>Fetched Users</h2>
        <p>
          {users.map((user, index) => (
            <span key={index} style={{ margin: '0 0.5rem' }}>
              {user}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default App;