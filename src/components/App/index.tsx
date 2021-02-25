import React, { useEffect, useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import Button from "../Button";
import { CellState, CellValue, Face, Cell } from "../../types";
import { MAX_ROWS, MAX_COLS } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());
  const [face, setFace] = useState<Face>(Face.Smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<number[]>([]);

  useEffect(() => {
    const parsedCells = localStorage.getItem("minesweeperCells") || "";
    const parsedBombCounter = localStorage.getItem("minesweeperBombs") || "";
    const parsedTime = localStorage.getItem("minesweeperTime") || "";
    const parsedStatistics =
      localStorage.getItem("minesweeperStatistics") || "";
    setStatistics(JSON.parse(parsedStatistics));
    if (!parsedCells || !parsedBombCounter || !parsedTime) return;
    else {
      setCells(JSON.parse(parsedCells));
      setBombCounter(JSON.parse(parsedBombCounter));
      setTime(JSON.parse(parsedTime));
      setLive(true);
    }
  }, []);

  useEffect(() => {
    if (hasWon || hasLost || !live) {
      localStorage.clear();
      localStorage.setItem("minesweeperStatistics", JSON.stringify(statistics));
    } else {
      localStorage.setItem("minesweeperCells", JSON.stringify(cells) || "");
      localStorage.setItem("minesweeperBombs", bombCounter.toString() || "");
      localStorage.setItem("minesweeperTime", time.toString() || "");
      localStorage.setItem("minesweeperStatistics", JSON.stringify(statistics));
    }
  }, [cells, bombCounter, time, hasLost, hasWon, statistics, live]);

  useEffect(() => {
    const handleMouseDown = (): void => setFace(Face.Oh);
    const handleMouseUp = (): void => setFace(Face.Smile);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => setTime(time + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [live, time]);

  useEffect(() => {
    if (hasLost) {
      setFace(Face.Lost);
      setLive(false);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      statistics.push(time);
      setStatistics([...new Set(statistics)].sort()); // TODO: Fix!!! only unique elements
      setLive(false);
      setFace(Face.Won);
    }
  }, [hasWon, statistics, time]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();

    // start the game
    if (!live) {
      let isABomb = newCells[rowParam][colParam].value === CellValue.Bomb;
      while (isABomb) {
        newCells = generateCells();
        if (newCells[rowParam][colParam].value !== CellValue.Bomb) {
          isABomb = false;
          break;
        }
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if (
      currentCell.state === CellState.Flagged ||
      currentCell.state === CellState.Visible
    )
      return;

    if (currentCell.value === CellValue.Bomb) {
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
    } else {
      newCells[rowParam][colParam].state = CellState.Visible;
    }

    // check if you won

    let safeOpenCellsExists = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];
        if (
          currentCell.value !== CellValue.Bomb &&
          currentCell.state === CellState.Open
        ) {
          safeOpenCellsExists = true;
          break;
        }
      }
    }

    if (!safeOpenCellsExists) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.Bomb)
            return {
              ...cell,
              state: CellState.Flagged,
            };
          return cell;
        })
      );
      setHasWon(true);
    }

    setCells(newCells);
  };

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if (!live) return;

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];

    if (currentCell.state === CellState.Visible) {
      return;
    } else if (currentCell.state === CellState.Open) {
      currentCells[rowParam][colParam].state = CellState.Flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.Flagged) {
      currentCells[rowParam][colParam].state = CellState.Open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setBombCounter(10);
    setHasLost(false);
    setHasWon(false);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          row={rowIndex}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
          state={cell.state}
          value={cell.value}
          red={cell.red}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();

    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.Bomb) {
          return {
            ...cell,
            state: CellState.Visible,
          };
        } else return cell;
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
