import React from "react";
import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  red?: boolean;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  onContext,
  onClick,
  state,
  value,
  red,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.Visible) {
      if (value === CellValue.Bomb)
        return (
          <span role="img" aria-label="bomb">
            💣
          </span>
        );
      else if (value === CellValue.None) {
        return null;
      }
      return value;
    } else if (state === CellState.Flagged) {
      return (
        <span role="img" aria-label="flag">
          🚩
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`Button ${state === CellState.Visible ? "visible" : ""} 
      value-${value} 
      ${red ? "red" : ""}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
      tabIndex={col + 1}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
