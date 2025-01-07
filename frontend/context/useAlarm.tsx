import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alarm } from "@/components/Alarm";

type AlarmProps = {
  type?: "success" | "error" | "warning";
  title: string;
  message?: string;
  duration?: number;
};

type AlarmContextType = {
  showAlarm: (props: AlarmProps) => void;
};

// Context
const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

// Custom Hook
export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error("useAlarm must be used within an AlarmProvider");
  }
  return context;
};

// Provider
export const AlarmProvider = ({ children }: { children: ReactNode }) => {
  const [alarm, setAlarm] = useState<AlarmProps | null>(null);

  const showAlarm = (props: AlarmProps) => {
    setAlarm(props);
  };

  const handleClose = () => {
    setAlarm(null);
  };

  return (
    <AlarmContext.Provider value={{ showAlarm }}>
      {children}
      {/* Näytä Alarm, jos tilassa on dataa */}
      {alarm && (
        <Alarm
          type={alarm.type}
          title={alarm.title}
          message={alarm.message}
          duration={alarm.duration || 3000}
          onClose={handleClose}
        />
      )}
    </AlarmContext.Provider>
  );
};
