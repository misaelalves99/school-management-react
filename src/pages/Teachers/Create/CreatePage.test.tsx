// src/pages/Teachers/CreatePage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeacherCreate from "./CreatePage";
import { useTeachers } from "../../../hooks/useTeachers";

const navigateMock = jest.fn();

jest.mock("../../../hooks/useTeachers");
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("TeacherCreate", () => {
  const addTeacherMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTeachers as jest.Mock).mockReturnValue({
      addTeacher: addTeacherMock,
    });
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renderiza todos os campos do formulário", () => {
    render(
      <MemoryRouter>
        <TeacherCreate />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Data de Nascimento")).toBeInTheDocument();
    expect(screen.getByLabelText("Disciplina")).toBeInTheDocument();
    expect(screen.getByLabelText("Telefone")).toBeInTheDocument();
    expect(screen.getByLabelText("Endereço")).toBeInTheDocument();
  });

  it("exibe erros de validação quando campos obrigatórios estão vazios", () => {
    render(
      <MemoryRouter>
        <TeacherCreate />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Salvar"));

    expect(screen.getByText("Nome é obrigatório.")).toBeInTheDocument();
    expect(screen.getByText("Email é obrigatório.")).toBeInTheDocument();
    expect(screen.getByText("Data de nascimento é obrigatória.")).toBeInTheDocument();
    expect(screen.getByText("Disciplina é obrigatória.")).toBeInTheDocument();
    expect(addTeacherMock).not.toHaveBeenCalled();
  });

  it("exibe erro de email inválido", () => {
    render(
      <MemoryRouter>
        <TeacherCreate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Professor X" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByLabelText("Data de Nascimento"), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByLabelText("Disciplina"), { target: { value: "Matemática" } });

    fireEvent.click(screen.getByText("Salvar"));

    expect(screen.getByText("Email inválido.")).toBeInTheDocument();
    expect(addTeacherMock).not.toHaveBeenCalled();
  });

  it("chama addTeacher e navegação ao submeter formulário válido", () => {
    render(
      <MemoryRouter>
        <TeacherCreate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Professor X" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "professor@example.com" } });
    fireEvent.change(screen.getByLabelText("Data de Nascimento"), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByLabelText("Disciplina"), { target: { value: "Matemática" } });

    fireEvent.click(screen.getByText("Salvar"));

    expect(addTeacherMock).toHaveBeenCalledWith({
      name: "Professor X",
      email: "professor@example.com",
      dateOfBirth: "2000-01-01",
      subject: "Matemática",
      phone: "",
      address: "",
    });
    expect(window.alert).toHaveBeenCalledWith("Professor salvo com sucesso!");
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });

  it("botão de voltar navega corretamente", () => {
    render(
      <MemoryRouter>
        <TeacherCreate />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Voltar à Lista"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });
});
