import React, { useState } from "react";
import { Statistics } from "../../types";
import "./Menu.scss";

interface MenuProps {
  level: number;
  soundVolume: number;
  musicVolume: number;
  statistics: Statistics[];
  levelChange(): (...args: any[]) => void;
  soundRangeChange(range?: number, music?: boolean): (...args: any[]) => void;
  musicRangeChange(range?: number, music?: boolean): (...args: any[]) => void;
}

const Menu: React.FC<MenuProps> = ({
  level,
  soundVolume,
  musicVolume,
  statistics,
  levelChange,
  soundRangeChange,
  musicRangeChange,
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
        <div className="sound">
          <button
            onClick={
              soundVolume === 0 ? soundRangeChange(100) : soundRangeChange(0)
            }
          >
            Sound on/off
          </button>
          <input
            min="0"
            max="100"
            value={soundVolume}
            type="range"
            onChange={soundRangeChange()}
          ></input>
        </div>
        <div className="music">
          <button
            onClick={
              musicVolume === 0 ? musicRangeChange(100) : musicRangeChange(0)
            }
          >
            Music on/off
          </button>
          <input
            min="0"
            max="100"
            value={musicVolume}
            type="range"
            onChange={musicRangeChange()}
          ></input>
        </div>
        <button onClick={showStat()}>{statButton}</button>
        <div className={`Statistics ${statVisible ? "visible" : ""}`}>
          {statistics.map((item) => `${item.name} : ${item.time}\n`)}
        </div>
      </div>
    </div>
  );
};

export default Menu;
