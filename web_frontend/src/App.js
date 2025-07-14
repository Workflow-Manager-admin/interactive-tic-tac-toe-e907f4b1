import React, { useState } from "react";
import "./App.css";

/**
 * Minimalistic, modern, centered Tic Tac Toe game (3x3 board) for two players on a single device.
 * Features:
 * - Interactive board
 * - Move history
 * - Real-time win/draw detection
 * - Game reset/start controls
 * - Turn/status indicator
 * - Responsive layout, light theme, custom color variables
 */

// Reusable square component
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value === "X" ? "var(--primary)" : value === "O" ? "var(--accent)" : "var(--text-primary)",
        background: highlight ? "rgba(232, 57, 53, 0.08)" : "var(--square-bg)",
        fontWeight: highlight ? "bold" : 500,
      }}
      aria-label={value ? `${value} placed` : "Empty"}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// Board component
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="ttt-board">
      {squares.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const index = rowIdx * 3 + colIdx;
          const isWinning = winningLine?.includes(index);
          return (
            <Square
              key={index}
              value={cell}
              onClick={() => onSquareClick(rowIdx, colIdx)}
              highlight={isWinning}
            />
          );
        })
      )}
    </div>
  );
}

// Calculate winner or draw
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diags
    [0, 4, 8],
    [2, 4, 6],
  ];
  const flat = squares.flat();
  for (let line of lines) {
    const [a, b, c] = line;
    if (flat[a] && flat[a] === flat[b] && flat[a] === flat[c]) {
      return { winner: flat[a], line };
    }
  }
  if (flat.every(x => x)) {
    return { draw: true };
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // 2d array for the board, 3x3
  const empty = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  const [history, setHistory] = useState([{ squares: empty, player: "X", move: null }]);
  const [step, setStep] = useState(0);

  const current = history[step];
  const squares = current.squares.map(row => [...row]); // deep copy for immutability

  // Calculate game status
  const result = calculateWinner(squares);
  const nextPlayer = step === 0 || result?.winner || result?.draw
    ? current.player
    : history[step - 1].player === "X"
    ? "O"
    : "X";

  // Handle square click
  const handleSquareClick = (row, col) => {
    if (result?.winner || result?.draw || squares[row][col]) return;
    squares[row][col] = current.player;
    const moveDetail = { squares: squares.map(row => [...row]), player: current.player === "X" ? "O" : "X", move: { row, col, player: current.player } };
    setHistory(prev => prev.slice(0, step + 1).concat(moveDetail));
    setStep(step + 1);
  };

  // Start/reset the game
  // PUBLIC_INTERFACE
  const handleReset = () => {
    setHistory([{ squares: empty, player: "X", move: null }]);
    setStep(0);
  };

  // Move backwards in history
  const jumpTo = idx => {
    setStep(idx);
  };

  // Status indicator text
  let status;
  if (result?.winner) {
    status = (
      <span>
        <span style={{ color: "var(--primary)", fontWeight: 600 }}>
          {result.winner}
        </span>{" "}
        wins!
      </span>
    );
  } else if (result?.draw) {
    status = <span style={{ color: "var(--accent)" }}>Draw!</span>;
  } else {
    status = (
      <span>
        Turn:&nbsp;
        <span style={{ color: nextPlayer === "X" ? "var(--primary)" : "var(--accent)", fontWeight: 600 }}>
          {nextPlayer}
        </span>
      </span>
    );
  }

  // List of moves
  const moveList = history.slice(1).map((h, idx) => (
    <li key={idx}>
      <button className={`ttt-move-btn${step === idx + 1 ? " ttt-move-btn-active" : ""}`} onClick={() => jumpTo(idx + 1)}>
        #{idx + 1}: {h.move ? `(${h.move.row + 1}, ${h.move.col + 1})` : ""} {h.move ? h.move.player : null}
      </button>
    </li>
  ));

  // Find winning line
  const winningLine = result?.winner ? result.line : null;

  return (
    <div className="App">
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <Board squares={squares} onSquareClick={handleSquareClick} winningLine={winningLine} />
        <section className="ttt-control-panel">
          <div className="ttt-status" role="status" aria-live="polite">{status}</div>
          <button className="ttt-reset-btn" onClick={handleReset} aria-label="Reset Game">
            {step === 0 || (!result?.winner && !result?.draw) ? "Start New Game" : "Reset"}
          </button>
        </section>
        <aside className="ttt-move-history">
          <div className="ttt-move-history-title">Moves:</div>
          <ol className="ttt-move-list">{moveList.length > 0 ? moveList : <li>No moves yet.</li>}</ol>
        </aside>
      </main>
    </div>
  );
}

export default App;
