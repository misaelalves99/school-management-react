// src/pages/ClassRoom/Edit/EditPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditPage.module.css';
import { useClassRooms } from '../../../hooks/useClassRooms';

interface Props {
  id: number;
}

const EditClassRoom: React.FC<Props> = ({ id }) => {
  const { getById, update } = useClassRooms();
  const navigate = useNavigate();

  const classRoom = getById(id);
  const [formData, setFormData] = useState({ name: '', capacity: 1, schedule: '' });
  const [errors, setErrors] = useState<{ name?: string; capacity?: string; schedule?: string }>({});

  useEffect(() => {
    if (classRoom) {
      setFormData({ name: classRoom.name, capacity: classRoom.capacity, schedule: classRoom.schedule });
    }
  }, [classRoom]);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.capacity || formData.capacity < 1 || formData.capacity > 100) newErrors.capacity = 'Capacidade deve ser entre 1 e 100.';
    if (!formData.schedule.trim()) newErrors.schedule = 'Horário é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    update(classRoom.id, { name: formData.name, capacity: formData.capacity, schedule: formData.schedule });
    alert('Sala atualizada com sucesso!');
    navigate('/classrooms');
  };

  return (
    <>
      <h1 className={styles.title}>Editar Sala</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome</label>
          <input name="name" id="name" value={formData.name} onChange={handleChange} type="text" />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
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
          {errors.capacity && <span className={styles.textDanger}>{errors.capacity}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="schedule">Horário</label>
          <input
            name="schedule"
            id="schedule"
            value={formData.schedule}
            onChange={handleChange}
            type="text"
            placeholder="Ex: Seg - 08:00 às 10:00"
          />
          {errors.schedule && <span className={styles.textDanger}>{errors.schedule}</span>}
        </div>

        <button type="submit" className={styles.submit}>Salvar Alterações</button>
      </form>

      <button className={styles.btnSecondary} onClick={() => navigate('/classrooms')}>
        Voltar à Lista
      </button>
    </>
  );
};

export default EditClassRoom;
