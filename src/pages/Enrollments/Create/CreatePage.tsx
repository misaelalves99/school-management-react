// src/pages/Enrollments/Create/CreatePage.tsx

import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';

import { useStudents } from '../../../hooks/useStudents';
import { useClassRooms } from '../../../hooks/useClassRooms';
import { useEnrollments } from '../../../hooks/useEnrollments';

import type { EnrollmentFormData } from '../../../types/EnrollmentForm';
import type { ValidationErrors } from '../../../types/ValidationErrors';

export default function CreateEnrollmentPage() {
  const navigate = useNavigate();
  const { students = [] } = useStudents();
  const { classRooms = [] } = useClassRooms();
  const { createEnrollment } = useEnrollments();

  const [form, setForm] = useState<EnrollmentFormData>({
    studentId: 0,
    classRoomId: 0,
    enrollmentDate: new Date().toISOString().slice(0, 10),
    status: 'Ativa',
  });

  const [errors, setErrors] = useState<ValidationErrors<EnrollmentFormData>>({});

  function validate(): boolean {
    const newErrors: ValidationErrors<EnrollmentFormData> = {};
    if (!form.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!form.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!form.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createEnrollment(form);
      navigate('/enrollments');
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
      alert('Ocorreu um erro ao criar a matrícula.');
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: name === 'studentId' || name === 'classRoomId' ? Number(value) : value,
    }));
  }

  if (!students.length || !classRooms.length) return <p>Carregando...</p>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Nova Matrícula</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles['form-group']}>
          <label htmlFor="studentId">Aluno</label>
          <select
            id="studentId"
            name="studentId"
            value={form.studentId || ''}
            onChange={handleChange}
          >
            <option value="">Selecione o Aluno</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.studentId && <span className={styles['text-danger']}>{errors.studentId}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="classRoomId">Turma</label>
          <select
            id="classRoomId"
            name="classRoomId"
            value={form.classRoomId || ''}
            onChange={handleChange}
          >
            <option value="">Selecione a Turma</option>
            {classRooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.classRoomId && <span className={styles['text-danger']}>{errors.classRoomId}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="enrollmentDate">Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={form.enrollmentDate}
            onChange={handleChange}
          />
          {errors.enrollmentDate && <span className={styles['text-danger']}>{errors.enrollmentDate}</span>}
        </div>

        <div className={styles['form-group']}>
          <button type="submit" className={styles['btn-submit']}>Salvar</button>
        </div>
      </form>

      <button
        className={styles['btn-secondary']}
        onClick={() => navigate('/enrollments')}
        type="button"
      >
        Voltar à Lista
      </button>
    </div>
  );
}
