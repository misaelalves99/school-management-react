// src/pages/Subjects/Edit/EditPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditPage.module.css';
import type { Subject } from '../../../types/Subject';
import { mockSubjects } from '../../../mocks/subjects';

export default function EditSubject() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [subject, setSubject] = useState<Subject>({
    id: 0,
    name: '',
    description: '',
    workloadHours: 0,
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (!id) {
      alert('ID da disciplina não fornecido.');
      navigate('/subjects');
      return;
    }

    const subjectId = Number(id);
    const found = mockSubjects.find(s => s.id === subjectId);
    if (!found) {
      alert('Disciplina não encontrada.');
      navigate('/subjects');
      return;
    }

    setSubject(found);
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject(prev => ({ ...prev, [name]: name === 'workloadHours' ? Number(value) : value }));
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

    console.log('Salvar alterações:', subject); // Substituir pela chamada real API
    navigate('/subjects');
  };

  return (
    <>
      <h1 className={styles.title}>Editar Disciplina</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="id" value={subject.id} />

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

        <button type="submit">Salvar Alterações</button>
      </form>

      <button
        className={styles.btnSecondary}
        onClick={() => navigate('/subjects')}
      >
        Voltar à Lista
      </button>
    </>
  );
}
