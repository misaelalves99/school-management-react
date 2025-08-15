// src/hooks/useSubjects.ts

import { useContext } from "react";
import { SubjectsContext } from "../contexts/Subjects/SubjectsContext";

export const useSubjects = () => {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error("useSubjects must be used within a SubjectsProvider");
  }
  return context;
};
