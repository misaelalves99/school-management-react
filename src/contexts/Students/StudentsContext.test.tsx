// src/contexts/Students/StudentsContext.test.tsx

import { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StudentsContext, StudentsContextType } from "./StudentsContext";
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
            name: "Test",
            enrollmentNumber: "123",
            phone: "000",
            email: "test@example.com",
            dateOfBirth: "2000-01-01",
            address: "Rua Teste, 123",
          })
        }
      >
        Add
      </button>
      <button onClick={() => context.editStudent(1, { name: "Edited" })}>
        Edit
      </button>
      <button onClick={() => context.removeStudent(1)}>Remove</button>
      <button onClick={() => context.refreshStudents()}>Refresh</button>
    </div>
  );
}

describe("StudentsContext", () => {
  const mockStudent: Student = {
    id: 1,
    name: "John",
    enrollmentNumber: "2023001",
    phone: "123456789",
    email: "john@example.com",
    dateOfBirth: "2000-01-01",
    address: "Rua A, 100",
  };

  const mockContextValue: StudentsContextType = {
    students: [mockStudent],
    addStudent: jest.fn().mockImplementation((student) => ({ id: 2, ...student })),
    editStudent: jest.fn().mockImplementation((id, student) =>
      id === 1 ? { ...mockStudent, ...student } : null
    ),
    removeStudent: jest.fn(),
    refreshStudents: jest.fn(),
  };

  it("should provide context values to consumer", () => {
    render(
      <StudentsContext.Provider value={mockContextValue}>
        <TestConsumer />
      </StudentsContext.Provider>
    );

    expect(screen.getByTestId("students-count").textContent).toBe("1");

    fireEvent.click(screen.getByText("Add"));
    expect(mockContextValue.addStudent).toHaveBeenCalledWith({
      name: "Test",
      enrollmentNumber: "123",
      phone: "000",
      email: "test@example.com",
      dateOfBirth: "2000-01-01",
      address: "Rua Teste, 123",
    });

    fireEvent.click(screen.getByText("Edit"));
    expect(mockContextValue.editStudent).toHaveBeenCalledWith(1, { name: "Edited" });

    fireEvent.click(screen.getByText("Remove"));
    expect(mockContextValue.removeStudent).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText("Refresh"));
    expect(mockContextValue.refreshStudents).toHaveBeenCalled();
  });

  it("should render fallback if context is undefined", () => {
    render(<TestConsumer />);
    expect(screen.getByText("No Context")).toBeInTheDocument();
  });
});
