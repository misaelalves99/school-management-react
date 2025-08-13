// src/pages/Subjects/Edit/EditPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditPage.module.css';

interface Subject {
  id: number;
  name: string;
  description: string;
}

const mockSubject: Subject = {
  id: 1,
  name: 'Matemática',
  description: 'Disciplina de matemática básica',
};

export default function EditSubject() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [subject, setSubject] = useState<Subject>({
    id: 0,
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    // Simula fetch do dado pelo id
    setSubject(mockSubject);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject(prev => ({ ...prev, [name]: value }));
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
