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
      className={classNames(
        "text-white rounded py-2 px-6 bg-dark-red text-red",
        {
          "opacity-50": disabled
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
