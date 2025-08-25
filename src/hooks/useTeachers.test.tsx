// src/hooks/useTeachers.test.tsx

// src/hooks/useTeachers.test.tsx

import { renderHook } from "@testing-library/react";
import { useTeachers } from "./useTeachers";
import { TeachersProvider } from "../contexts/Teachers/TeachersProvider";

describe("useTeachers", () => {
  it("deve lançar erro se usado fora do TeachersProvider", () => {
    expect(() => renderHook(() => useTeachers())).toThrowError(
      "useTeachers deve ser usado dentro de um TeachersProvider"
    );
  });

  it("deve retornar o contexto corretamente quando usado dentro do TeachersProvider", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <TeachersProvider>{children}</TeachersProvider>
    );

    const { result } = renderHook(() => useTeachers(), { wrapper });

    expect(result.current.teachers).toBeDefined();
    expect(typeof result.current.fetchTeachers).toBe("function");
    expect(typeof result.current.getTeacher).toBe("function");
    expect(typeof result.current.addTeacher).toBe("function");
    expect(typeof result.current.editTeacher).toBe("function");
    expect(typeof result.current.removeTeacher).toBe("function");
    expect(typeof result.current.loading).toBe("boolean");
  });
});
