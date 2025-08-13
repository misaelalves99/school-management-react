// src/pages/Subjects/Create/CreatePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';
import type { Subject } from '../../../types/Subject';

export default function CreateSubject() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject>({
    name: '',
    description: '',
    workloadHours: 0, // inicialização da nova propriedade
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject(prev => ({
      ...prev,
      [name]: name === 'workloadHours' ? Number(value) : value, // converte para number se for workloadHours
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

    console.log('Salvar:', subject); // Aqui faria a chamada à API
    navigate('/subjects');
  };

  return (
    <>
      <h1 className={styles.title}>Cadastrar Nova Disciplina</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.createContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome da Disciplina</label>
            <input type="text" id="name" name="name" value={subject.name} onChange={handleChange} />
            {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição</label>
            <textarea id="description" name="description" value={subject.description} onChange={handleChange} />
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

          <button type="submit">Salvar</button>
        </div>
      </form>

      <button className={styles.btnSecondary} onClick={() => navigate('/subjects')}>Voltar à Lista</button>
    </>
  );
}
