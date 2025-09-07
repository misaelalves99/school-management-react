// src/hooks/useTeachers.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useTeachers } from "./useTeachers";
import { TeachersProvider } from "../contexts/Teachers/TeachersProvider";
import type { Teacher } from "../types/teacher";
import type { TeacherFormData } from "../types/teacher-form-data";

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

    // Estado inicial
    expect(result.current.teachers).toBeDefined();
    expect(Array.isArray(result.current.teachers)).toBe(true);
    expect(typeof result.current.fetchTeachers).toBe("function");
    expect(typeof result.current.getTeacher).toBe("function");
    expect(typeof result.current.addTeacher).toBe("function");
    expect(typeof result.current.editTeacher).toBe("function");
    expect(typeof result.current.removeTeacher).toBe("function");
    expect(typeof result.current.loading).toBe("boolean");

    // Adicionar teacher
    let newTeacher: Teacher | undefined;
    const newTeacherData: TeacherFormData = {
      name: "Novo Professor",
      email: "novo.prof@example.com",
      dateOfBirth: "1980-01-01",
      subject: "Matemática",
      phone: "123456789",
      address: "Rua Teste, 100",
    };
    act(() => {
      newTeacher = result.current.addTeacher(newTeacherData);
    });
    expect(newTeacher).toBeDefined();
    expect(result.current.teachers).toContainEqual(newTeacher!);

    // Editar teacher existente
    act(() => {
      result.current.editTeacher(newTeacher!.id, { name: "Professor Editado" });
    });
    expect(result.current.teachers.find(t => t.id === newTeacher!.id)?.name).toBe("Professor Editado");

    // Buscar teacher por id
    const found = result.current.getTeacher(newTeacher!.id);
    expect(found).toEqual(result.current.teachers.find(t => t.id === newTeacher!.id));

    // Remover teacher
    act(() => {
      result.current.removeTeacher(newTeacher!.id);
    });
    expect(result.current.teachers.find(t => t.id === newTeacher!.id)).toBeUndefined();

    // Verificar fetchTeachers e loading
    act(() => {
      result.current.fetchTeachers();
    });
    expect(Array.isArray(result.current.teachers)).toBe(true);
    expect(typeof result.current.loading).toBe("boolean");
  });
});
