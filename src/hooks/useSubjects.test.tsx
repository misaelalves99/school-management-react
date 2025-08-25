// src/hooks/useSubjects.test.tsx

// src/hooks/useSubjects.test.tsx

import { renderHook } from "@testing-library/react";
import { useSubjects } from "./useSubjects";
import { SubjectsProvider } from "../contexts/Subjects/SubjectsProvider";

describe("useSubjects", () => {
  it("deve lançar erro se usado fora do SubjectsProvider", () => {
    expect(() => renderHook(() => useSubjects())).toThrowError(
      "useSubjects must be used within a SubjectsProvider"
    );
  });

  it("deve retornar o contexto corretamente quando usado dentro do SubjectsProvider", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <SubjectsProvider>{children}</SubjectsProvider>
    );

    const { result } = renderHook(() => useSubjects(), { wrapper });

    expect(result.current.subjects).toBeDefined();
    expect(typeof result.current.createSubject).toBe("function");
    expect(typeof result.current.updateSubject).toBe("function");
    expect(typeof result.current.deleteSubject).toBe("function");
    expect(typeof result.current.getSubjectById).toBe("function");
    expect(typeof result.current.reloadSubjects).toBe("function");
  });
});
