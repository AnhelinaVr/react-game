import React, { ReactNode, useEffect, useState } from "react";
import "./Modal.scss";

interface ModalProps {
  title: string;
  text: ReactNode;
  isOpened: boolean;
  onModalClose(): void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  text,
  isOpened,
  onModalClose,
}) => {
  return (
    <div className={`Modal ${isOpened ? "open" : "close"}`}>
      <div className={`Modal__body `}>
        <div className="Modal__close" onClick={onModalClose}>
          x
        </div>
        <h2>{title}</h2>
        <hr />
        {text}
      </div>
    </div>
  );
};

export default Modal;
