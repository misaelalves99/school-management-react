// src/pages/ClassRooms/Create/CreatePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';
import { useClassRooms } from '../../../hooks/useClassRooms';
import type { ClassRoom } from '../../../types/ClassRoom';

export default function CreateClassRoom() {
  const navigate = useNavigate();
  const { create } = useClassRooms();

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [schedule, setSchedule] = useState('');
  const [errors, setErrors] = useState<{ name?: string; capacity?: string; schedule?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!capacity || capacity < 1 || capacity > 100) newErrors.capacity = 'Capacidade deve ser entre 1 e 100.';
    if (!schedule.trim()) newErrors.schedule = 'Horário é obrigatório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newClassRoom: Omit<ClassRoom, "id"> = {
      name,
      capacity,
      schedule,
      subjects: [],
      teachers: [],
      classTeacher: undefined,
    };

    create(newClassRoom);
    alert('Sala cadastrada com sucesso!');
    navigate('/classrooms');
  };

  return (
    <div className={styles.createContainer}>
      <h1>Cadastrar Nova Sala</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
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

        <div className={styles.formGroup}>
          <label htmlFor="schedule">Horário</label>
          <input
            id="schedule"
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="Ex: Seg - 08:00 às 10:00"
          />
          {errors.schedule && <span className={styles.textDanger}>{errors.schedule}</span>}
        </div>

        <button type="submit" className={styles.btnPrimary}>Salvar</button>
      </form>

      <button className={styles.btnSecondary} onClick={() => navigate('/classrooms')}>
        Voltar à Lista
      </button>
    </div>
  );
}
