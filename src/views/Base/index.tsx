import React, { MouseEventHandler } from "react";
import logo from "../../assets/logo.svg";
import { FiX } from "react-icons/fi";

interface ViewBaseCardProps {
  children: React.ReactNode;
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

export default function ViewBaseCard({ children, onClose }: ViewBaseCardProps) {
  return (
    <div className="w-screen min-h-screen absolute flex flex-col-reverse md:flex-row justify-start md:justify-center items-center md:items-start gap-5 backdrop-brightness-[.3] z-20 px-3 py-8 overflow-auto">
      <div className="shadow-[0px_4px_20px_0px_rgba(0,_0,_0,_0.05)] bg-[#fff] rounded-[0.5rem] flex flex-col w-full md:w-1/3 justify-start items-center gap-4 py-7 px-7 md:px-12 overflow-auto">
        <img src={logo} className="w-[150px] h-24" alt="kwikpik_logo" />
        <div className="w-full overflow-auto">{children}</div>
      </div>
      <button className="btn btn-circle btn-neutral btn-sm" onClick={onClose}>
        <FiX />
      </button>
    </div>
  );
}
