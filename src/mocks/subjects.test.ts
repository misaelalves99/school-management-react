// src/mocks/subjects.test.ts

import { mockSubjects } from './Subjects';

describe('mockSubjects', () => {
  beforeEach(() => {
    // Resetar os dados originais
    while (mockSubjects.list().length > 0) {
      const last = mockSubjects.list()[mockSubjects.list().length - 1];
      mockSubjects.delete(last.id);
    }
    // Recriar os dados iniciais
    mockSubjects.create({ name: "Matemática", description: "Disciplina de matemática básica", workloadHours: 60 });
    mockSubjects.create({ name: "Física", description: "Fundamentos de física moderna", workloadHours: 60 });
    mockSubjects.create({ name: "Química", description: "Introdução à química orgânica", workloadHours: 60 });
    mockSubjects.create({ name: "Biologia", description: "Biologia celular e molecular", workloadHours: 60 });
  });

  it('list deve retornar todas as disciplinas', () => {
    const subjects = mockSubjects.list();
    expect(subjects.length).toBe(4);
    expect(subjects[0].name).toBe('Matemática');
  });

  it('get deve retornar disciplina pelo id', () => {
    const subject = mockSubjects.get(2);
    expect(subject).toBeDefined();
    expect(subject?.name).toBe('Física');
  });

  it('get deve retornar undefined se não existir', () => {
    const subject = mockSubjects.get(999);
    expect(subject).toBeUndefined();
  });

  it('create deve adicionar uma nova disciplina', () => {
    const newSubject = mockSubjects.create({ name: 'História', description: 'História do Brasil', workloadHours: 50 });
    expect(newSubject.id).toBeGreaterThan(0);
    expect(mockSubjects.list()).toContainEqual(newSubject);
  });

  it('update deve atualizar disciplina existente', () => {
    const updated = mockSubjects.update(1, { workloadHours: 100 });
    expect(updated).toBeDefined();
    expect(updated?.workloadHours).toBe(100);
    expect(mockSubjects.get(1)?.workloadHours).toBe(100);
  });

  it('update deve retornar undefined se disciplina não existir', () => {
    const updated = mockSubjects.update(999, { workloadHours: 100 });
    expect(updated).toBeUndefined();
  });

  it('delete deve remover disciplina existente', () => {
    const result = mockSubjects.delete(3);
    expect(result).toBe(true);
    expect(mockSubjects.get(3)).toBeUndefined();
    expect(mockSubjects.list().length).toBe(3);
  });

  it('delete deve retornar false se disciplina não existir', () => {
    const result = mockSubjects.delete(999);
    expect(result).toBe(false);
  });
});
