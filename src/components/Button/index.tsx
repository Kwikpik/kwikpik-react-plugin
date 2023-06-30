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
      className={`flex justify-center items-center ${
        appliedStyle === "primary"
          ? "rounded-[8px] bg-[#0f0e0b] px-5 py-3"
          : "rounded-[4px] bg-transparent border border-[#0f0e0b] px-2 py-1"
      }`}
    >
      {label}
    </button>
  );
};

export default Button;
