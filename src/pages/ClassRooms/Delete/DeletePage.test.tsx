// src/pages/ClassRooms/Delete/DeletePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import DeleteClassRoom from './DeletePage';
import { useClassRooms } from '../../../hooks/useClassRooms';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../../hooks/useClassRooms');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('DeleteClassRoom', () => {
  const removeMock = jest.fn();
  const getByIdMock = jest.fn();

  beforeEach(() => {
    (useClassRooms as jest.Mock).mockReturnValue({
      getById: getByIdMock,
      remove: removeMock,
    });
    mockedNavigate.mockClear();
    removeMock.mockClear();
    getByIdMock.mockClear();
    window.alert = jest.fn();
    window.confirm = jest.fn();
  });

  it('exibe mensagem de não encontrado se turma não existir', () => {
    getByIdMock.mockReturnValue(undefined);
    render(
      <BrowserRouter>
        <DeleteClassRoom id={999} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('renderiza detalhes da turma corretamente', () => {
    getByIdMock.mockReturnValue({
      id: 1,
      name: 'Sala Teste',
      capacity: 20,
      schedule: 'Seg - 08:00 às 10:00',
      subjects: [{ id: 1, name: 'Matemática', description: '', workloadHours: 40 }],
      teachers: [{ id: 1, name: 'Prof. A', email: '', dateOfBirth: '', subject: '', phone: '', address: '' }],
      classTeacher: undefined,
    });

    render(
      <BrowserRouter>
        <DeleteClassRoom id={1} />
      </BrowserRouter>
    );

    expect(screen.getByText('Sala Teste')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Seg - 08:00 às 10:00')).toBeInTheDocument();
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Prof. A')).toBeInTheDocument();
  });

  it('cancela exclusão se usuário não confirmar', () => {
    window.confirm = jest.fn(() => false);
    getByIdMock.mockReturnValue({ id: 1, name: 'Sala Teste', capacity: 20, schedule: 'Horário', subjects: [], teachers: [], classTeacher: undefined });

    render(
      <BrowserRouter>
        <DeleteClassRoom id={1} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Confirmar Exclusão/i));
    expect(removeMock).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it('exclui a turma quando confirmado', () => {
    window.confirm = jest.fn(() => true);
    getByIdMock.mockReturnValue({ id: 1, name: 'Sala Teste', capacity: 20, schedule: 'Horário', subjects: [], teachers: [], classTeacher: undefined });

    render(
      <BrowserRouter>
        <DeleteClassRoom id={1} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Confirmar Exclusão/i));
    expect(removeMock).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Turma excluída com sucesso!');
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms');
  });

  it('botão Cancelar navega para lista', () => {
    getByIdMock.mockReturnValue({ id: 1, name: 'Sala Teste', capacity: 20, schedule: 'Horário', subjects: [], teachers: [], classTeacher: undefined });

    render(
      <BrowserRouter>
        <DeleteClassRoom id={1} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms');
  });
});
