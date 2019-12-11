import React, { createContext, useContext, useState } from "react";

//@ts-ignore
const MapCtx = createContext<{
  selectedId: string;
  setSelectedId: (id: string) => void;
}>({ selectedId: "", setSelectedId: () => {} });

export const MapCtxProvider = (props: any) => {
  const [selectedId, setSelectedId] = useState("ZDurqmZPvp8b5f0GXQQ1");

  return <MapCtx.Provider value={{ selectedId, setSelectedId }} {...props} />;
};

export const useMapCtx = () => {
  const { selectedId, setSelectedId } = useContext(MapCtx);
  const ctx = useContext(MapCtx);
  if (!ctx) throw new Error("useMapCtx must be a descendant of MapCtxProvider");
  return { selectedId, setSelectedId };
};
