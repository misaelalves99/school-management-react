// src/pages/Students/Create/CreatePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';
import { Student } from '../../../types/Student';

export default function CreateStudent() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>({
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!student.name) newErrors.name = 'Nome é obrigatório.';
    if (!student.email) newErrors.email = 'Email é obrigatório.';
    if (!student.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!student.enrollmentNumber) newErrors.enrollmentNumber = 'Matrícula é obrigatória.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Enviar para API ou simular
    console.log('Aluno cadastrado:', student);
    navigate('/students');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.title}>Cadastrar Novo Aluno</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome</label>
          <input type="text" name="name" value={student.name} onChange={handleChange} />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={student.email} onChange={handleChange} />
          {errors.email && <span className={styles.textDanger}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dateOfBirth">Data de Nascimento</label>
          <input type="date" name="dateOfBirth" value={student.dateOfBirth} onChange={handleChange} />
          {errors.dateOfBirth && <span className={styles.textDanger}>{errors.dateOfBirth}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="enrollmentNumber">Matrícula</label>
          <input type="text" name="enrollmentNumber" value={student.enrollmentNumber} onChange={handleChange} />
          {errors.enrollmentNumber && <span className={styles.textDanger}>{errors.enrollmentNumber}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Telefone</label>
          <input type="tel" name="phone" value={student.phone} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Endereço</label>
          <input type="text" name="address" value={student.address} onChange={handleChange} />
        </div>

        <button type="submit">Salvar</button>
      </form>

      <button className={styles.btnSecondary} onClick={() => navigate('/students')}>
        Voltar à Lista
      </button>
    </div>
  );
}
