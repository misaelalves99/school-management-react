// src/contexts/Students/StudentsProvider.test.tsx

import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentsProvider } from "./StudentsProvider";
import { StudentsContext } from "./StudentsContext";
import * as StudentsMock from "../../mocks/Students";
import type { Student } from "../../types/student";

// Componente de teste que consome o contexto
function TestConsumer() {
  const context = useContext(StudentsContext);

  if (!context) return <div>No Context</div>;

  return (
    <div>
      <span data-testid="students-count">{context.students.length}</span>
      <button
        onClick={() =>
          context.addStudent({
            name: "Alice",
            enrollmentNumber: "1001",
            phone: "111",
            email: "alice@example.com",
            dateOfBirth: "2000-02-02",
            address: "Rua Alice, 1",
          })
        }
      >
        Add
      </button>
      <button
        onClick={() =>
          context.editStudent(context.students[0].id, { name: "Bob" })
        }
      >
        Edit
      </button>
      <button onClick={() => context.removeStudent(context.students[0].id)}>
        Remove
      </button>
      <button onClick={() => context.refreshStudents()}>Refresh</button>
    </div>
  );
}

describe("StudentsProvider", () => {
  const initialStudent: Student = {
    id: 1,
    name: "John",
    enrollmentNumber: "2023001",
    phone: "123456789",
    email: "john@example.com",
    dateOfBirth: "2000-01-01",
    address: "Rua A, 100",
  };

  beforeEach(() => {
    jest.spyOn(StudentsMock, "getStudents").mockReturnValue([initialStudent]);

    jest
      .spyOn(StudentsMock, "createStudent")
      .mockImplementation((student) => ({ id: 2, ...student }));

    jest
      .spyOn(StudentsMock, "updateStudent")
      .mockImplementation((id, student) => {
        if (id !== initialStudent.id) return null;
        return { ...initialStudent, ...student };
      });

    jest.spyOn(StudentsMock, "deleteStudent").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("provides initial students and functions", async () => {
    render(
      <StudentsProvider>
        <TestConsumer />
      </StudentsProvider>
    );

    // estado inicial
    expect(screen.getByTestId("students-count").textContent).toBe("1");

    // adicionar estudante
    await userEvent.click(screen.getByText("Add"));
    expect(StudentsMock.createStudent).toHaveBeenCalledWith({
      name: "Alice",
      enrollmentNumber: "1001",
      phone: "111",
      email: "alice@example.com",
      dateOfBirth: "2000-02-02",
      address: "Rua Alice, 1",
    });
    expect(StudentsMock.getStudents).toHaveBeenCalledTimes(2); // inicial + refresh

    // editar estudante
    await userEvent.click(screen.getByText("Edit"));
    expect(StudentsMock.updateStudent).toHaveBeenCalledWith(1, { name: "Bob" });
    expect(StudentsMock.getStudents).toHaveBeenCalledTimes(3);

    // remover estudante
    await userEvent.click(screen.getByText("Remove"));
    expect(StudentsMock.deleteStudent).toHaveBeenCalledWith(1);
    expect(StudentsMock.getStudents).toHaveBeenCalledTimes(4);

    // refresh manual
    await userEvent.click(screen.getByText("Refresh"));
    expect(StudentsMock.getStudents).toHaveBeenCalledTimes(5);
  });

  it("returns null when editing non-existent student", () => {
    (StudentsMock.updateStudent as jest.Mock).mockImplementation(() => null);

    render(
      <StudentsProvider>
        <TestConsumer />
      </StudentsProvider>
    );

    const context = useContext(StudentsContext);
    const result = context?.editStudent(999, { name: "Ghost" });

    expect(result).toBeNull();
  });

  it("renders fallback when context is undefined", () => {
    render(<TestConsumer />);
    expect(screen.getByText("No Context")).toBeInTheDocument();
  });
});
