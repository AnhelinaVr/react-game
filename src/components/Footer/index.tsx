import React from "react";
import "./Footer.scss";

import rssLogo from "../../assets/rs_school_js.svg";

const Footer: React.FC = () => {
  return (
    <footer className="Footer">
      <a className="link" href="https://github.com/AnhelinaVr">
        Anhelina Vrubleuskaya 2021
      </a>

      <a href="https://rs.school/js/">
        <img src={rssLogo} alt="RSSchool" />
      </a>
    </footer>
  );
};

export default Footer;
