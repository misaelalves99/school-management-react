// src/pages/Home/HomePage.tsx

import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao Sistema de Gestão Escolar</h1>
      <p className={styles.lead}>
        Gerencie facilmente alunos, professores, disciplinas, matrículas,
        presenças e notas em um único lugar.
      </p>

      <ul className={styles.features}>
        <li className={styles.featureCard}>
          <Link to="/students" className={styles.cardLink}>Gerenciar Alunos</Link>
        </li>
        <li className={styles.featureCard}>
          <Link to="/teachers" className={styles.cardLink}>Gerenciar Professores</Link>
        </li>
        <li className={styles.featureCard}>
          <Link to="/subjects" className={styles.cardLink}>Gerenciar Disciplinas</Link>
        </li>
        <li className={styles.featureCard}>
          <Link to="/classrooms" className={styles.cardLink}>Gerenciar Salas</Link>
        </li>
        <li className={styles.featureCard}>
          <Link to="/enrollments" className={styles.cardLink}>Gerenciar Matrículas</Link>
        </li>
      </ul>
    </div>
  );
}
