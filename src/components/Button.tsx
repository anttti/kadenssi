import React from "react";
import classNames from "classnames";

interface IButton {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  small?: boolean;
  secondary?: boolean;
  style?: object;
}

const Button: React.FC<IButton> = ({
  onClick,
  className = "",
  disabled,
  children,
  small,
  secondary,
  style
}) => {
  return (
    <button
      style={style}
      onClick={onClick}
      className={classNames(
        `${className}
         active:outline-none
         focus:outline-none
         border
         rounded`,
        {
          "py-1 px-2 border-transparent text-gray-500": small,
          "py-2 px-6": !small,
          "opacity-50": disabled,
          "bg-blue-600 border-blue-600 text-white": !secondary && !small,
          "border-gray-500 text-gray-700": secondary
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
