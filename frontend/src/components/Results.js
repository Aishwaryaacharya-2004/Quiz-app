import React from 'react';

const Results = () => {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  return (
    <div className="results-container">
      <h1>Quiz Completed!!!!!</h1>
      <h2>THANK YOU!!!!</h2>

      
    </div>
  );
};

export default Results;