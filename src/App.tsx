// src/App.tsx

// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useCallback } from "react";

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/Home/HomePage";

// Alunos
import StudentsPage from "./pages/Students";
import StudentCreatePage from "./pages/Students/Create/CreatePage";
import StudentEditPage from "./pages/Students/Edit/EditPage";
import StudentDetailsPage from "./pages/Students/Details/DetailsPage";
import StudentDeletePage from "./pages/Students/Delete/DeletePage";

// Professores
import TeachersPage from "./pages/Teachers";
import TeacherCreatePage from "./pages/Teachers/Create/CreatePage";
import TeacherDetailsPage from "./pages/Teachers/Details/DetailsPage";
import TeacherEditPage from "./pages/Teachers/Edit/EditPage";
import TeacherDeletePage from "./pages/Teachers/Delete/DeletePage";

// Disciplinas
import SubjectsPage from "./pages/Subjects";
import CreateSubject from "./pages/Subjects/Create/CreatePage";
import SubjectDetailsPage from "./pages/Subjects/Details/DetailsPage";
import SubjectEditPage from "./pages/Subjects/Edit/EditPage";
import SubjectDeletePage from "./pages/Subjects/Delete/DeletePage";

// Salas
import ClassroomsPage from "./pages/ClassRooms";
import ClassroomCreatePage from "./pages/ClassRooms/Create/CreatePage";
import {
  ClassRoomDeletePageWrapper,
  ClassRoomDetailsPageWrapper,
  ClassRoomEditPageWrapper,
} from "./pages/ClassRooms/wrappers";

// Matrículas
import EnrollmentIndexPage from "./pages/Enrollments/Index";
import CreateEnrollment from "./pages/Enrollments/Create/CreatePage";
import {
  EnrollmentDetailsWrapper,
  EnrollmentEditWrapper,
  EnrollmentDeleteWrapper,
} from "./pages/Enrollments/wrappers";

// Tipos
import type { Enrollment } from "./types/enrollment";
import type { EnrollmentForm } from "./types/enrollmentForm";
import type { Student } from "./types/Student";

// Mocks
import { mockStudents } from "./mocks/students";
import { mockClassRooms } from "./mocks/classRooms"; // CORRECTED: Changed to named import
import mockEnrollments from "./mocks/enrollments";
import Footer from "components/Footer/Footer";
import './index.css';

export default function App() {
  // Estado de alunos
  const [students, setStudents] = useState<Student[]>(mockStudents);

  const handleAddStudent = useCallback((newStudent: Omit<Student, "id">) => {
    const studentToAdd: Student = {
      ...newStudent,
      id: students.length + 1, // ID incremental simples
    };
    setStudents((prev) => [...prev, studentToAdd]);
  }, [students]);

  // Estado de matrículas
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);

  const handleCreateEnrollment = useCallback(
    (newEnrollment: EnrollmentForm) => {
      if (
        typeof newEnrollment.studentId !== "number" ||
        typeof newEnrollment.classRoomId !== "number"
      ) {
        return Promise.reject(
          new Error("Student ID e Classroom ID precisam ser números.")
        );
      }

      const enrollmentToAdd: Enrollment = {
        id: enrollments.length + 1,
        studentId: newEnrollment.studentId,
        classRoomId: newEnrollment.classRoomId,
        enrollmentDate: newEnrollment.enrollmentDate,
        status: "Ativo",
      };

      setEnrollments((prev) => [...prev, enrollmentToAdd]);
      return Promise.resolve();
    },
    [enrollments]
  );

  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Alunos */}
          <Route path="/students" element={<StudentsPage />} />
          <Route
            path="/students/create"
            element={<StudentCreatePage onAddStudent={handleAddStudent} />}
          />
          <Route path="/students/details/:id" element={<StudentDetailsPage />} />
          <Route path="/students/edit/:id" element={<StudentEditPage />} />
          <Route path="/students/delete/:id" element={<StudentDeletePage />} />

          {/* Professores */}
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/create" element={<TeacherCreatePage />} />
          <Route path="/teachers/details/:id" element={<TeacherDetailsPage />} />
          <Route path="/teachers/edit/:id" element={<TeacherEditPage />} />
          <Route path="/teachers/delete/:id" element={<TeacherDeletePage />} />

          {/* Disciplinas */}
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/create" element={<CreateSubject />} />
          <Route path="/subjects/details/:id" element={<SubjectDetailsPage />} />
          <Route path="/subjects/edit/:id" element={<SubjectEditPage />} />
          <Route path="/subjects/delete/:id" element={<SubjectDeletePage />} />

          {/* Salas */}
          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route path="/classrooms/create" element={<ClassroomCreatePage />} />
          <Route
            path="/classrooms/details/:id"
            element={<ClassRoomDetailsPageWrapper />}
          />
          <Route
            path="/classrooms/edit/:id"
            element={<ClassRoomEditPageWrapper />}
          />
          <Route
            path="/classrooms/delete/:id"
            element={<ClassRoomDeletePageWrapper />}
          />

          {/* Matrículas */}
          <Route path="/enrollments" element={<EnrollmentIndexPage />} />
          <Route
            path="/enrollments/create"
            element={
              <CreateEnrollment
                students={students}
                classRooms={mockClassRooms}
                onCreate={handleCreateEnrollment}
              />
            }
          />
          <Route
            path="/enrollments/details/:id"
            element={<EnrollmentDetailsWrapper />}
          />
          <Route
            path="/enrollments/edit/:id"
            element={<EnrollmentEditWrapper />}
          />
          <Route
            path="/enrollments/delete/:id"
            element={<EnrollmentDeleteWrapper />}
          />

          {/* Redirecionamento para Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  );
}
