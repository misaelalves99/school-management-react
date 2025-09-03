// src/contexts/Teachers/TeachersContext.test.tsx

import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeachersContext, TeachersContextType } from "./TeachersContext";
import type { Teacher } from "../../types/Teacher";
import type { TeacherFormData } from "../../types/TeacherFormData";

// Componente de teste que consome o contexto
function TestConsumer() {
  const context = useContext(TeachersContext);

  if (!context) return <div>No Context</div>;

  return (
    <div>
      <span data-testid="teachers-count">{context.teachers.length}</span>
      <button
        onClick={() =>
          context.addTeacher({
            name: "Alice",
            email: "alice@example.com",
            dateOfBirth: "1990-01-01",
            subject: "Matemática",
            phone: "123456789",
            address: "Rua A, 100",
          })
        }
      >
        Add
      </button>
      <button
        onClick={() =>
          context.editTeacher(context.teachers[0].id, { name: "Bob" })
        }
      >
        Edit
      </button>
      <button onClick={() => context.removeTeacher(context.teachers[0].id)}>
        Remove
      </button>
      <button onClick={() => context.fetchTeachers()}>Fetch</button>
      <button onClick={() => context.getTeacher(context.teachers[0].id)}>
        Get
      </button>
    </div>
  );
}

describe("TeachersContext", () => {
  const mockTeacher: Teacher = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    dateOfBirth: "1985-05-05",
    subject: "Física",
    phone: "987654321",
    address: "Rua B, 200",
  };

  const mockContextValue: TeachersContextType = {
    teachers: [mockTeacher],
    loading: false,
    fetchTeachers: jest.fn(),
    getTeacher: jest.fn().mockReturnValue(mockTeacher),
    addTeacher: jest.fn().mockImplementation((data: TeacherFormData) => ({
      id: 2,
      ...data,
    })),
    editTeacher: jest
      .fn()
      .mockImplementation((id: number, data: Partial<TeacherFormData>) =>
        id === 1 ? { ...mockTeacher, ...data } : null
      ),
    removeTeacher: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide context values to consumer", async () => {
    render(
      <TeachersContext.Provider value={mockContextValue}>
        <TestConsumer />
      </TeachersContext.Provider>
    );

    expect(screen.getByTestId("teachers-count").textContent).toBe("1");

    await userEvent.click(screen.getByText("Add"));
    expect(mockContextValue.addTeacher).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      dateOfBirth: "1990-01-01",
      subject: "Matemática",
      phone: "123456789",
      address: "Rua A, 100",
    });

    await userEvent.click(screen.getByText("Edit"));
    expect(mockContextValue.editTeacher).toHaveBeenCalledWith(1, { name: "Bob" });

    await userEvent.click(screen.getByText("Remove"));
    expect(mockContextValue.removeTeacher).toHaveBeenCalledWith(1);

    await userEvent.click(screen.getByText("Fetch"));
    expect(mockContextValue.fetchTeachers).toHaveBeenCalled();

    await userEvent.click(screen.getByText("Get"));
    expect(mockContextValue.getTeacher).toHaveBeenCalledWith(1);
  });

  it("should render fallback if context is undefined", () => {
    render(<TestConsumer />);
    expect(screen.getByText("No Context")).toBeInTheDocument();
  });

  it("should return null when editing non-existent teacher", () => {
    render(
      <TeachersContext.Provider value={mockContextValue}>
        <TestConsumer />
      </TeachersContext.Provider>
    );

    const result = mockContextValue.editTeacher(999, { name: "Inexistente" });
    expect(result).toBeNull();
  });

  it("should return undefined when getting non-existent teacher", () => {
    const customContext: TeachersContextType = {
      ...mockContextValue,
      getTeacher: jest.fn().mockReturnValue(undefined),
    };

    render(
      <TeachersContext.Provider value={customContext}>
        <TestConsumer />
      </TeachersContext.Provider>
    );

    expect(customContext.getTeacher(999)).toBeUndefined();
  });
});
