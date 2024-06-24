import React, { useState, useEffect } from "react";
import axios from "axios";

const Leaderboard = ({ onBackToMain }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/leaderboard");
        setLeaderboardData(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <button onClick={onBackToMain}>Main Page</button>
      <h1>LeaderBoard</h1>
      <div className="tabel">
        <div className="row">
          <div className="lb-col">S/N</div>
          <div className="lb-col">Username</div>
          <div className="lb-col">Score</div>
          <div className="lb-col">Level</div>
        </div>
        {leaderboardData.map((player, index) => (
          <div className="row" key={index}>
            <div className="lb-col">{index + 1}</div>
            <div className="lb-col">{player.username}</div>
            <div className="lb-col">{player.score}</div>
            <div className="lb-col">{player.level}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Leaderboard;
