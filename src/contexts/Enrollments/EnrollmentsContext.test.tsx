// src/contexts/Enrollments/EnrollmentsContext.test.tsx

import { renderHook } from '@testing-library/react';
import { useContext, ReactNode, FC } from 'react';
import { EnrollmentsContext, EnrollmentsContextType } from './EnrollmentsContext';
import type { Enrollment } from '../../types/Enrollment';

describe('EnrollmentsContext', () => {
  it('deve ter valor inicial indefinido', () => {
    const { result } = renderHook(() => useContext(EnrollmentsContext));
    expect(result.current).toBeUndefined();
  });

  it('deve aceitar um provider com valores mock', () => {
    const mockValue: EnrollmentsContextType = {
      enrollments: [],
      refresh: jest.fn(),
      createEnrollment: jest.fn(async (data: Omit<Enrollment, 'id'>) => ({
        id: 1,
        studentId: data.studentId,
        classRoomId: data.classRoomId,
        enrollmentDate: data.enrollmentDate,
        status: data.status ?? 'active', // garante string
      })),
      updateEnrollment: jest.fn(async (data: Partial<Enrollment> & { id: number }) => ({
        id: data.id,
        studentId: data.studentId!,
        classRoomId: data.classRoomId!,
        enrollmentDate: data.enrollmentDate!,
        status: data.status ?? 'active',
      })),
      removeEnrollment: jest.fn(),
    };

    const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
      <EnrollmentsContext.Provider value={mockValue}>
        {children}
      </EnrollmentsContext.Provider>
    );

    const { result } = renderHook(() => useContext(EnrollmentsContext), { wrapper });

    expect(result.current).toBe(mockValue);
    expect(result.current?.enrollments).toEqual([]);
  });
});
