import React from 'react';

interface ModalProps {
  isModalOpen: boolean;
  handleModalOpenWithLoop: () => void;
  handleCloseModal: () => void;
}

function Modal({ isModalOpen, handleModalOpenWithLoop, handleCloseModal }: ModalProps) {
  return (
    <div className={`modal-overlay ${isModalOpen ? 'open-modal' : ''}`}>
      <div className="modal-container">
        <h1>POMODORO TIMER</h1>
        <button className="btn modal-login-btn" onClick={handleModalOpenWithLoop}>
          Login
        </button>
        <button className="btn modal-register-btn" onClick={handleModalOpenWithLoop}>
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
  );
}

export default Modal;