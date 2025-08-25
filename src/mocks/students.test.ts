// src/mocks/students.test.ts

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from './Students';
import { Student } from '../types/Student';

describe('Students mocks', () => {
  beforeEach(() => {
    // Resetar os dados antes de cada teste
    const initialData: Student[] = [
      { id: 1, name: "João Silva", email: "joao.silva@email.com", dateOfBirth: "2000-01-15", enrollmentNumber: "20230001", phone: "123456789", address: "Rua A" },
      { id: 2, name: "Maria Oliveira", email: "maria.oliveira@email.com", dateOfBirth: "2001-03-22", enrollmentNumber: "20230002", phone: "987654321", address: "Rua B" },
      { id: 3, name: "Pedro Santos", email: "pedro.santos@email.com", dateOfBirth: "1999-07-10", enrollmentNumber: "20230003", phone: "111222333", address: "Rua C" },
    ];

    // Limpar e reinserir
    while (getStudents().length > 0) {
      const firstStudent: Student = getStudents()[0];
      deleteStudent(firstStudent.id);
    }

    initialData.forEach(s =>
      createStudent({
        name: s.name,
        email: s.email,
        dateOfBirth: s.dateOfBirth,
        enrollmentNumber: s.enrollmentNumber,
        phone: s.phone,
        address: s.address,
      })
    );
  });

  it('getStudents deve retornar todos os alunos', () => {
    const students = getStudents();
    expect(students.length).toBe(3);
    expect(students[0].name).toBe('João Silva');
  });

  it('getStudentById deve retornar o aluno correto', () => {
    const student = getStudentById(2);
    expect(student).toBeDefined();
    expect(student?.name).toBe('Maria Oliveira');
  });

  it('getStudentById deve retornar undefined se não existir', () => {
    const student = getStudentById(999);
    expect(student).toBeUndefined();
  });

  it('createStudent deve adicionar um novo aluno', () => {
    const newStudent = createStudent({
      name: 'Lucas Lima',
      email: 'lucas@email.com',
      dateOfBirth: '2002-05-05',
      enrollmentNumber: '20230004',
      phone: '555666777',
      address: 'Rua D',
    });
    expect(newStudent.id).toBeGreaterThan(0);
    expect(getStudents()).toContainEqual(newStudent);
  });

  it('updateStudent deve atualizar um aluno existente', () => {
    const updated = updateStudent(1, { phone: '000111222' });
    expect(updated).toBeDefined();
    expect(updated?.phone).toBe('000111222');
    expect(getStudentById(1)?.phone).toBe('000111222');
  });

  it('updateStudent deve retornar null se o aluno não existir', () => {
    const updated = updateStudent(999, { phone: '000000000' });
    expect(updated).toBeNull();
  });

  it('deleteStudent deve remover o aluno correto', () => {
    deleteStudent(2);
    expect(getStudentById(2)).toBeUndefined();
    expect(getStudents().length).toBe(2);
  });
});
