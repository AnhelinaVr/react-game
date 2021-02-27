import React, { useEffect, useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells, audioPlay } from "../../utils";
import Button from "../Button";
import { CellState, CellValue, Face, Cell, Statistics } from "../../types";
import { levels } from "../../constants";
import Menu from "../Menu";
import WonForm from "../WonForm";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells(0));
  const [face, setFace] = useState<Face>(Face.Smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");

  // audioPlay("music", volume);

  useEffect(() => {
    const parsedCells = localStorage.getItem("minesweeperCells") || "";
    const parsedBombCounter = localStorage.getItem("minesweeperBombs") || "";
    const parsedTime = localStorage.getItem("minesweeperTime") || "";
    const parsedStatistics =
      localStorage.getItem("minesweeperStatistics") || "[]";
    const parsedLevel = localStorage.getItem("minesweeperLevel") || 0;
    const parsedName = localStorage.getItem("minesweeperName") || "";
    setStatistics(JSON.parse(parsedStatistics));
    setLevel(+parsedLevel);
    if (parsedCells || parsedBombCounter || parsedTime) {
      setBombCounter(JSON.parse(parsedBombCounter));
      setTime(JSON.parse(parsedTime));
      setLive(true);
      setCells(JSON.parse(parsedCells));
      return;
    }
    setBombCounter(levels[+parsedLevel].NUM_OF_BOMBS);
    setCells(generateCells(+parsedLevel));
    setPlayerName(parsedName);
  }, []);

  useEffect(() => {
    if (hasWon || hasLost || !live) localStorage.clear();
    else {
      localStorage.setItem("minesweeperCells", JSON.stringify(cells) || "");
      localStorage.setItem("minesweeperBombs", bombCounter.toString() || "");
      localStorage.setItem("minesweeperTime", time.toString() || "");
    }
    localStorage.setItem("minesweeperStatistics", JSON.stringify(statistics));
    localStorage.setItem("minesweeperName", playerName);
    localStorage.setItem("minesweeperLevel", level.toString());
  }, [
    cells,
    bombCounter,
    time,
    hasLost,
    hasWon,
    statistics,
    live,
    level,
    playerName,
  ]);

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
      if (!playerName) renderWonForm();
      else {
        statistics.push({
          name: playerName,
          time: time,
        });
        setStatistics(statistics); // TODO: Fix!!! only unique elements
        localStorage.setItem(
          "minesweeperStatistics",
          JSON.stringify(statistics)
        );
      }

      setLive(false);
      setFace(Face.Won);
    }
  }, [hasWon, statistics, time, playerName]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();

    // start the game
    if (!live) {
      let isABomb = newCells[rowParam][colParam].value === CellValue.Bomb;
      while (isABomb) {
        newCells = generateCells(level);
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
      audioPlay("bomb_click", volume);
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam, colParam, level);
    } else {
      newCells[rowParam][colParam].state = CellState.Visible;
    }
    audioPlay("click", volume);

    // check if you won

    let safeOpenCellsExists = false;
    const MAX_ROWS = levels[level].MAX_ROWS;
    const MAX_COLS = levels[level].MAX_COLS;
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
    setCells(generateCells(level));
    setBombCounter(levels[level].NUM_OF_BOMBS);
    setHasLost(false);
    setHasWon(false);
  };

  const handleLevelChange = () => (
    e: React.MouseEvent<HTMLSelectElement, MouseEvent>
  ): void => {
    const newLevel = +e.currentTarget.value;
    setLevel(newLevel);
    setLive(false);
    setHasLost(false);
    setHasWon(false);
    setTime(0);
    setCells(generateCells(newLevel));
    setBombCounter(levels[newLevel].NUM_OF_BOMBS);
  };

  const handleVolumeChange = (range?: number) => (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ): void => {
    if (range !== undefined) setVolume(range);
    else setVolume(+e.currentTarget.value);
  };

  const handleWonFormSubmit = (name: string) => (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setPlayerName(name);
    setFormVisible(false);
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

  const renderWonForm = (): void => {
    setFormVisible(true);
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
      <WonForm onClick={handleWonFormSubmit} visible={formVisible} />
      <Menu
        level={level}
        volume={volume}
        statistics={statistics}
        levelChange={handleLevelChange}
        rangeChange={handleVolumeChange}
      />
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className={`Body level-${level}`}>{renderCells()}</div>
    </div>
  );
};

export default App;
