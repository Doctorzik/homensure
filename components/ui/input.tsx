import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const Input: React.FC<InputProps> = ({ label, name, ...props }) => {
  // Merge custom className with defaults, and apply special style for disabled
  const { className = '', disabled, ...rest } = props;
  const base = "w-full border border-gray-300 rounded-2xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const disabledStyle = disabled ? "bg-gray-100 cursor-not-allowed" : "";
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`${base} ${disabledStyle} ${className}`.trim()}
        disabled={disabled}
        {...rest}
      />
    </div>
  );
};

export default Input;
