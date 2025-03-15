import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // your main CSS
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Modal from './components/Modal';
import MainCounter from './components/MainCounter';

function App() {
  // State for data fetch
  const [users, setUsers] = useState<string[]>([]);

  // State for toggling sidebar
  const [showSidebar, setShowSidebar] = useState(false);

  // State for counters
  const [count, setCount] = useState(0);

  // State for modal open/close
  const [isModalOpen, setIsModalOpen] = useState(true);

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
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // This replicates the repeated open/close logic from your original homepage.js
  const handleModalOpenWithLoop = () => {
    const intervalId = setInterval(() => {
      setIsModalOpen(true);
    }, 200);
    for (let i = 1; i < 1000; i++) {
      setTimeout(() => {
        setIsModalOpen(false);
      }, i * 400);
    }
    setTimeout(() => {
      clearInterval(intervalId);
    }, 400 * 1000);
  };

  return (
    <div>
      <Navbar />

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
      <Sidebar showSidebar={showSidebar} closeSidebar={closeSidebar} />

      <Hero
        count={count}
        handleDecrease={handleDecrease}
        handleReset={handleReset}
        handleIncrease={handleIncrease}
        getCountColor={getCountColor}
      />

      <Modal
        isModalOpen={isModalOpen}
        handleModalOpenWithLoop={handleModalOpenWithLoop}
        handleCloseModal={handleCloseModal}
      />

      <MainCounter
        count={count}
        handleDecrease={handleDecrease}
        handleReset={handleReset}
        handleIncrease={handleIncrease}
        getCountColor={getCountColor}
      />

      {/* Display fetched data */}
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