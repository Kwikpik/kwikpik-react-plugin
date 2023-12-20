import React, { createContext, useContext } from "react";
import DispatchView from "../views/dispatch";

interface KwikPikContextInterface {
  apiKey: string;
  mapsApiKey?: string;
  environment?: "dev" | "prod";
}

type OptionalKwikPikContextInterface<T> = {
  [Property in keyof T]?: T[Property];
};

const KwikPikContext = createContext<KwikPikContextInterface>({
  apiKey: "",
});

export const KwikPikContextProvider = ({
  children,
  apiKey = "",
  mapsApiKey,
  environment = "prod",
}: OptionalKwikPikContextInterface<KwikPikContextInterface> & { children: any }) => {
  return <KwikPikContext.Provider value={{ apiKey, mapsApiKey, environment }}>{children}</KwikPikContext.Provider>;
};

export const useKwikPikContext = () => useContext(KwikPikContext);

export const useContextDispatchView = () => {
  const { apiKey, mapsApiKey, environment } = useKwikPikContext();
  return ({ onClose, visible }: { onClose?: React.MouseEventHandler<HTMLButtonElement>; visible?: boolean }) =>
    visible ? DispatchView({ apiKey, mapsApiKey, environment, onClose }) : undefined;
};
