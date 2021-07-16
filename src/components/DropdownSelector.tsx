import React, { FC, useState } from "react";
import { AlgoTypes } from "../types";
import "../css/Dropdown.css";

interface DropdownSelectorContent {
  currentSelection: AlgoTypes;
  setCurrentSelection: React.Dispatch<React.SetStateAction<AlgoTypes>>;
}
const DropdownSelector: FC<DropdownSelectorContent> = ({
  currentSelection,
  setCurrentSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [currentSelection, setCurrentSelection] = useState(AlgoTypes.BFS);

  const optionSelect = (optioSelected: AlgoTypes) => {
    setCurrentSelection(optioSelected);
    setIsOpen(false);
  };
  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="dropdown-container">
        {currentSelection}
      </div>
      {isOpen && (
        <div className="dropdown-selector">
          {Object.entries(AlgoTypes).map((option) => {
            return (
              <div
                className="dropdown-option"
                onClick={() => optionSelect(option[1])}
              >
                {option[1]}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default DropdownSelector;
