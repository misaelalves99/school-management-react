// src/contexts/Subjects/SubjectsProvider.test.tsx

import { renderHook, act } from "@testing-library/react";
import { ReactNode, useContext } from "react";
import { SubjectsProvider } from "./SubjectsProvider";
import { SubjectsContext } from "./SubjectsContext";
import type { Subject } from "../../types/subject";
import { mockSubjects } from "../../mocks/Subjects";

describe("SubjectsProvider", () => {
  const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <SubjectsProvider>{children}</SubjectsProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve inicializar com a lista de subjects do mock", () => {
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current!.subjects.length).toBe(mockSubjects.list().length);
  });

  it("deve criar um subject", () => {
    const spyCreate = jest.spyOn(mockSubjects, "create");
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });

    const newSubject: Omit<Subject, "id"> = {
      name: "História",
      description: "Idade Média e Moderna",
      workloadHours: 40,
    };

    let created: Subject | undefined;
    act(() => {
      created = result.current!.createSubject(newSubject);
    });

    expect(spyCreate).toHaveBeenCalledWith(newSubject);
    expect(created).toBeDefined();
    expect(created!.id).toBeDefined();
    expect(created!.name).toBe("História");
    expect(result.current!.subjects).toContainEqual(created);
  });

  it("deve atualizar um subject existente", () => {
    const spyUpdate = jest.spyOn(mockSubjects, "update");
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });

    const updatedData: Partial<Omit<Subject, "id">> = { name: "Física Avançada" };
    const id = result.current!.subjects[0].id;

    let updated: Subject | undefined;
    act(() => {
      updated = result.current!.updateSubject(id, updatedData);
    });

    expect(spyUpdate).toHaveBeenCalledWith(id, updatedData);
    expect(updated?.name).toBe("Física Avançada");
    expect(result.current!.subjects.find(s => s.id === id)?.name).toBe("Física Avançada");
  });

  it("não deve atualizar se o subject não existir", () => {
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });
    let updated: Subject | undefined;
    act(() => {
      updated = result.current!.updateSubject(999, { name: "Inexistente" });
    });
    expect(updated).toBeUndefined();
  });

  it("deve deletar um subject existente", () => {
    const spyDelete = jest.spyOn(mockSubjects, "delete");
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });

    const id = result.current!.subjects[0].id;
    let deleted = false;
    act(() => {
      deleted = result.current!.deleteSubject(id);
    });

    expect(spyDelete).toHaveBeenCalledWith(id);
    expect(deleted).toBe(true);
    expect(result.current!.subjects.find(s => s.id === id)).toBeUndefined();
  });

  it("deve retornar false ao tentar deletar subject inexistente", () => {
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });
    let deleted = true;
    act(() => {
      deleted = result.current!.deleteSubject(999);
    });
    expect(deleted).toBe(false);
  });

  it("deve buscar subject por id existente", () => {
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });
    const id = result.current!.subjects[0].id;
    const subject = result.current!.getSubjectById(id);
    expect(subject).toBeDefined();
    expect(subject?.id).toBe(id);
  });

  it("deve retornar undefined ao buscar subject inexistente", () => {
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });
    const subject = result.current!.getSubjectById(999);
    expect(subject).toBeUndefined();
  });

  it("deve recarregar subjects", () => {
    const spyList = jest.spyOn(mockSubjects, "list");
    const { result } = renderHook(() => useContext(SubjectsContext), { wrapper });
    act(() => {
      result.current!.reloadSubjects();
    });
    expect(spyList).toHaveBeenCalled();
    expect(result.current!.subjects.length).toBe(mockSubjects.list().length);
  });
});
