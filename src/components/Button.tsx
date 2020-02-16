import React from "react";
import classNames from "classnames";

interface IButton {
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<IButton> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      className={classNames("bg-blue-600 text-white rounded py-2 px-6", {
        "opacity-50": disabled
      })}
    >
      {children}
    </button>
  );
};

export default Button;
