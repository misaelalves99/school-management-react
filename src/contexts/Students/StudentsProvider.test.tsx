// src/contexts/Students/StudentsProvider.test.tsx

// src/contexts/Students/StudentsProvider.test.tsx

import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentsProvider } from "./StudentsProvider";
import { StudentsContext } from "./StudentsContext";
import * as StudentsMock from "../../mocks/Students";

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
  const initialStudent = {
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

    // Corrigido: preencher todos os campos obrigatórios
    jest
      .spyOn(StudentsMock, "updateStudent")
      .mockImplementation((id, student) => {
        const original = id === initialStudent.id ? initialStudent : null;
        if (!original) return null;
        return { ...original, ...student };
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

    expect(screen.getByTestId("students-count").textContent).toBe("1");

    await userEvent.click(screen.getByText("Add"));
    expect(StudentsMock.createStudent).toHaveBeenCalledWith({
      name: "Alice",
      enrollmentNumber: "1001",
      phone: "111",
      email: "alice@example.com",
      dateOfBirth: "2000-02-02",
      address: "Rua Alice, 1",
    });

    await userEvent.click(screen.getByText("Edit"));
    expect(StudentsMock.updateStudent).toHaveBeenCalledWith(1, { name: "Bob" });

    await userEvent.click(screen.getByText("Remove"));
    expect(StudentsMock.deleteStudent).toHaveBeenCalledWith(1);

    await userEvent.click(screen.getByText("Refresh"));
    expect(StudentsMock.getStudents).toHaveBeenCalled();
  });
});
