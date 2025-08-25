// src/pages/Teachers/index.test.tsx

// src/pages/Teachers/index.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeachersPage from "./index";
import { useTeachers } from "../../hooks/useTeachers";

const navigateMock = jest.fn();

jest.mock("../../hooks/useTeachers");
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("TeachersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exibe mensagem quando não há professores", () => {
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [] });
    render(
      <MemoryRouter>
        <TeachersPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Nenhum professor encontrado.")).toBeInTheDocument();
  });

  it("lista professores corretamente", () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [
        { id: 1, name: "Alice", email: "alice@example.com", subject: "Math" },
        { id: 2, name: "Bob", email: "bob@example.com", subject: "Physics" },
      ],
    });

    render(
      <MemoryRouter>
        <TeachersPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Physics")).toBeInTheDocument();
  });

  it("filtra professores pelo termo de busca", () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [
        { id: 1, name: "Alice", email: "alice@example.com", subject: "Math" },
        { id: 2, name: "Bob", email: "bob@example.com", subject: "Physics" },
      ],
    });

    render(
      <MemoryRouter>
        <TeachersPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Digite o nome ou disciplina...");
    fireEvent.change(input, { target: { value: "Math" } });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("navega ao clicar em Detalhes, Editar ou Excluir", () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [{ id: 1, name: "Alice", email: "alice@example.com", subject: "Math" }],
    });

    render(
      <MemoryRouter>
        <TeachersPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Detalhes"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers/details/1");

    fireEvent.click(screen.getByText("Editar"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers/edit/1");

    fireEvent.click(screen.getByText("Excluir"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers/delete/1");
  });

  it("navega ao clicar em Cadastrar Novo Professor", () => {
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [] });

    render(
      <MemoryRouter>
        <TeachersPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Cadastrar Novo Professor"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers/create");
  });

  it("funciona paginação corretamente", () => {
    const teachersArray = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Teacher ${i + 1}`,
      email: `teacher${i + 1}@example.com`,
      subject: "Math",
    }));

    (useTeachers as jest.Mock).mockReturnValue({ teachers: teachersArray });

    render(
      <MemoryRouter>
        <TeachersPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Teacher 1")).toBeInTheDocument();
    expect(screen.queryByText("Teacher 11")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Próxima"));

    expect(screen.getByText("Teacher 11")).toBeInTheDocument();
    expect(screen.queryByText("Teacher 1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Anterior"));

    expect(screen.getByText("Teacher 1")).toBeInTheDocument();
  });
});
