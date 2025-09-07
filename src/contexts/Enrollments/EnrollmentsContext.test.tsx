// src/contexts/Enrollments/EnrollmentsContext.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useContext, ReactNode, FC } from 'react';
import { EnrollmentsContext, EnrollmentsContextType } from './EnrollmentsContext';
import type { Enrollment } from '../../types/enrollment';
import type { EnrollmentFormData } from '../../types/enrollment-form';
import type { EnrollmentEdit } from '../../types/enrollment-edit';

describe('EnrollmentsContext', () => {
  it('deve ter valor inicial indefinido', () => {
    const { result } = renderHook(() => useContext(EnrollmentsContext));
    expect(result.current).toBeUndefined();
  });

  it('deve aceitar um provider com valores mock e expor dados corretamente', async () => {
    const mockValue: EnrollmentsContextType = {
      enrollments: [],
      refresh: jest.fn(),
      createEnrollment: jest.fn(
        async (data: EnrollmentFormData): Promise<Enrollment> => ({
          id: 1,
          studentId: data.studentId,
          classRoomId: data.classRoomId,
          enrollmentDate: data.enrollmentDate,
          status: data.status ?? 'active',
        })
      ),
      updateEnrollment: jest.fn(
        async (data: EnrollmentEdit): Promise<Enrollment | null> => ({
          id: data.id,
          studentId: data.studentId!,
          classRoomId: data.classRoomId!,
          enrollmentDate: data.enrollmentDate!,
          status: data.status ?? 'active',
        })
      ),
      removeEnrollment: jest.fn(),
    };

    const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
      <EnrollmentsContext.Provider value={mockValue}>
        {children}
      </EnrollmentsContext.Provider>
    );

    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });
    const ctx = result.current!;

    // Teste básico
    expect(ctx).toBe(mockValue);
    expect(ctx.enrollments).toEqual([]);

    // Testa createEnrollment
    const formData: EnrollmentFormData = {
      studentId: 123,
      classRoomId: 456,
      enrollmentDate: '2025-01-01',
      status: 'active',
    };

    let created: Enrollment | null = null; // ✅ inicializado
    await act(async () => {
      created = await ctx.createEnrollment(formData);
    });

    expect(ctx.createEnrollment).toHaveBeenCalledWith(formData);
    expect(created).not.toBeNull();
    expect(created!).toMatchObject({
      id: 1,
      studentId: 123,
      classRoomId: 456,
      enrollmentDate: '2025-01-01',
      status: 'active',
    });

    // Testa updateEnrollment
    const editData: EnrollmentEdit = {
      id: 1,
      studentId: 999,
      classRoomId: 888,
      enrollmentDate: '2025-02-01',
      status: 'inactive',
    };

    let updated: Enrollment | null = null; // ✅ inicializado
    await act(async () => {
      updated = await ctx.updateEnrollment(editData);
    });

    expect(ctx.updateEnrollment).toHaveBeenCalledWith(editData);
    expect(updated).not.toBeNull();
    expect(updated!).toMatchObject({
      id: 1,
      studentId: 999,
      classRoomId: 888,
      enrollmentDate: '2025-02-01',
      status: 'inactive',
    });

    // Testa removeEnrollment
    act(() => {
      ctx.removeEnrollment(1);
    });

    expect(ctx.removeEnrollment).toHaveBeenCalledWith(1);
  });
});
