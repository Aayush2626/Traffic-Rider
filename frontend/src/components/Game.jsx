import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);

  
  const bikeImg = new Image();
  bikeImg.src = process.env.PUBLIC_URL + "/images/bike.png";

  const carSources = [
    "/images/car.png",

  ];
  const carImgs = carSources.map(src => {
    const img = new Image();
    img.src = process.env.PUBLIC_URL + src;
    return img;
  });

  const startGame = () => {
    setScore(0);
    setLeaderboard([]);
    setGameOver(false);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const roadLeft = 60;
    const roadRight = canvas.width - 60;
    const laneWidth = (roadRight - roadLeft) / 3;
    const laneCenters = [
      roadLeft + laneWidth / 2 - 20,
      roadLeft + laneWidth * 1.5 - 20,
      roadLeft + laneWidth * 2.5 - 20,
    ];

    const bike = {
      lane: 1,
      x: laneCenters[1],
      y: canvas.height - 100,
      w: 40,
      h: 60
    };
    let targetX = laneCenters[1];

    let obstacles = [];
    let speed = 3.5;
    let animationId;

    function drawRoad() {
      ctx.fillStyle = "#393838ff";
      ctx.fillRect(roadLeft, 0, roadRight - roadLeft, canvas.height);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 20]);
      for (let i = 1; i < 3; i++) {
        const x = roadLeft + i * laneWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(0, 0, roadLeft, canvas.height);
      ctx.fillRect(roadRight, 0, roadLeft, canvas.height);
    }

    function drawBike() {
      ctx.drawImage(bikeImg, bike.x, bike.y, bike.w, bike.h);
    }

    function drawObstacles() {
      obstacles.forEach(o => {
        o.y += speed;
        ctx.drawImage(o.img, o.x, o.y, o.w, o.h);

        // Collision
        if (
          bike.x < o.x + o.w &&
          bike.x + bike.w > o.x &&
          bike.y < o.y + o.h &&
          bike.y + bike.h > o.y
        ) {
          endGame();
        }
      });
      obstacles = obstacles.filter(o => o.y < canvas.height + 80);
    }

    function spawnObstacle() {
      
      const laneCount = Math.floor(Math.random() * 2) + 1;
      const chosenLanes = [];
      while (chosenLanes.length < laneCount) {
        const lane = Math.floor(Math.random() * 3);
        if (!chosenLanes.includes(lane)) chosenLanes.push(lane);
      }

      chosenLanes.forEach(lane => {
        const carImg = carImgs[Math.floor(Math.random() * carImgs.length)];
        obstacles.push({
          x: laneCenters[lane],
          y: -80,
          w: 40,
          h: 80,
          img: carImg
        });
      });
    }

    async function endGame() {
      cancelAnimationFrame(animationId);
      setRunning(false);
      setGameOver(true);

      try {
        await axios.post("/api/score", { playerName: "Player1", points: score });
        const res = await axios.get("/api/leaderboard");
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoad();

      const slideSpeed = 8;
  if (Math.abs(bike.x - targetX) > 1) {
    bike.x += Math.sign(targetX - bike.x) * slideSpeed;
  } else {
    bike.x = targetX;
  }
      drawBike();
      drawObstacles();

      setScore(prev => {
        const next = prev + 1;
        if (next % 400 === 0 && next <= 3200) speed += 1;
        return next;
      });

      animationId = requestAnimationFrame(loop);
    }

    function handleKeys(e) {
  if (e.key === "ArrowLeft" && bike.lane > 0) {
    bike.lane -= 1;
    targetX = laneCenters[bike.lane];
  }
  if (e.key === "ArrowRight" && bike.lane < 2) {
    bike.lane += 1;
    targetX = laneCenters[bike.lane];
  }
}


    window.addEventListener("keydown", handleKeys);
    const spawnTimer = setInterval(spawnObstacle, 1200);
    loop();

    return () => {
      window.removeEventListener("keydown", handleKeys);
      clearInterval(spawnTimer);
      cancelAnimationFrame(animationId);
    };
  }, [running]);

  return (
    <div className="game-container">
      

      {!running && !gameOver && (
        <button onClick={startGame} className="start-btn">
  ▶ Play Game
</button>

      )}

  <div className="fullscreen-container">
  <button className="fullscreen-btn" onClick={() => {
    const el = document.documentElement;          // whole page
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();                   // enter fullscreen
    } else {
      document.exitFullscreen?.();                // exit fullscreen
    }
  }}>
    ⛶ Fullscreen
  </button>
</div>


      <canvas
  ref={canvasRef}
  width={450}   // was 400
  height={700}  // was 600
  className="game-canvas"
/>

      <p className="score">Score: {score}</p>

      {gameOver && (
        <div className="game-over-popup">
          <div className="popup-content">
            <h2>Game Over!!</h2>
            <p>🏆Your Score: {score}</p>
            <button onClick={startGame} className="restart-btn">Restart</button>
            {leaderboard.length > 0 && (
              <div className="leaderboard">
                <h4>Leaderboard</h4>
                <table>
                  <thead>
                    <tr><th>Player</th><th>Points</th></tr>
                  </thead>
                  <tbody>
                    {leaderboard.map(item => (
                      <tr key={item.id}>
                        <td>{item.playerName}</td>
                        <td>{item.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
