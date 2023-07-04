import React from "react";
import logo from "../../assets/logo.svg";

interface ViewBaseCardProps {
  children: React.ReactNode;
}

export default function ViewBaseCard({ children }: ViewBaseCardProps) {
  return (
    <div className="w-screen min-h-screen fixed flex justify-center items-center backdrop-brightness-[.3] z-20 px-4 py-4 overflow-auto">
      <div className="shadow-[0px_4px_20px_0px_rgba(0,_0,_0,_0.05)] bg-[#fff] rounded-[0.5rem] flex flex-col w-full md:w-1/3 justify-start items-center gap-4 py-7 px-7 md:px-12 overflow-auto">
        <img src={logo} className="w-[200px] h-24" alt="kwikpik_logo" />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
