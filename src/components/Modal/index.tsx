import React from "react";
import "./Modal.scss";

interface ModalProps {
  title: string;
  text: string;
  isOpened: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, text, isOpened }) => {
  return (
    <div className={`Modal ${isOpened ? "open" : "close"}`}>
      <div className={`Modal__body `}>
        <div className="Modal__close">x</div>
        <h2>{title}</h2>
        <hr />
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Modal;
