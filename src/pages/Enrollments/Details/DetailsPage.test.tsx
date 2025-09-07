// src/pages/Enrollments/Details/DetailsPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EnrollmentDetails from './DetailsPage';
import { MemoryRouter } from 'react-router-dom';
import type { EnrollmentWithNames } from '../../../types/enrollment-with-names';

const mockNavigate = jest.fn();

// Mock do useNavigate do React Router v7
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('EnrollmentDetails', () => {
  const enrollmentMock: EnrollmentWithNames = {
    id: 1,
    studentId: 1,
    classRoomId: 1,
    studentName: 'João Silva',
    classRoomName: 'Sala A',
    enrollmentDate: '2025-01-10',
    status: 'Ativa',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente os detalhes da matrícula', () => {
    render(
      <MemoryRouter>
        <EnrollmentDetails enrollment={enrollmentMock} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Detalhes da Matrícula/i)).toBeInTheDocument();
    expect(screen.getByText(/Aluno/i).nextSibling).toHaveTextContent('João Silva');
    expect(screen.getByText(/Turma/i).nextSibling).toHaveTextContent('Sala A');
    expect(screen.getByText(/Status/i).nextSibling).toHaveTextContent('Ativa');
    expect(screen.getByText(/Data da Matrícula/i).nextSibling).toHaveTextContent('10/01/2025');

    expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Voltar/i })).toBeInTheDocument();
  });

  it('navega para a página de edição ao clicar em Editar', () => {
    render(
      <MemoryRouter>
        <EnrollmentDetails enrollment={enrollmentMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`/enrollments/edit/${enrollmentMock.id}`);
  });

  it('navega para a lista ao clicar em Voltar', () => {
    render(
      <MemoryRouter>
        <EnrollmentDetails enrollment={enrollmentMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });
});
