// src/pages/Teachers/Details/DetailsPage.test.tsx

// src/pages/Teachers/Details/DetailsPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TeacherDetails from "./DetailsPage";
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

describe("TeacherDetails", () => {
  const getTeacherMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacher: getTeacherMock,
    });
  });

  const renderComponent = (id?: string) =>
    render(
      <MemoryRouter initialEntries={[id ? `/teachers/details/${id}` : "/teachers/details"]}>
        <Routes>
          <Route path="/teachers/details/:id" element={<TeacherDetails />} />
        </Routes>
      </MemoryRouter>
    );

  it("exibe mensagem de ID inválido quando não há ID", () => {
    renderComponent();
    expect(screen.getByText("Id inválido")).toBeInTheDocument();
  });

  it("exibe mensagem de professor não encontrado quando getTeacher retorna undefined", () => {
    getTeacherMock.mockReturnValue(undefined);
    renderComponent("1");
    expect(screen.getByText("Professor não encontrado.")).toBeInTheDocument();
  });

  it("renderiza corretamente os detalhes do professor", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123456789",
      address: "Rua A, 123",
      photoUrl: "https://example.com/photo.jpg",
    });

    renderComponent("1");

    expect(screen.getByText("Detalhes do Professor")).toBeInTheDocument();
    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("Professor X")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("x@example.com")).toBeInTheDocument();
    expect(screen.getByText("Data de Nascimento:")).toBeInTheDocument();
    expect(screen.getByText("10/05/1980")).toBeInTheDocument();
    expect(screen.getByText("Disciplina:")).toBeInTheDocument();
    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("Telefone:")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("Endereço:")).toBeInTheDocument();
    expect(screen.getByText("Rua A, 123")).toBeInTheDocument();
    expect(screen.getByAltText("Professor X foto")).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("chama navigate ao clicar em Editar", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123456789",
      address: "Rua A, 123",
      photoUrl: "https://example.com/photo.jpg",
    });

    renderComponent("1");

    fireEvent.click(screen.getByText("Editar"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers/edit/1");
  });

  it("chama navigate ao clicar em Voltar à Lista", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123456789",
      address: "Rua A, 123",
      photoUrl: "https://example.com/photo.jpg",
    });

    renderComponent("1");

    fireEvent.click(screen.getByText("Voltar à Lista"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });
});
