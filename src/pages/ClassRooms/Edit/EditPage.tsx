// src/pages/ClassRoom/Edit/EditPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import { useClassRooms } from "../../../hooks/useClassRooms";

interface Props {
  id: number;
}

const EditClassRoom: React.FC<Props> = ({ id }) => {
  const { getById, update } = useClassRooms();
  const navigate = useNavigate();

  const classRoom = getById(id);

  const [formData, setFormData] = useState({
    name: "",
    capacity: 1,
    schedule: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    capacity?: string;
    schedule?: string;
  }>({});

  useEffect(() => {
    if (classRoom) {
      setFormData({
        name: classRoom.name,
        capacity: classRoom.capacity,
        schedule: classRoom.schedule,
      });
    }
  }, [classRoom]);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (
      !formData.capacity ||
      formData.capacity < 1 ||
      formData.capacity > 100
    ) {
      newErrors.capacity = "Capacidade deve ser entre 1 e 100.";
    }
    if (!formData.schedule.trim()) {
      newErrors.schedule = "Horário é obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    update(classRoom.id, formData);
    alert("Sala atualizada com sucesso!");
    navigate("/classrooms");
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Sala</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={styles.formInput}
          />
          {errors.name && (
            <span className={styles.formError}>{errors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacity" className={styles.formLabel}>
            Capacidade
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            max={100}
            value={formData.capacity}
            onChange={handleChange}
            className={styles.formInput}
          />
          {errors.capacity && (
            <span className={styles.formError}>{errors.capacity}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="schedule" className={styles.formLabel}>
            Horário
          </label>
          <input
            id="schedule"
            name="schedule"
            type="text"
            placeholder="Ex: Seg - 08:00 às 10:00"
            value={formData.schedule}
            onChange={handleChange}
            className={styles.formInput}
          />
          {errors.schedule && (
            <span className={styles.formError}>{errors.schedule}</span>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>
            Salvar Alterações
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate("/classrooms")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClassRoom;
