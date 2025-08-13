// src/pages/Students/Edit/EditPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditPage.module.css';
import { mockStudents } from '../../../mocks/students';
import type { Student } from '../../../types/Student';

export default function EditStudent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!id) {
      alert('ID do aluno não fornecido.');
      navigate('/students');
      return;
    }

    const student = mockStudents.find((s) => s.id === Number(id));
    if (!student) {
      alert('Aluno não encontrado.');
      navigate('/students');
      return;
    }

    // Extrai 'restFormData' sem atribuir 'id' a uma variável
    const { ...restFormData } = student;
    setFormData(restFormData);
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const index = mockStudents.findIndex((s) => s.id === Number(id));
    if (index !== -1) {
      mockStudents[index] = { id: Number(id), ...formData };
      alert('Aluno atualizado!');
    }
    navigate('/students');
  };

  return (
    <>
      <h1 className={styles.title}>Editar Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, val]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type={key === 'dateOfBirth' ? 'date' : 'text'}
              value={val}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate('/students')}>Voltar</button>
        </div>
      </form>
    </>
  );
}
