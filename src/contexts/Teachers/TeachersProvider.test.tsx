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
          {context.teachers.map(t => <li key={t.id}>{t.name}</li>)}
        </ul>
      </div>
    );
  };

  it("deve inicializar com loading e fetchTeachers", () => {
    render(
      <TeachersProvider>
        <TestComponent />
      </TeachersProvider>
    );
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getAllByRole("listitem").length).toBe(getTeachers().length);
  });

  it("deve adicionar, editar e remover teacher", () => {
    let addFn: ((data: TeacherFormData) => Teacher) | undefined;
    let editFn: ((id: number, data: Partial<TeacherFormData>) => Teacher | null) | undefined;
    let removeFn: ((id: number) => void) | undefined;

    const HooksComponent = () => {
      const context = useContext(TeachersContext) as TeachersContextType;
      addFn = context.addTeacher;
      editFn = context.editTeacher;
      removeFn = context.removeTeacher;
      return null;
    };

    render(
      <TeachersProvider>
        <HooksComponent />
        <TestComponent />
      </TeachersProvider>
    );

    const newTeacher: TeacherFormData = { name: "Novo Prof", email: "novo@email.com", dateOfBirth: "1990-01-01", subject: "Matemática", phone: "111", address: "Rua Nova" };
    act(() => addFn?.(newTeacher));

    let listItems = screen.getAllByRole("listitem");
    expect(listItems.some(li => li.textContent === "Novo Prof")).toBe(true);

    const firstTeacher = getTeachers()[0];
    act(() => editFn?.(firstTeacher.id, { name: "Professor Editado" }));
    listItems = screen.getAllByRole("listitem");
    expect(listItems.some(li => li.textContent === "Professor Editado")).toBe(true);

    act(() => removeFn?.(firstTeacher.id));
    listItems = screen.queryAllByRole("listitem");
    expect(listItems.some(li => li.textContent === firstTeacher.name)).toBe(false);
  });

  it("deve buscar teacher existente e retornar undefined para inexistente", () => {
    let getFn: ((id: number) => Teacher | undefined) | undefined;
    const GetComponent = () => { const context = useContext(TeachersContext) as TeachersContextType; getFn = context.getTeacher; return null; };

    render(<TeachersProvider><GetComponent /></TeachersProvider>);

    const firstTeacher = getTeachers()[0];
    expect(getFn?.(firstTeacher.id)).toEqual(getTeacherById(firstTeacher.id));
    expect(getFn?.(999)).toBeUndefined();
  });

  it("deve executar fetchTeachers", () => {
    let fetchFn: (() => void) | undefined;
    const FetchComponent = () => { const context = useContext(TeachersContext) as TeachersContextType; fetchFn = context.fetchTeachers; return null; };

    render(<TeachersProvider><FetchComponent /><TestComponent /></TeachersProvider>);

    act(() => fetchFn?.());
    expect(screen.getAllByRole("listitem").length).toBe(getTeachers().length);
  });
});
