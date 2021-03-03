import React, { useState } from "react";

interface WonFormProps {
  visible: boolean;
  onClick(name: string): (...args: any[]) => void;
}

const WonForm: React.FC<WonFormProps> = ({ visible, onClick }) => {
  const [name, setName] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  if (visible)
    return (
      <div className="WonForm">
        <form action="" className="Form">
          <input type="text" required onChange={handleNameChange} />
          <button type="submit" onClick={onClick(name)}>
            Submit
          </button>
        </form>
      </div>
    );
  else return null;
};

export default WonForm;
