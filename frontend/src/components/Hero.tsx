import React from 'react';

interface HeroProps {
  count: number;
  handleDecrease: () => void;
  handleReset: () => void;
  handleIncrease: () => void;
  getCountColor: () => string;
}

function Hero({
  count,
  handleDecrease,
  handleReset,
  handleIncrease,
  getCountColor,
}: HeroProps) {
  return (
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
  );
}

export default Hero;