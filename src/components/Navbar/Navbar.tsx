// src/components/Navbar/Navbar.tsx

import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <div className={styles.navbarLogo}>
          <NavLink to="/" className={styles.logoLink}>
            <span className={styles.logoText}>Minha Escola</span>
          </NavLink>
        </div>

        {/* Menu */}
        <ul className={styles.navbarMenu}>
          <li><NavLink to="/">Início</NavLink></li>
          <li><NavLink to="/students">Alunos</NavLink></li>
          <li><NavLink to="/teachers">Professores</NavLink></li>
          <li><NavLink to="/subjects">Disciplinas</NavLink></li>
          <li><NavLink to="/classrooms">Salas</NavLink></li>
          <li><NavLink to="/enrollments">Matrículas</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
