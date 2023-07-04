import React from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appliedStyle?: "primary" | "variant";
  label: React.ReactNode;
  width?: string | number;
  height?: string | number;
  onPress?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<CustomButtonProps> = ({ appliedStyle = "primary", width, height, label, onPress, ...props }) => {
  return (
    <button
      {...props}
      onClick={onPress}
      style={{ width, height }}
      className={`flex rounded-[0.25rem] justify-center px-5 py-3 items-center ${
        appliedStyle === "primary" ? "bg-[#0f0e0b] text-[#fff]" : "bg-transparent border border-[#0f0e0b] text-[#000]"
      }`}
    >
      {label}
    </button>
  );
};

export default Button;
