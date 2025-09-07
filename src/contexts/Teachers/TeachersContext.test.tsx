// src/contexts/Teachers/TeachersContext.test.tsx

import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { TeachersContext, TeachersContextType } from "./TeachersContext";
import type { TeacherFormData } from "../../types/TeacherFormData";
import type { Teacher } from "../../types/Teacher";

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

  const mockContext: TeachersContextType = {
    teachers: [mockTeacher],
    loading: false,
    fetchTeachers: jest.fn(),
    getTeacher: jest.fn().mockReturnValue(mockTeacher),
    addTeacher: jest.fn().mockImplementation((data: TeacherFormData) => ({ id: 2, ...data })),
    editTeacher: jest.fn().mockImplementation((id, data) => (id === 1 ? { ...mockTeacher, ...data } : null)),
    removeTeacher: jest.fn(),
  };

  it("deve ser undefined se usado fora de provider", () => {
    const { result } = renderHook(() => useContext(TeachersContext));
    expect(result.current).toBeUndefined();
  });

  it("deve fornecer valores via provider", () => {
    const { result } = renderHook(() => useContext(TeachersContext), {
      wrapper: ({ children }) => <TeachersContext.Provider value={mockContext}>{children}</TeachersContext.Provider>,
    });

    expect(result.current).toBe(mockContext);
    expect(result.current?.teachers.length).toBe(1);
    expect(result.current?.addTeacher).toBeDefined();
  });
});
