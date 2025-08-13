// /src/pages/ClassRooms/Create/CreatePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';

const ClassRoomCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [errors, setErrors] = useState<{ name?: string; capacity?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name) newErrors.name = 'Nome é obrigatório.';
    if (!capacity || capacity < 1 || capacity > 100)
      newErrors.capacity = 'Capacidade deve ser entre 1 e 100.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form submitted', { name, capacity });

    // Aqui você faria uma requisição para salvar a sala
    navigate('/classrooms');
  };

  return (
    <div className={styles.createContainer}>
      <h1>Cadastrar Nova Sala</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacity">Capacidade</label>
          <input
            id="capacity"
            type="number"
            min="1"
            max="100"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
          {errors.capacity && <span className={styles.textDanger}>{errors.capacity}</span>}
        </div>

        <button type="submit">Salvar</button>
      </form>

      <button className={styles.btnSecondary} onClick={() => navigate('/classrooms')}>
        Voltar à Lista
      </button>
    </div>
  );
};

export default ClassRoomCreate;
