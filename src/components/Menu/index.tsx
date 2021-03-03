import React, { useEffect, useState } from "react";
import { Statistics } from "../../types";
import { sortStat } from "../../utils";
import "./Menu.scss";
import Modal from "../Modal";
import WonForm from "../WonForm";

interface MenuProps {
  level: number;
  mode: number;

  soundVolume: number;
  musicVolume: number;
  statistics: Statistics[];
  levelChange(level?: number): (...args: any[]) => void;
  modeChange(mode?: number): (...args: any[]) => void;

  soundRangeChange(range?: number, music?: boolean): (...args: any[]) => void;
  musicRangeChange(range?: number, music?: boolean): (...args: any[]) => void;
  onFormClick(name: string): (...args: any[]) => void;
  formVisible: boolean;
}

const Menu: React.FC<MenuProps> = ({
  level,
  mode,

  soundVolume,
  musicVolume,
  formVisible,
  statistics,
  levelChange,
  modeChange,
  soundRangeChange,
  musicRangeChange,
  onFormClick,
}) => {
  const [statVisible, setStatVisible] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [musicVol, setMusicVol] = useState<number>(musicVolume);
  const [soundVol, setSoundVol] = useState<number>(soundVolume);
  const [theme, setTheme] = useState<number>(0);

  useEffect(() => {
    musicRangeChange(musicVol)();
  }, [musicVol]);

  useEffect(() => {
    soundRangeChange(soundVol)();
  }, [soundVol]);

  const handleKeyDown = (e: any): void => {
    if (e.ctrlKey) {
      if (e.key === "s") {
        e.preventDefault();
        statVisible ? setStatVisible(false) : setStatVisible(true);
      }
      if (e.key === "m") {
        e.preventDefault();
        musicVol === 0 ? setMusicVol(100) : setMusicVol(0);
      }
      if (e.key === "b") {
        e.preventDefault();
        soundVol === 0 ? setSoundVol(100) : setSoundVol(0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [musicVol, soundVol, statVisible]);

  useEffect(() => {
    const themes = ["red", "green"];
    const body =
      document.querySelector("body") ||
      document.querySelector("html") ||
      document.createElement("div");
    body.style.backgroundColor = themes[theme];
  }, [theme]);

  const getStat = (): React.ReactNode => {
    let sortedStat: Statistics[] = [];
    if (statistics.length !== 0)
      sortedStat = sortStat(statistics).splice(0, 10);
    return (
      <ul>
        {sortedStat.map((item, index) => (
          <li key={index}>
            {item.name} : {item.time}
          </li>
        ))}
      </ul>
    );
  };

  const showMenu = () => {
    menuVisible ? setMenuVisible(false) : setMenuVisible(true);
  };

  const handleModalClose = (): void => {
    setStatVisible(false);
  };

  const handleThemeChange = () => (e: any) => {
    setTheme(+e.currentTarget.value);
  };

  return (
    <div className="Menu">
      <button className="hideMenu" onClick={showMenu}>
        Menu
      </button>
      <div className={`wrapper ${menuVisible ? "" : "hidden"}`}>
        <select name="level" value={level} onChange={levelChange()}>
          <option value="0">Easy</option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>
        <select name="mode" value={mode} onChange={modeChange()}>
          <option value="0">Classical</option>
          <option value="1">Challenge</option>
        </select>
        <select name="theme" value={theme} onChange={handleThemeChange()}>
          <option value="0">Easy</option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>
        <div className="sound">
          <button
            onClick={() => (soundVol === 0 ? setSoundVol(100) : setSoundVol(0))}
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
            onClick={() => (musicVol === 0 ? setMusicVol(100) : setMusicVol(0))}
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
        <button onClick={() => setStatVisible(true)}>Show statistics</button>
      </div>
      <Modal
        title={formVisible ? "Enter your name" : "Statistics"}
        text={
          formVisible ? (
            <WonForm visible={formVisible} onClick={onFormClick} />
          ) : (
            getStat()
          )
        }
        isOpened={formVisible || statVisible}
        onModalClose={handleModalClose}
      />
    </div>
  );
};

export default Menu;
