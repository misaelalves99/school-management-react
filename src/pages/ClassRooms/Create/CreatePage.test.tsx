// src/pages/ClassRooms/Create/CreatePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CreateClassRoom from './CreatePage';
import { useClassRooms } from '../../../hooks/useClassRooms';
import { BrowserRouter } from 'react-router-dom';

// Mock do hook useClassRooms
jest.mock('../../../hooks/useClassRooms');

// Mock do useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('CreateClassRoom', () => {
  const createMock = jest.fn();

  beforeEach(() => {
    (useClassRooms as jest.Mock).mockReturnValue({
      create: createMock,
    });
    mockedNavigate.mockClear();
    createMock.mockClear();
    window.alert = jest.fn();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CreateClassRoom />
      </BrowserRouter>
    );

  it('renderiza campos do formulário corretamente', () => {
    renderComponent();

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Capacidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Horário/i)).toBeInTheDocument();
    expect(screen.getByText(/Salvar/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('mostra erros se campos estiverem vazios ou inválidos', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: 0 } });
    fireEvent.change(screen.getByLabelText(/Horário/i), { target: { value: '' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Capacidade deve ser entre 1 e 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Horário é obrigatório/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
  });

  it('chama create e navega se formulário for válido', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Sala X' } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: 30 } });
    fireEvent.change(screen.getByLabelText(/Horário/i), { target: { value: 'Seg - 08:00 às 10:00' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(createMock).toHaveBeenCalledWith({
      name: 'Sala X',
      capacity: 30,
      schedule: 'Seg - 08:00 às 10:00',
      subjects: [],
      teachers: [],
      classTeacher: undefined,
    });
    expect(window.alert).toHaveBeenCalledWith('Sala cadastrada com sucesso!');
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms');
  });

  it('botão Cancelar chama navigate', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms');
  });
});
