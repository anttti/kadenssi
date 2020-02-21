import React from "react";
import classNames from "classnames";

interface IButton {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<IButton> = ({
  onClick,
  className,
  disabled,
  children
}) => {
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
         rounded
         py-4
         px-10
         active:outline-none
         focus:outline-none`,
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
