// src/hooks/useEnrollments.test.tsx
import { renderHook } from "@testing-library/react";
import { useEnrollments } from "./useEnrollments";
import { EnrollmentsProvider } from "../contexts/Enrollments/EnrollmentsProvider";

describe("useEnrollments", () => {
  it("deve lançar erro se não estiver dentro do provider", () => {
    expect(() => renderHook(() => useEnrollments())).toThrowError(
      "useEnrollments deve ser usado dentro de um EnrollmentsProvider"
    );
  });

  it("deve retornar o contexto quando usado dentro do provider", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <EnrollmentsProvider>{children}</EnrollmentsProvider>
    );

    const { result } = renderHook(() => useEnrollments(), { wrapper });

    // Verifica se os estados e funções estão definidos
    expect(result.current.enrollments).toBeDefined();
    expect(Array.isArray(result.current.enrollments)).toBe(true);
    expect(typeof result.current.refresh).toBe("function");
    expect(typeof result.current.createEnrollment).toBe("function");
    expect(typeof result.current.updateEnrollment).toBe("function");
    expect(typeof result.current.removeEnrollment).toBe("function");
  });
});
