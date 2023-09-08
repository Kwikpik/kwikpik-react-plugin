import "./styles/index.css";
import { Fragment, MouseEventHandler, createElement } from "react";
import Button from "./components/Button";
import DispatchView, { DispatchViewProps } from "./views/dispatch";

export const useStandaloneDispatchView =
  (props: Omit<DispatchViewProps, "onClose">) =>
  ({ onClose, visible }: { onClose?: MouseEventHandler<HTMLButtonElement>; visible?: boolean }) =>
    visible ? DispatchView({ ...props, onClose }) : createElement(Fragment, null);

export { Button as KwikPikCustomButton, DispatchView as KwikPikDispatchView };
export * from "./context";
