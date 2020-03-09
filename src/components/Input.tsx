import React from "react";

interface IInput {
  onChange: (str: string) => void;
  title: string;
  value: string | number;
  placeholder: string;
  inputRef?: any;
  type?: "text" | "number";
  id: string;
}

const Input: React.FC<IInput> = ({
  title,
  value,
  type,
  placeholder,
  onChange,
  id,
  inputRef
}) => {
  return (
    <>
      <label
        htmlFor={id}
        className="block uppercase tracking-widest text-gray-600 text-xs font-bold mb-2"
      >
        {title}
      </label>
      <input
        id={id}
        type={type}
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-100 ease-in-out"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        ref={inputRef}
      />
    </>
  );
};

export default Input;
