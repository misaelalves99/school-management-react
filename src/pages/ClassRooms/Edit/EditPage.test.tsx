// src/pages/ClassRoom/Edit/EditPage.test.tsx

import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditClassRoom from "./EditPage";
import { useClassRooms } from "../../../hooks/useClassRooms";

// Mocks
const mockUpdate = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../../hooks/useClassRooms");
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditClassRoom", () => {
  const classRoomData = {
    id: 1,
    name: "Turma A",
    capacity: 30,
    schedule: "Seg - 08:00 às 10:00",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useClassRooms as jest.Mock).mockReturnValue({
      getById: jest.fn().mockReturnValue(classRoomData),
      update: mockUpdate,
    });
  });

  it("deve renderizar o formulário com dados preenchidos", () => {
    render(
      <MemoryRouter>
        <EditClassRoom id={1} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nome/i)).toHaveValue(classRoomData.name);
    expect(screen.getByLabelText(/Capacidade/i)).toHaveValue(classRoomData.capacity);
    expect(screen.getByLabelText(/Horário/i)).toHaveValue(classRoomData.schedule);
  });

  it("deve exibir mensagem se turma não for encontrada", () => {
    (useClassRooms as jest.Mock).mockReturnValue({
      getById: jest.fn().mockReturnValue(undefined),
      update: mockUpdate,
    });

    render(
      <MemoryRouter>
        <EditClassRoom id={999} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it("deve validar campos obrigatórios", () => {
    render(
      <MemoryRouter>
        <EditClassRoom id={1} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText(/Horário/i), { target: { value: "" } });

    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Capacidade deve ser entre 1 e 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Horário é obrigatório/i)).toBeInTheDocument();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("deve chamar update e navigate ao submeter corretamente", () => {
    render(
      <MemoryRouter>
        <EditClassRoom id={1} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Turma B" } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/Horário/i), { target: { value: "Ter - 10:00 às 12:00" } });

    act(() => {
      fireEvent.click(screen.getByText(/Salvar Alterações/i));
    });

    expect(mockUpdate).toHaveBeenCalledWith(1, {
      name: "Turma B",
      capacity: 25,
      schedule: "Ter - 10:00 às 12:00",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/classrooms");
  });

  it("botão 'Voltar à Lista' deve navegar para /classrooms", () => {
    render(
      <MemoryRouter>
        <EditClassRoom id={1} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(mockNavigate).toHaveBeenCalledWith("/classrooms");
  });
});
