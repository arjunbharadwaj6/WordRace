import React, { useState, useEffect } from "react";
import "./index.css";
import { wordsArray } from "./words";
import axios from "axios";
import Leaderboard from "./components/Leaderboard";
import Keyboard from "./components/Keyboard";
import Stats from "./components/Stats";

function App() {
  const initialStartTime = 7;
  const initialChangeLevel = 5;
  const [startTime, setStartTime] = useState(initialStartTime);
  const [changeLevel, setChangeLevel] = useState(initialChangeLevel);
  const [word, setWord] = useState(
    wordsArray[Math.floor(Math.random() * wordsArray.length)]
  );
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [sec, setSec] = useState(startTime);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(0);
  const [sendGameData, setSendGameData] = useState(true);
  const [usernameGiven, setUsernameGiven] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning && !gameOver) {
        setSec((sec) => (sec > 0 ? sec - 1 : setGameOver(true)));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    if (gameOver && sendGameData) {
      sendData();
      setSendGameData(false);
    }
  }, [gameOver, sendGameData]);

  function handleInputChange(event) {
    if (!timerRunning) {
      setTimerRunning(true);
    }
    setInputValue(event.target.value);
    if (event.target.value === word && timerRunning) {
      setSec(startTime);
      setScore(score + 1);
      generateWord();
      setInputValue("");
      if (score === changeLevel) {
        setLevel(level + 1);
        setChangeLevel(changeLevel + 5);
        if (startTime > 2) {
          setStartTime(startTime - 1);
        }
      }
    }
  }

  function generateWord() {
    const randWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
    setWord(randWord);
  }

  async function sendData() {
    try {
      const res = await axios.post("http://localhost:5000/scores", {
        username: username,
        email: email,
        score: score,
        level: level,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  function handleInfoSubmit() {
    if (username === "" || email === "") {
      pass;
    } else {
      setUsernameGiven(true);
    }
  }

  async function handleEmailSubmitStats(event) {
    if (event.key === "Enter") {
      const email = event.target.value;
      try {
        const response = await axios.get(
          `http://localhost:5000/scores/stats/${email}`
        );
        setStats(response.data);
      } catch (error) {
        alert("The person with that email has never played");
        console.log(error);
      }
    }
  }

  function rg() {
    setStartTime(initialStartTime);
    setChangeLevel(initialChangeLevel);
    setWord(wordsArray[Math.floor(Math.random() * wordsArray.length)]);
    setInputValue("");
    setScore(0);
    setSec(initialStartTime);
    setTimerRunning(false);
    setGameOver(false);
    setLevel(0);
    setSendGameData(true);
    setUsernameGiven(false);
    setUsername("");
    setEmail("");
    setShowStats(false);
    setStats(null);
  }

  function restartGame() {
    rg();
    setShowLeaderboard(false);
  }

  function restartGameLeaderboard() {
    rg();
    setShowLeaderboard(true);
  }

  return (
    <div className="game">
      {!gameOver && usernameGiven && !showLeaderboard && !showStats ? (
        <>
          <h1>Word Race</h1>
          <div className="info">
            <div className="col score">
              Score: <span>{score}</span>
            </div>
            <div className="col level">
              Level: <span>{level}</span>
            </div>
            <div className="col time">
              Time: <span>{sec}</span>
            </div>
          </div>
          <h2 className="word">{word}</h2>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            autoFocus={true}
          />
          <Keyboard />
        </>
      ) : !gameOver && !usernameGiven && !showLeaderboard && !showStats ? (
        <>
          <input
            type="text"
            placeholder="Please enter your name"
            onChange={() => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="Please enter you email"
            onChange={() => setEmail(event.target.value)}
          />
          <button onClick={handleInfoSubmit}>Start Game</button>
          <button onClick={() => setShowStats(true)}>Show Stats</button>
          <button onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
        </>
      ) : !gameOver && showLeaderboard && !showStats ? (
        <Leaderboard onBackToMain={restartGame} />
      ) : showStats ? (
        <>
          <button onClick={restartGame}>Main Page</button>
          <input
            type="text"
            placeholder="Enter Your email"
            onKeyDown={handleEmailSubmitStats}
          />
          {stats && <Stats stats={stats} />}
        </>
      ) : (
        <>
          <h1>Game Over</h1>
          <div className="col-go score">
            Score: <span>{score}</span>
          </div>
          <div className="col-go level">
            Level: <span>{level}</span>
          </div>
          <button onClick={restartGame}>Restart</button>
          <button onClick={restartGameLeaderboard}>Leaderboard</button>
        </>
      )}
    </div>
  );
}

export default App;
