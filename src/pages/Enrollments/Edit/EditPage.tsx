// src/pages/Enrollments/Edit/EditPage.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditPage.module.css';
import type { EnrollmentEdit } from '../../../types/EnrollmentEdit';
import type { ValidationErrors } from '../../../types/ValidationErrors';

interface EditProps {
  enrollment: EnrollmentEdit;
  onSave: (data: EnrollmentEdit) => Promise<void>;
}

export default function EditEnrollment({ enrollment, onSave }: EditProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EnrollmentEdit>({ ...enrollment });
  const [errors, setErrors] = useState<ValidationErrors<EnrollmentEdit>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'classRoomId' ? Number(value) : value,
    }));
  }

  function validate(): boolean {
    const newErrors: ValidationErrors<EnrollmentEdit> = {};
    if (!formData.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!formData.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!formData.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Editar Matrícula</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="id" value={formData.id} />

        <div className={styles['form-group']}>
          <label htmlFor="studentId">Aluno</label>
          <input
            id="studentId"
            name="studentId"
            type="number"
            value={formData.studentId}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.studentId && <span className={styles['text-danger']}>{errors.studentId}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="classRoomId">Turma</label>
          <input
            id="classRoomId"
            name="classRoomId"
            type="number"
            value={formData.classRoomId}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.classRoomId && <span className={styles['text-danger']}>{errors.classRoomId}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="enrollmentDate">Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.enrollmentDate && <span className={styles['text-danger']}>{errors.enrollmentDate}</span>}
        </div>

        <div className={styles['form-group']}>
          <button type="submit" className={styles['btn-submit']}>Salvar Alterações</button>
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
