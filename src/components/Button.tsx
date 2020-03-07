import React from "react";
import classNames from "classnames";

interface IButton {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  type?: "small";
  secondary?: boolean;
}

const Button: React.FC<IButton> = ({
  onClick,
  className = "",
  disabled,
  children,
  type,
  secondary
}) => {
  const isSmall = type === "small";
  return (
    <button
      onClick={onClick}
      className={classNames(
        `${className}
         button
         uppercase
         font-bold
         tracking-widest
         active:outline-none
         focus:outline-none`,
        {
          "button--small": isSmall,
          "py-1": isSmall,
          "px-2": isSmall,
          "py-4": !isSmall,
          "px-10": !isSmall,
          "opacity-50": disabled,
          "text-white": !secondary,
          "text-gray-400": secondary
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
