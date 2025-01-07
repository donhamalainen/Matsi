import React, { useContext, createContext, useState } from "react";
import Loading from "@/components/Loading";

type LoadingContextType = {
  showLoading: () => void;
  hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);
  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {isLoading && <Loading />}
    </LoadingContext.Provider>
  );
};
