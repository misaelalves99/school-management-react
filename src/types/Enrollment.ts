// src/types/Enrollment.ts

export interface Enrollment {
  id: number
  studentId: number
  classRoomId: number
  enrollmentDate: string // ISO string
  status: string
}
