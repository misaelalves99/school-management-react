// src/mocks/students.test.ts
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from './Students';
import type { Student } from '../types/Student';

describe('Students mocks', () => {
  const initialData: Omit<Student, 'id'>[] = [
    { name: "João Silva", email: "joao.silva@email.com", dateOfBirth: "2000-01-15", enrollmentNumber: "20230001", phone: "123456789", address: "Rua A" },
    { name: "Maria Oliveira", email: "maria.oliveira@email.com", dateOfBirth: "2001-03-22", enrollmentNumber: "20230002", phone: "987654321", address: "Rua B" },
    { name: "Pedro Santos", email: "pedro.santos@email.com", dateOfBirth: "1999-07-10", enrollmentNumber: "20230003", phone: "111222333", address: "Rua C" },
  ];

  beforeEach(() => {
    // Limpar todos os dados atuais
    getStudents().forEach(s => deleteStudent(s.id));

    // Reinserir dados iniciais
    initialData.forEach(s => createStudent(s));
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
    expect(getStudentById(999)).toBeUndefined();
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

  it('createStudent deve gerar IDs únicos mesmo após deletar', () => {
    const s1 = createStudent({ name: 'Ana', email: 'ana@email.com', dateOfBirth: '2003-01-01', enrollmentNumber: '20230005', phone: '000111222', address: 'Rua E' });
    deleteStudent(s1.id);
    const s2 = createStudent({ name: 'Bruno', email: 'bruno@email.com', dateOfBirth: '2003-02-02', enrollmentNumber: '20230006', phone: '333444555', address: 'Rua F' });
    expect(s2.id).toBeGreaterThan(s1.id);
  });

  it('updateStudent deve atualizar um aluno existente', () => {
    const updated = updateStudent(1, { phone: '000111222' });
    expect(updated).toBeDefined();
    expect(updated?.phone).toBe('000111222');
    expect(getStudentById(1)?.phone).toBe('000111222');
  });

  it('updateStudent deve atualizar parcialmente os dados', () => {
    const updated = updateStudent(1, { address: 'Rua Z' });
    expect(updated?.address).toBe('Rua Z');
    expect(getStudentById(1)?.phone).toBe('123456789'); // phone permanece
  });

  it('updateStudent deve retornar null se o aluno não existir', () => {
    expect(updateStudent(999, { phone: '000000000' })).toBeNull();
  });

  it('deleteStudent deve remover o aluno correto', () => {
    deleteStudent(2);
    expect(getStudentById(2)).toBeUndefined();
    expect(getStudents().length).toBe(2);
  });

  it('deleteStudent em aluno inexistente não deve lançar erro', () => {
    expect(() => deleteStudent(999)).not.toThrow();
  });

  it('getStudents deve retornar uma cópia do array (imutabilidade)', () => {
    const list1 = getStudents();
    const list2 = getStudents();
    expect(list1).not.toBe(list2);
    list1.pop();
    expect(list2.length).toBe(3);
  });
});
