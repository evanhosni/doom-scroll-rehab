import React, { createContext, ReactNode, useContext, useState } from "react";

interface NewsfeedContextType {
  previouslyUsed: string[];
  setPreviouslyUsed: React.Dispatch<React.SetStateAction<string[]>>;
}

const Context = createContext<NewsfeedContextType | null>(null);

export const useNewsfeedContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useNewsfeedContext must be used within a NewsfeedContextProvider");
  }
  return context;
};

export const NewsfeedContextProvider = ({ children }: { children: ReactNode }) => {
  const [previouslyUsed, setPreviouslyUsed] = useState<string[]>([]);

  return <Context.Provider value={{ previouslyUsed, setPreviouslyUsed }}>{children}</Context.Provider>;
};
