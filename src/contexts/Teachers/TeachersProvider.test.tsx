// src/contexts/Teachers/TeachersProvider.test.tsx

import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import { TeachersProvider } from "./TeachersProvider";
import { TeachersContext, TeachersContextType } from "./TeachersContext";
import { getTeachers, getTeacherById } from "../../mocks/Teachers";
import type { TeacherFormData } from "../../types/TeacherFormData";
import type { Teacher } from "../../types/Teacher";

describe("TeachersProvider", () => {
  const TestComponent = () => {
    const context = useContext(TeachersContext) as TeachersContextType;
    return (
      <div>
        <p data-testid="loading">{context.loading ? "true" : "false"}</p>
        <ul data-testid="teachers-list">
          {context.teachers.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      </div>
    );
  };

  it("deve inicializar com loading e buscar teachers", () => {
    render(
      <TeachersProvider>
        <TestComponent />
      </TeachersProvider>
    );

    const loading = screen.getByTestId("loading");
    expect(loading.textContent).toBe("false");
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(getTeachers().length);
  });

  it("deve adicionar um teacher", () => {
    let addFn: ((data: TeacherFormData) => Teacher) | undefined;

    const AddComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      addFn = context.addTeacher;
      return null;
    };

    render(
      <TeachersProvider>
        <AddComponent />
        <TestComponent />
      </TeachersProvider>
    );

    const newTeacher: TeacherFormData = {
      name: "Novo Prof",
      email: "novo.prof@email.com",
      dateOfBirth: "1990-01-01",
      subject: "Matemática",
      phone: "111222333",
      address: "Rua Nova, 100",
    };

    act(() => {
      addFn?.(newTeacher);
    });

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.some((li) => li.textContent === "Novo Prof")).toBe(true);
  });

  it("deve editar um teacher existente", () => {
    let editFn: ((id: number, data: Partial<TeacherFormData>) => Teacher | null) | undefined;

    const EditComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      editFn = context.editTeacher;
      return null;
    };

    render(
      <TeachersProvider>
        <EditComponent />
        <TestComponent />
      </TeachersProvider>
    );

    const firstTeacher = getTeachers()[0];
    act(() => {
      editFn?.(firstTeacher.id, { name: "Professor Editado" });
    });

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.some((li) => li.textContent === "Professor Editado")).toBe(true);
  });

  it("deve retornar null ao tentar editar teacher inexistente", () => {
    let editFn: ((id: number, data: Partial<TeacherFormData>) => Teacher | null) | undefined;

    const EditComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      editFn = context.editTeacher;
      return null;
    };

    render(
      <TeachersProvider>
        <EditComponent />
      </TeachersProvider>
    );

    let result: Teacher | null = null;
    act(() => {
      result = editFn?.(999, { name: "Inexistente" }) ?? null;
    });

    expect(result).toBeNull();
  });

  it("deve remover um teacher", () => {
    let removeFn: ((id: number) => void) | undefined;

    const RemoveComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      removeFn = context.removeTeacher;
      return null;
    };

    render(
      <TeachersProvider>
        <RemoveComponent />
        <TestComponent />
      </TeachersProvider>
    );

    const firstTeacher = getTeachers()[0];
    act(() => {
      removeFn?.(firstTeacher.id);
    });

    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.some((li) => li.textContent === firstTeacher.name)).toBe(false);
  });

  it("deve buscar teacher por id", () => {
    let getFn: ((id: number) => Teacher | undefined) | undefined;

    const GetComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      getFn = context.getTeacher;
      return null;
    };

    render(
      <TeachersProvider>
        <GetComponent />
      </TeachersProvider>
    );

    const firstTeacher = getTeachers()[0];
    const teacher = getFn?.(firstTeacher.id);
    expect(teacher).toEqual(getTeacherById(firstTeacher.id));
  });

  it("deve retornar undefined ao buscar teacher inexistente", () => {
    let getFn: ((id: number) => Teacher | undefined) | undefined;

    const GetComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      getFn = context.getTeacher;
      return null;
    };

    render(
      <TeachersProvider>
        <GetComponent />
      </TeachersProvider>
    );

    const teacher = getFn?.(999);
    expect(teacher).toBeUndefined();
  });

  it("deve executar fetchTeachers e atualizar lista", () => {
    let fetchFn: (() => void) | undefined;

    const FetchComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      fetchFn = context.fetchTeachers;
      return null;
    };

    render(
      <TeachersProvider>
        <FetchComponent />
        <TestComponent />
      </TeachersProvider>
    );

    act(() => {
      fetchFn?.();
    });

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(getTeachers().length);
  });
});
