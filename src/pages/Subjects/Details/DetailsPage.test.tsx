// src/pages/Subjects/Details/DetailsPage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubjectDetails from "./DetailsPage";
import { useSubjects } from "../../../hooks/useSubjects";

jest.mock("../../../hooks/useSubjects");

describe("SubjectDetails", () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(),
    });

    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => navigateMock,
      useParams: () => ({ id: "1" }),
    }));
  });

  it("mostra mensagem de disciplina não encontrada se subject for null", () => {
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => null),
    });

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

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });
});
