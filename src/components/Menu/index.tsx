import React from "react";

interface MenuProps {
  value: number;
  onChange(): (...args: any[]) => void;
}

const Menu: React.FC<MenuProps> = ({ value, onChange }) => {
  const levels = ["easy", "medium", "hard"];
  return (
    <div className="Menu">
      <select name="level" value={value} onChange={onChange()}>
        <option value="0">Easy</option>
        <option value="1">Medium</option>
        <option value="2">Hard</option>
      </select>
    </div>
  );
};

export default Menu;
