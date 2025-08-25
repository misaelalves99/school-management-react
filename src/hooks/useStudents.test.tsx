// src/hooks/useStudents.test.tsx

import { renderHook } from "@testing-library/react";
import { useStudents } from "./useStudents";
import { StudentsProvider } from "../contexts/Students/StudentsProvider";

describe("useStudents", () => {
  it("deve lançar erro se usado fora do StudentsProvider", () => {
    expect(() => renderHook(() => useStudents())).toThrowError(
      "useStudents must be used within a StudentsProvider"
    );
  });

  it("deve retornar o contexto corretamente quando usado dentro do StudentsProvider", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <StudentsProvider>{children}</StudentsProvider>
    );

    const { result } = renderHook(() => useStudents(), { wrapper });

    expect(result.current.students).toBeDefined();
    expect(typeof result.current.addStudent).toBe("function");
    expect(typeof result.current.editStudent).toBe("function");
    expect(typeof result.current.removeStudent).toBe("function");
    expect(typeof result.current.refreshStudents).toBe("function");
  });
});
