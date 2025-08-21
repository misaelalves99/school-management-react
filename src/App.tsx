// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Componentes principais
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
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
import EnrollmentIndexPage from "./pages/Enrollments/index";
import CreateEnrollment from "./pages/Enrollments/Create/CreatePage";
import {
  EnrollmentDetailsWrapper,
  EnrollmentEditWrapper,
  EnrollmentDeleteWrapper,
} from "./pages/Enrollments/wrappers";

// Providers
import { StudentsProvider } from "./contexts/Students/StudentsProvider";
import { TeachersProvider } from "./contexts/Teachers/TeachersProvider";
import { SubjectsProvider } from "./contexts/Subjects/SubjectsProvider";
import { ClassRoomProvider } from "./contexts/ClassRooms/ClassRoomProvider";
import { EnrollmentsProvider } from "./contexts/Enrollments/EnrollmentsProvider";

// CSS global
import "./index.css";

export default function App() {
  return (
    <TeachersProvider>
      <StudentsProvider>
        <SubjectsProvider>
          <ClassRoomProvider>
            <EnrollmentsProvider>
              <BrowserRouter>
                <Navbar />
                <main className="container">
                  <Routes>
                    <Route path="/" element={<HomePage />} />

                    {/* Alunos */}
                    <Route path="/students" element={<StudentsPage />} />
                    <Route path="/students/create" element={<StudentCreatePage />} />
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
                    <Route path="/classrooms/details/:id" element={<ClassRoomDetailsPageWrapper />} />
                    <Route path="/classrooms/edit/:id" element={<ClassRoomEditPageWrapper />} />
                    <Route path="/classrooms/delete/:id" element={<ClassRoomDeletePageWrapper />} />

                    {/* Matrículas */}
                    <Route path="/enrollments" element={<EnrollmentIndexPage />} />
                    <Route path="/enrollments/create" element={<CreateEnrollment />} />
                    <Route path="/enrollments/details/:id" element={<EnrollmentDetailsWrapper />} />
                    <Route path="/enrollments/edit/:id" element={<EnrollmentEditWrapper />} />
                    <Route path="/enrollments/delete/:id" element={<EnrollmentDeleteWrapper />} />

                    {/* Redirecionamento */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </BrowserRouter>
            </EnrollmentsProvider>
          </ClassRoomProvider>
        </SubjectsProvider>
      </StudentsProvider>
    </TeachersProvider>
  );
}
