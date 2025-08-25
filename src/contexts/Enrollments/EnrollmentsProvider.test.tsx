// src/contexts/Enrollments/EnrollmentsProvider.test.tsx

import { renderHook, act } from '@testing-library/react';
import { ReactNode, useContext } from 'react';
import { EnrollmentsProvider } from './EnrollmentsProvider';
import { EnrollmentsContext } from './EnrollmentsContext';
import * as mockEnrollments from '../../mocks/Enrollments';

describe('EnrollmentsProvider', () => {
  const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <EnrollmentsProvider>{children}</EnrollmentsProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fornecer valores iniciais corretamente', () => {
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current?.enrollments.length).toBe(mockEnrollments.getEnrollments().length);
  });

  it('deve criar um novo enrollment', async () => {
    const createSpy = jest.spyOn(mockEnrollments, 'createEnrollment'); // corrigido
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    const newData = { studentId: 99, classRoomId: 1, enrollmentDate: '2025-08-21', status: 'active' };

    let newEnrollment;
    await act(async () => {
      newEnrollment = await result.current!.createEnrollment(newData);
    });

    expect(createSpy).toHaveBeenCalledWith({
      studentId: 99,
      classRoomId: 1,
      enrollmentDate: '2025-08-21',
      status: 'active',
    });
    expect(newEnrollment).toHaveProperty('id');
  });

  it('deve atualizar um enrollment existente', async () => {
    const updateSpy = jest.spyOn(mockEnrollments, 'updateEnrollment'); // corrigido
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    const updateData = { id: 1, studentId: 1, classRoomId: 2, enrollmentDate: '2025-08-21', status: 'inactive' };

    let updated;
    await act(async () => {
      updated = await result.current!.updateEnrollment(updateData);
    });

    expect(updateSpy).toHaveBeenCalledWith(1, updateData);
    expect(updated).toMatchObject(updateData);
  });

  it('deve remover um enrollment', () => {
    const deleteSpy = jest.spyOn(mockEnrollments, 'deleteEnrollment'); // corrigido
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    act(() => {
      result.current!.removeEnrollment(1);
    });

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it('deve atualizar a lista após refresh', () => {
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    const originalLength = result.current!.enrollments.length;

    act(() => {
      result.current!.refresh();
    });

    expect(result.current!.enrollments.length).toBe(originalLength);
  });
});
