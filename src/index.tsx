import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/App/";
import Footer from "./components/Footer";
import svg from "./assets/fullscreen.svg";

ReactDOM.render(
  <React.StrictMode>
    <button
      className="fullscreen"
      onClick={() => {
        console.log("ssss");
        document.documentElement.requestFullscreen();
      }}
    >
      <img src={svg} alt="fullscreen" />
    </button>
    <App />
    <Footer />
  </React.StrictMode>,
  document.getElementById("root")
);
