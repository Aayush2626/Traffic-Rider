import React, { useState } from "react";
import Game from "./components/Game";
import "./App.css";

export default function App() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>🏍️ Traffic Rider</h1>
      </header>

      {!playing && (
        <main className="landing">
          <button
            className="play-button"
            onClick={() => setPlaying(true)}
          >
            ▶ Play Game
          </button>
          <p className="tagline">
            Dodge traffic and score as high as you can!
          </p>
        </main>
      )}

      {playing && <Game />}

      <footer className="app-footer">
        © {new Date().getFullYear()} Traffic Rider
      </footer>
    </div>
  );
}
