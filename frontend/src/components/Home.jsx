import React, { useState } from "react";
import "./Home.css";
import rat from "../assets/mouse.png";
import destination from "../assets/destination.png";
import obstacle from "../assets/barrier.png";

const Home = () => {
  const [gridSize, setGridSize] = useState(1);
  const [grid, setGrid] = useState([]);
  const [maxTreasure, setMaxTreasure] = useState(null);
  const [path, setPath] = useState([]);

  const generateGrid = () => {
    const newGrid = Array.from({ length: gridSize }, (_, i) =>
      Array.from({ length: gridSize }, (_, j) => {
        if (
          (i === 0 && j === 0) ||
          (i === gridSize - 1 && j === gridSize - 1)
        ) {
          return i === 0 && j === 0 ? "rat" : "destination";
        } else {
          return Math.random() < 0.3
            ? "obstacle"
            : Math.floor(Math.random() * 20) + 1;
        }
      })
    );
    setGrid(newGrid);
    setMaxTreasure(null);
    setPath([]);
  };

  const handleGridSizeChange = (e) => {
    setGridSize(parseInt(e.target.value));
    generateGrid();
  };

  const solvePath = () => {
    const arr = grid.map((row) =>
      row.map((cell) =>
        cell === "obstacle"
          ? -Infinity
          : cell === "rat" || cell === "destination"
          ? 0
          : parseInt(cell)
      )
    );

    const dp = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => -Infinity)
    );

    dp[gridSize - 1][gridSize - 1] = arr[gridSize - 1][gridSize - 1];

    for (let i = gridSize - 1; i >= 0; i--) {
      for (let j = gridSize - 1; j >= 0; j--) {
        if (i === gridSize - 1 && j === gridSize - 1) continue;

        if (arr[i][j] !== -Infinity) {
          if (i < gridSize - 1 && dp[i + 1][j] !== -Infinity) {
            dp[i][j] = Math.max(dp[i][j], dp[i + 1][j] + arr[i][j]);
          }
          if (j < gridSize - 1 && dp[i][j + 1] !== -Infinity) {
            dp[i][j] = Math.max(dp[i][j], dp[i][j + 1] + arr[i][j]);
          }
        }
      }
    }

    const result = dp[0][0];
    if (result === -Infinity) {
      setMaxTreasure("No path exists");
      setPath([]);
    } else {
      setMaxTreasure(result);
      tracePath(dp, arr);
    }

    console.log("DP Array:", dp);
  };

  const tracePath = (dp, arr) => {
    let pathCells = [];
    let i = 0;
    let j = 0;

    while (i < gridSize - 1 || j < gridSize - 1) {
      pathCells.push([i, j]);
      if (i < gridSize - 1 && dp[i + 1][j] + arr[i][j] === dp[i][j]) {
        i++;
      } else if (j < gridSize - 1 && dp[i][j + 1] + arr[i][j] === dp[i][j]) {
        j++;
      }
    }
    pathCells.push([gridSize - 1, gridSize - 1]);
    setPath(pathCells);
  };

  const renderTable = () => {
    return grid.map((row, i) => (
      <tr key={i}>
        {row.map((cell, j) => (
          <td
            key={j}
            className={path.some(([x, y]) => x === i && y === j) ? "red" : ""}
          >
            {cell === "rat" ? (
              <img src={rat} alt="Rat" className="cell-image" />
            ) : cell === "destination" ? (
              <img src={destination} alt="Destination" className="cell-image" />
            ) : cell === "obstacle" ? (
              <img src={obstacle} alt="*" className="cell-image" />
            ) : (
              cell
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="container">
      <div className="input">
        <h1>Welcome to Max Treasure Finder</h1>
        <p>Select the treasure grid size</p>

        <select value={gridSize} onChange={handleGridSizeChange}>
          {Array.from({ length: 50 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <button onClick={generateGrid} className="generate-button">
          Generate Grid
        </button>

        <button onClick={solvePath} className="solve-button">
          Solve
        </button>

        {maxTreasure !== null && (
          <p className="max-treasure">Max Treasure Value: {maxTreasure}</p>
        )}
      </div>

      <div className="solve">
        <table className="grid-table">
          <tbody>{renderTable()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
