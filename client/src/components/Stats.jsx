import React from "react";
import "./stats.css";

function Stats({ stats }) {
  if (!stats) {
    return <div>No stats available for this email.</div>;
  }

  return (
    <div>
      <h2>Stats for {stats.scores[0].email}</h2>
      <div className="table">
        <div>Number of Times Played: {stats.numTimesPlayed}</div>
        <div>Average Score: {stats.avgScore.toFixed(2)}</div>
        <div>Highest Score: {stats.highestScore}</div>
        <div>Lowest Score: {stats.lowestScore}</div>
        <div>Max Level Reached: {stats.maxLevel}</div>
      </div>
    </div>
  );
}

export default Stats;
