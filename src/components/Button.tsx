import React from "react";
import classNames from "classnames";

interface IButton {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  type?: "small";
}

const Button: React.FC<IButton> = ({
  onClick,
  className,
  disabled,
  children,
  type
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
         text-white
         tracking-widest
         active:outline-none
         focus:outline-none`,
        {
          "button--small": isSmall,
          "py-1": isSmall,
          "px-2": isSmall,
          "py-4": !isSmall,
          "px-10": !isSmall,
          "opacity-50": disabled
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
