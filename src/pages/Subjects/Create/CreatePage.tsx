// src/pages/Subjects/Create/CreatePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';
import type { Subject } from '../../../types/Subject';
import { useSubjects } from '../../../hooks/useSubjects';

export default function CreateSubject() {
  const navigate = useNavigate();
  const { createSubject } = useSubjects();

  const [subject, setSubject] = useState<Omit<Subject, 'id'>>({
    name: '',
    description: '',
    workloadHours: 0,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject(prev => ({
      ...prev,
      [name]: name === 'workloadHours' ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!subject.name.trim()) newErrors.name = 'O nome da disciplina é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createSubject(subject); // salva no contexto
    alert('Disciplina cadastrada com sucesso!');
    navigate('/subjects');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastrar Nova Disciplina</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome da Disciplina</label>
          <input
            type="text"
            id="name"
            name="name"
            value={subject.name}
            onChange={handleChange}
          />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={subject.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workloadHours">Carga Horária</label>
          <input
            type="number"
            id="workloadHours"
            name="workloadHours"
            value={subject.workloadHours}
            onChange={handleChange}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Salvar</button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => navigate('/subjects')}
          >
            Voltar à Lista
          </button>
        </div>
      </form>
    </div>
  );
}
