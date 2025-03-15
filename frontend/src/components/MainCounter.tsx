import React from 'react';

interface MainCounterProps {
  count: number;
  handleDecrease: () => void;
  handleReset: () => void;
  handleIncrease: () => void;
  getCountColor: () => string;
}

function MainCounter({
  count,
  handleDecrease,
  handleReset,
  handleIncrease,
  getCountColor,
}: MainCounterProps) {
  return (
    <main>
      <div className="container">
        <h1>counter</h1>
        <span id="value" style={{ fontSize: '5rem', color: getCountColor() }}>
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
  );
}

export default MainCounter;