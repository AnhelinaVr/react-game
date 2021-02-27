import React, { useState } from "react";
import { Statistics } from "../../types";
import "./Menu.scss";

interface MenuProps {
  level: number;
  volume: number;
  statistics: Statistics[];
  levelChange(): (...args: any[]) => void;
  rangeChange(range?: number): (...args: any[]) => void;
}

const Menu: React.FC<MenuProps> = ({
  level,
  volume,
  statistics,
  levelChange,
  rangeChange,
}) => {
  const [statVisible, setStatVisible] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [statButton, setStatButton] = useState<string>("Show statistics");

  const showStat = () => (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (statVisible) {
      setStatButton("Show statistics");
      setStatVisible(false);
    } else {
      setStatButton("Hide statistics");
      setStatVisible(true);
    }
  };
  const showMenu = () => (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (menuVisible) {
      setMenuVisible(false);
    } else {
      setMenuVisible(true);
    }
  };

  return (
    <div className="Menu">
      <button className="hideMenu" onClick={showMenu()}>
        Menu
      </button>
      <div className={`wrapper ${menuVisible ? "" : "hidden"}`}>
        <select name="level" value={level} onChange={levelChange()}>
          <option value="0">Easy</option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>
        <button onClick={volume === 0 ? rangeChange(100) : rangeChange(0)}>
          Sound on/off
        </button>
        <input
          min="0"
          max="100"
          value={volume}
          type="range"
          onChange={rangeChange()}
        ></input>
        <button onClick={showStat()}>{statButton}</button>
        <div className={`Statistics ${statVisible ? "visible" : ""}`}>
          {statistics.map((item) => `${item.name} : ${item.time}\n`)}
        </div>
      </div>
    </div>
  );
};

export default Menu;
