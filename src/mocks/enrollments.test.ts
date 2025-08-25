// src/mocks/enrollments.test.ts

import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "./Enrollments";
import type { Enrollment } from "../types/Enrollment";

describe("Enrollments mocks", () => {
  beforeEach(() => {
    // Resetar dados antes de cada teste
    const initialData: Enrollment[] = [
      {
        id: 1,
        studentId: 1,
        classRoomId: 1,
        enrollmentDate: "2025-01-10",
        status: "Ativo",
      },
      {
        id: 2,
        studentId: 2,
        classRoomId: 2,
        enrollmentDate: "2025-01-15",
        status: "Inativo",
      },
      {
        id: 3,
        studentId: 1,
        classRoomId: 2,
        enrollmentDate: "2025-02-01",
        status: "Ativo",
      },
    ];

    // Limpar e reinserir
    const currentEnrollments = getEnrollments();
    while (currentEnrollments.length > 0) {
      deleteEnrollment(currentEnrollments[0].id);
    }

    initialData.forEach((e) =>
      createEnrollment({
        studentId: e.studentId,
        classRoomId: e.classRoomId,
        enrollmentDate: e.enrollmentDate,
        status: e.status,
      })
    );
  });

  it("getEnrollments deve retornar todas as matrículas", () => {
    const enrollments = getEnrollments();
    expect(enrollments.length).toBe(3);
    expect(enrollments[0].studentId).toBe(1);
  });

  it("getEnrollmentById deve retornar a matrícula correta", () => {
    const enrollment = getEnrollmentById(2);
    expect(enrollment).toBeDefined();
    expect(enrollment?.status).toBe("Inativo");
  });

  it("getEnrollmentById deve retornar undefined se não existir", () => {
    const enrollment = getEnrollmentById(999);
    expect(enrollment).toBeUndefined();
  });

  it("createEnrollment deve adicionar uma nova matrícula", () => {
    const newEnrollment = createEnrollment({
      studentId: 3,
      classRoomId: 1,
      enrollmentDate: "2025-03-01",
      status: "Ativo",
    });
    expect(newEnrollment.id).toBeGreaterThan(0);
    expect(getEnrollments()).toContainEqual(newEnrollment);
  });

  it("updateEnrollment deve atualizar uma matrícula existente", () => {
    const updated = updateEnrollment(1, { status: "Inativo" });
    expect(updated).toBeDefined();
    expect(updated?.status).toBe("Inativo");
    expect(getEnrollmentById(1)?.status).toBe("Inativo");
  });

  it("updateEnrollment deve retornar null se a matrícula não existir", () => {
    const updated = updateEnrollment(999, { status: "Ativo" });
    expect(updated).toBeNull();
  });

  it("deleteEnrollment deve remover a matrícula correta", () => {
    deleteEnrollment(2);
    expect(getEnrollmentById(2)).toBeUndefined();
    expect(getEnrollments().length).toBe(2);
  });
});
