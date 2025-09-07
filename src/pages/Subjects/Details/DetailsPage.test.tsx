// src/pages/Subjects/Details/DetailsPage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubjectDetails from "./DetailsPage";
import { useSubjects } from "../../../hooks/useSubjects";

const navigateMock = jest.fn();

// Mock do hook useSubjects
jest.mock("../../../hooks/useSubjects");

// Mock do react-router-dom
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: jest.fn(() => ({ id: "1" })),
  };
});

import { useParams } from "react-router-dom";

describe("SubjectDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUseParams = (id: string | undefined) => {
    (useParams as jest.Mock).mockReturnValue({ id });
  };

  it("mostra mensagem de ID inválido se id não for fornecido", () => {
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(),
    });
    mockUseParams(undefined);

    render(
      <MemoryRouter>
        <SubjectDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });

  it("mostra mensagem de disciplina não encontrada se subject for null", () => {
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => null),
    });
    mockUseParams("1");

    render(
      <MemoryRouter>
        <SubjectDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Disciplina não encontrada/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });

  it("renderiza detalhes da disciplina corretamente", () => {
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => ({
        id: 1,
        name: "Matemática",
        description: "Descrição teste",
        workloadHours: 60,
      })),
    });
    mockUseParams("1");

    render(
      <MemoryRouter>
        <SubjectDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Detalhes da Disciplina/i)).toBeInTheDocument();
    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("Descrição teste")).toBeInTheDocument();
    expect(screen.getByText(/60 horas/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Editar/i));
    expect(navigateMock).toHaveBeenCalledWith("/subjects/edit/1");

    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });
});
