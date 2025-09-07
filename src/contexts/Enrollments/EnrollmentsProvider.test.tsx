// src/contexts/Enrollments/EnrollmentsProvider.test.tsx

import { renderHook, act } from '@testing-library/react';
import { ReactNode, useContext } from 'react';
import { EnrollmentsProvider } from './EnrollmentsProvider';
import { EnrollmentsContext } from './EnrollmentsContext';
import * as mockEnrollments from '../../mocks/Enrollments';
import type { Enrollment } from '../../types/enrollment';

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
    expect(result.current?.enrollments).toEqual(mockEnrollments.getEnrollments());
  });

  it('deve criar um novo enrollment e atualizar estado', async () => {
    const createSpy = jest.spyOn(mockEnrollments, 'createEnrollment');
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    const newData = {
      studentId: 99,
      classRoomId: 1,
      enrollmentDate: '2025-08-21',
      status: 'active',
    };

    let newEnrollment: Enrollment | null = null; // ✅ inicializado
    await act(async () => {
      newEnrollment = await result.current!.createEnrollment(newData);
    });

    expect(createSpy).toHaveBeenCalledWith(newData);
    expect(newEnrollment).not.toBeNull();
    expect(newEnrollment!).toHaveProperty('id');
    expect(result.current!.enrollments.some(e => e.id === newEnrollment!.id)).toBe(true);
  });

  it('deve atualizar um enrollment existente e refletir no estado', async () => {
    const updateSpy = jest.spyOn(mockEnrollments, 'updateEnrollment');
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    const firstId = result.current!.enrollments[0].id;
    const updateData = {
      id: firstId,
      studentId: 1,
      classRoomId: 2,
      enrollmentDate: '2025-08-21',
      status: 'inactive',
    };

    let updated: Enrollment | null = null; // ✅ inicializado
    await act(async () => {
      updated = await result.current!.updateEnrollment(updateData);
    });

    expect(updateSpy).toHaveBeenCalledWith(firstId, updateData);
    expect(updated).not.toBeNull();
    expect(updated).toMatchObject(updateData);
    expect(result.current!.enrollments.find(e => e.id === firstId)?.status).toBe('inactive');
  });

  it('deve retornar null se tentar atualizar um enrollment inexistente', async () => {
    jest.spyOn(mockEnrollments, 'updateEnrollment').mockReturnValueOnce(null);
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    let updated: Enrollment | null = null; // ✅ inicializado
    await act(async () => {
      updated = await result.current!.updateEnrollment({
        id: 9999,
        studentId: 1,
        classRoomId: 1,
        enrollmentDate: '2025-08-21',
        status: 'inactive',
      });
    });

    expect(updated).toBeNull();
  });

  it('deve remover um enrollment e atualizar estado', () => {
    const deleteSpy = jest.spyOn(mockEnrollments, 'deleteEnrollment');
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    const firstId = result.current!.enrollments[0].id;

    act(() => {
      result.current!.removeEnrollment(firstId);
    });

    expect(deleteSpy).toHaveBeenCalledWith(firstId);
    expect(result.current!.enrollments.find(e => e.id === firstId)).toBeUndefined();
  });

  it('deve atualizar a lista após refresh', () => {
    const spyGet = jest.spyOn(mockEnrollments, 'getEnrollments');
    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    act(() => {
      result.current!.refresh();
    });

    expect(spyGet).toHaveBeenCalled();
    expect(result.current!.enrollments).toEqual(mockEnrollments.getEnrollments());
  });
});
