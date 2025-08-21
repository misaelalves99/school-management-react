// src/pages/Enrollments/Edit/EditPage.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditPage.module.css';
import type { EnrollmentEdit as EnrollmentEditType } from '../../../types/EnrollmentEdit';

interface EditProps {
  enrollment: EnrollmentEditType;
  onSave: (data: EnrollmentEditType) => Promise<void>;
}

export default function EditEnrollment({ enrollment, onSave }: EditProps) {
  const [formData, setFormData] = useState<EnrollmentEditType>({ ...enrollment });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'classRoomId' ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!formData.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!formData.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSave(formData);
      navigate('/enrollments');
    } catch (error) {
      console.error('Erro ao salvar matrícula:', error);
    }
  }

  return (
    <>
      <h1 className={styles.title}>Editar Matrícula</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="id" value={formData.id} />

        <div className={styles.formGroup}>
          <label htmlFor="studentId">Aluno</label>
          <input
            id="studentId"
            name="studentId"
            type="number"
            value={formData.studentId}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.studentId && <span className={styles.textDanger}>{errors.studentId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="classRoomId">Turma</label>
          <input
            id="classRoomId"
            name="classRoomId"
            type="number"
            value={formData.classRoomId}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.classRoomId && <span className={styles.textDanger}>{errors.classRoomId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="enrollmentDate">Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.enrollmentDate && <span className={styles.textDanger}>{errors.enrollmentDate}</span>}
        </div>

        <button type="submit" className={styles.btnSubmit}>Salvar Alterações</button>
      </form>

      <button
        className={styles.btnSecondary}
        onClick={() => navigate('/enrollments')}
      >
        Voltar à Lista
      </button>
    </>
  );
}
