// src/pages/Teachers/CreatePage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeacherCreate from "./CreatePage";
import { useTeachers } from "../../../hooks/useTeachers";
import { useSubjects } from "../../../hooks/useSubjects";

const navigateMock = jest.fn();

jest.mock("../../../hooks/useTeachers");
jest.mock("../../../hooks/useSubjects", () => ({
  useSubjects: jest.fn(),
}));
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("TeacherCreatePage", () => {
  const addTeacherMock = jest.fn();
  const subjectsMock = [
    { id: 1, name: "Matemática", description: "Álgebra e Geometria", workloadHours: 60 },
    { id: 2, name: "Física", description: "Mecânica", workloadHours: 80 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useTeachers as jest.Mock).mockReturnValue({ addTeacher: addTeacherMock });
    (useSubjects as jest.Mock).mockReturnValue({ subjects: subjectsMock });
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza todos os campos do formulário", () => {
    render(
      <MemoryRouter>
        <TeacherCreate />
      </MemoryRouter>
    );

    ["Nome", "Email", "Data de Nascimento", "Disciplina", "Telefone", "Endereço"].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
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

  it("chama addTeacher e navega após submissão válida", () => {
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

    expect(window.alert).toHaveBeenCalledWith("Professor cadastrado com sucesso!");
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });

  it("botão de voltar navega corretamente", () => {
    render(
      <MemoryRouter>
        <TeacherCreate />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Voltar"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });
});
