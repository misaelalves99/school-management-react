// src/hooks/useStudents.test.tsx
import { renderHook, act } from "@testing-library/react";
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

    // Valida métodos e estado
    expect(result.current.students).toBeDefined();
    expect(Array.isArray(result.current.students)).toBe(true);
    expect(typeof result.current.addStudent).toBe("function");
    expect(typeof result.current.editStudent).toBe("function");
    expect(typeof result.current.removeStudent).toBe("function");
    expect(typeof result.current.refreshStudents).toBe("function");

    // Testa métodos básicos (opcional)
    act(() => {
      const newStudent = result.current.addStudent({
        name: "Test Student",
        enrollmentNumber: "123",
        phone: "000",
        email: "test@student.com",
        dateOfBirth: "2000-01-01",
        address: "Rua Teste, 123",
      });
      expect(newStudent.id).toBeDefined();
    });

    act(() => {
      const student = result.current.students[0];
      const updated = result.current.editStudent(student.id, { name: "Updated Name" });
      expect(updated?.name).toBe("Updated Name");
    });

    act(() => {
      const studentId = result.current.students[0].id;
      result.current.removeStudent(studentId);
      expect(result.current.students.find(s => s.id === studentId)).toBeUndefined();
    });

    act(() => {
      result.current.refreshStudents();
      expect(result.current.students).toBeDefined();
    });
  });
});
