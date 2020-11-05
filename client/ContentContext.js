import { createContext, useContext } from "react";

export const ContentContext = createContext({});

export const useContent = (path) => {
  const ctx = useContext(ContentContext);
  if (!path) return ctx;
  return ctx[path];
};
