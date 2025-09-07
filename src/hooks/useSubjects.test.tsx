// src/hooks/useSubjects.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useSubjects } from "./useSubjects";
import { SubjectsProvider } from "../contexts/Subjects/SubjectsProvider";
import type { Subject } from "../types/Subject";

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

    // Estado inicial e métodos
    expect(result.current.subjects).toBeDefined();
    expect(Array.isArray(result.current.subjects)).toBe(true);
    expect(typeof result.current.createSubject).toBe("function");
    expect(typeof result.current.updateSubject).toBe("function");
    expect(typeof result.current.deleteSubject).toBe("function");
    expect(typeof result.current.getSubjectById).toBe("function");
    expect(typeof result.current.reloadSubjects).toBe("function");

    // Criar subject
    let newSubject: Subject | undefined = undefined; // inicializa como undefined
    act(() => {
      newSubject = result.current.createSubject({
        name: "Novo Subject",
        description: "Descrição",
        workloadHours: 50,
      });
    });

    // Garantir que não é undefined antes de usar
    expect(newSubject).toBeDefined();
    expect(newSubject!.id).toBeDefined();
    expect(result.current.subjects).toContainEqual(newSubject!);

    // Atualizar subject existente
    act(() => {
      result.current.updateSubject(newSubject!.id, { name: "Atualizado" });
    });
    expect(result.current.subjects.find(s => s.id === newSubject!.id)?.name).toBe("Atualizado");

    // Buscar subject por id
    const found = result.current.getSubjectById(newSubject!.id);
    expect(found).toEqual(result.current.subjects.find(s => s.id === newSubject!.id));

    // Deletar subject
    act(() => {
      result.current.deleteSubject(newSubject!.id);
    });
    expect(result.current.subjects.find(s => s.id === newSubject!.id)).toBeUndefined();

    // Recarregar subjects
    act(() => {
      result.current.reloadSubjects();
    });
    expect(Array.isArray(result.current.subjects)).toBe(true);
  });
});
