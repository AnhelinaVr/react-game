import React, { useEffect, useState } from "react";
import { Statistics } from "../../types";
import { sortStat } from "../../utils";
import "./Menu.scss";
import Modal from "../Modal";
import WonForm from "../WonForm";
import theme1 from "../../assets/0.jpg";
import theme2 from "../../assets/1.jpg";
import theme3 from "../../assets/2.jpg";

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
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
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
    const themes = [theme1, theme2, theme3];
    const body =
      document.querySelector("body") ||
      document.querySelector("html") ||
      document.createElement("div");
    body.style.backgroundImage = `url(${themes[theme]})`;
  }, [theme]);

  const getStat = (): React.ReactNode => {
    let sortedStat: Statistics[] = [];
    if (statistics.length !== 0)
      sortedStat = sortStat(statistics).splice(0, 10);
    return (
      <ul className="Statistics__list">
        {sortedStat.map((item, index) => (
          <li key={index}>
            {item.name} : {item.time}
          </li>
        ))}
      </ul>
    );
  };

  const getInfo = (): React.ReactNode => {
    return (
      <div className="info">
        <div className="hotkeys">
          <h4 className="info__title">Hot keys</h4>
          <div className="info__description">
            <ul>
              <li>
                <strong>CTRL + S</strong> - <span>open statistics</span>
              </li>
              <li>
                <strong>CTRL + M</strong> - <span>music on/off</span>
              </li>
              <li>
                <strong>CTRL + B</strong> - <span>sounds on/off</span>
              </li>
              <li>
                <strong>Shift + ↑ </strong> -
                <span>Change level (higher in difficulty)</span>
              </li>
              <li>
                <strong>Shift + ↓ </strong> -
                <span>Change level (lower in difficulty)</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="modes">
          <h4 className="info__title">Modes</h4>
          <div className="info__description">
            <ul>
              <li>
                <strong>Classical </strong> -
                <span>
                  The number on a block shows the number of mines adjacent to it
                  and you have to flag all the mines. (left mouse click)
                  <br /> Put a flag (🚩) in a zone when you have confirmed that
                  there is a mine (right mouse click).
                </span>
              </li>
              <li>
                <strong>Challenge </strong> -
                <span>
                  Instead of numbers, colors are offered to indicate the number
                  of mines nearby.
                </span>
              </li>
            </ul>
            <ul>
              <li>
                <strong style={{ color: "blue" }}>blue = 1</strong>
              </li>
              <li>
                <strong style={{ color: "green" }}>green = 2</strong>
              </li>
              <li>
                <strong style={{ color: "red" }}>red = 3</strong>
              </li>
              <li>
                <strong style={{ color: "purple" }}>purple = 4</strong>
              </li>
              <li>
                <strong style={{ color: "maroon" }}>maroon = 5</strong>
              </li>
              <li>
                <strong style={{ color: "turquoise" }}>turquoise = 6</strong>
              </li>
              <li>
                <strong style={{ color: "black" }}>black = 7</strong>
              </li>
              <li>
                <strong style={{ color: "gray" }}>gray = 8</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const showMenu = () => {
    menuVisible ? setMenuVisible(false) : setMenuVisible(true);
  };

  const handleModalClose = (): void => {
    setStatVisible(false);
    setInfoVisible(false);
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
        <div className="about">
          <button onClick={() => setInfoVisible(true)}>
            Read about <strong>hotkeys</strong> and <strong>modes</strong>
          </button>
        </div>
        <div className="select__group">
          <div className="select__container">
            <h4 className="select__title">Level</h4>
            <select name="level" value={level} onChange={levelChange()}>
              <option value="0">Easy</option>
              <option value="1">Medium</option>
              <option value="2">Hard</option>
            </select>
          </div>
          <div className="select__container">
            <h4 className="select__title">Mode</h4>
            <select name="mode" value={mode} onChange={modeChange()}>
              <option value="0">Classical</option>
              <option value="1">Challenge</option>
            </select>
          </div>
          <div className="select__container">
            <h4 className="select__title">Theme</h4>
            <select name="theme" value={theme} onChange={handleThemeChange()}>
              <option value="0">Red</option>
              <option value="1">Green</option>
              <option value="2">Hard</option>
            </select>
          </div>
        </div>
        <div className="range__container">
          <div className="sound">
            <button
              onClick={() =>
                soundVol === 0 ? setSoundVol(100) : setSoundVol(0)
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
              onClick={() =>
                musicVol === 0 ? setMusicVol(100) : setMusicVol(0)
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
        </div>

        <button onClick={() => setStatVisible(true)}>Show statistics</button>
      </div>
      <Modal
        title={"Enter your name"}
        text={<WonForm visible={formVisible} onClick={onFormClick} />}
        isOpened={formVisible}
        onModalClose={handleModalClose}
      />
      <Modal
        title={"Statistics"}
        text={getStat()}
        isOpened={statVisible}
        onModalClose={handleModalClose}
      />
      <Modal
        title={"Hot keys & modes"}
        text={getInfo()}
        isOpened={infoVisible}
        onModalClose={handleModalClose}
      />
    </div>
  );
};

export default Menu;
