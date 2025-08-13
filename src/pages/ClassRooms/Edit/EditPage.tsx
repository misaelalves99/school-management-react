// src/pages/ClassRoom/Edit/EditPage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './EditPage.module.css';

type Props = {
  id: number;
  name: string;
  capacity: number;
  onSubmit: (data: { id: number; name: string; capacity: number }) => void;
};

const EditClassRoom: React.FC<Props> = ({ id, name, capacity, onSubmit }) => {
  const [formData, setFormData] = useState({ name, capacity });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id, ...formData });
  };

  return (
    <>
      <h1 className={styles.title}>Editar Sala</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" value={id} />

        <div className={styles.formGroup}>
          <label htmlFor="name">Nome</label>
          <input name="name" id="name" value={formData.name} onChange={handleChange} type="text" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacity">Capacidade</label>
          <input
            name="capacity"
            id="capacity"
            value={formData.capacity}
            onChange={handleChange}
            type="number"
            min={1}
            max={100}
          />
        </div>

        <button type="submit" className={styles.submit}>
          Salvar Alterações
        </button>
      </form>

      <Link to="/classrooms" className={styles.btnSecondary}>
        Voltar à Lista
      </Link>
    </>
  );
};

export default EditClassRoom;
