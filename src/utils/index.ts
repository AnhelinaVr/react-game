import React from "react";
import { levels } from "../constants";
import { Cell, CellValue, CellState } from "../types";
// import audioURL from "../assets/click.mp3";

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number,
  lvlNum: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const MAX_ROWS = levels[lvlNum].MAX_ROWS;
  const MAX_COLS = levels[lvlNum].MAX_COLS;
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < MAX_COLS - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

export const generateCells = (lvlNum: number): Cell[][] => {
  const MAX_ROWS = levels[lvlNum].MAX_ROWS;
  const MAX_COLS = levels[lvlNum].MAX_COLS;
  const NUM_OF_BOMBS = levels[lvlNum].NUM_OF_BOMBS;
  let cells: Cell[][] = [];

  // generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.None,
        state: CellState.Open,
      });
    }
  }

  // randomly put 10 bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NUM_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.Bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
              value: CellValue.Bomb,
            };
          }

          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  // calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.Bomb) {
        continue;
      }

      let numberOfBombs = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
      } = grabAllAdjacentCells(cells, rowIndex, colIndex, lvlNum);

      if (topLeftCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (topCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (topRightCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (leftCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (rightCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (bottomLeftCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (bottomCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (bottomRightCell?.value === CellValue.Bomb) {
        numberOfBombs++;
      }

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number,
  lvlNum: number
): Cell[][] => {
  const currentCell = cells[rowParam][colParam];

  if (
    currentCell.state === CellState.Visible ||
    currentCell.state === CellState.Flagged
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][colParam].state = CellState.Visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  } = grabAllAdjacentCells(cells, rowParam, colParam, lvlNum);

  if (
    topLeftCell?.state === CellState.Open &&
    topLeftCell.value !== CellValue.Bomb
  ) {
    if (topLeftCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam - 1,
        lvlNum
      );
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.Visible;
    }
  }

  if (topCell?.state === CellState.Open && topCell.value !== CellValue.Bomb) {
    if (topCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam, lvlNum);
    } else {
      newCells[rowParam - 1][colParam].state = CellState.Visible;
    }
  }

  if (
    topRightCell?.state === CellState.Open &&
    topRightCell.value !== CellValue.Bomb
  ) {
    if (topRightCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam + 1,
        lvlNum
      );
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.Visible;
    }
  }

  if (leftCell?.state === CellState.Open && leftCell.value !== CellValue.Bomb) {
    if (leftCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam, colParam - 1, lvlNum);
    } else {
      newCells[rowParam][colParam - 1].state = CellState.Visible;
    }
  }

  if (
    rightCell?.state === CellState.Open &&
    rightCell.value !== CellValue.Bomb
  ) {
    if (rightCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam, colParam + 1, lvlNum);
    } else {
      newCells[rowParam][colParam + 1].state = CellState.Visible;
    }
  }

  if (
    bottomLeftCell?.state === CellState.Open &&
    bottomLeftCell.value !== CellValue.Bomb
  ) {
    if (bottomLeftCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam - 1,
        lvlNum
      );
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.Visible;
    }
  }

  if (
    bottomCell?.state === CellState.Open &&
    bottomCell.value !== CellValue.Bomb
  ) {
    if (bottomCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam, lvlNum);
    } else {
      newCells[rowParam + 1][colParam].state = CellState.Visible;
    }
  }

  if (
    bottomRightCell?.state === CellState.Open &&
    bottomRightCell.value !== CellValue.Bomb
  ) {
    if (bottomRightCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam + 1,
        lvlNum
      );
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.Visible;
    }
  }

  return newCells;
};

export const audioPlay = (path: string, volume: number): void => {
  const audioURL = require(`../assets/${path}.mp3`);
  let audio = new Audio(audioURL.default);
  console.log(volume);
  audio.volume = volume / 100; // range [0...1] instead of input range [0...100]
  audio.play();
};
