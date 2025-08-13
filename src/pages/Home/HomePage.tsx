// src/pages/Home/HomePage.tsx

import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>Bem-vindo ao Sistema de Gestão Escolar</h1>
      <p className={styles.lead}>
        Gerencie facilmente alunos, professores, disciplinas, matrículas,
        presenças e notas em um único lugar.
      </p>

      <ul className={styles.features}>
        <li className={styles["feature-card"]}>
          <Link to="/students">Gerenciar Alunos</Link>
        </li>
        <li className={styles["feature-card"]}>
          <Link to="/teachers">Gerenciar Professores</Link>
        </li>
        <li className={styles["feature-card"]}>
          <Link to="/subjects">Gerenciar Disciplinas</Link>
        </li>
        <li className={styles["feature-card"]}>
          <Link to="/classrooms">Gerenciar Salas</Link>
        </li>
        <li className={styles["feature-card"]}>
          <Link to="/enrollments">Gerenciar Matrículas</Link>
        </li>
      </ul>
    </div>
  );
}
