import "./styles/index.css";
import { MouseEventHandler } from "react";
import Button from "./components/Button";
import DispatchView, { DispatchViewProps } from "./views/dispatch";

export const useStandaloneDispatchView =
  (props: Omit<DispatchViewProps, "onClose">) =>
  ({ onClose, visible }: { onClose?: MouseEventHandler<HTMLButtonElement>; visible?: boolean }) =>
    visible ? DispatchView({ ...props, onClose }) : undefined;

const ModifiedDispatchView = ({ visible, ...props }: DispatchViewProps & { visible?: boolean }) =>
  visible ? DispatchView({ ...props }) : undefined;

export { Button as CustomButton, ModifiedDispatchView as DispatchView };
export * from "./context";
