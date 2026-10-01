import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { Login } from "@/pages/Login";
import { Subjects } from "@/pages/Subjects/Subjects";
import { AddSubject } from "@/pages/Subjects/AddSubject";
import { Chapters } from "@/pages/Chapters/Chapters";
import { AddChapter } from "@/pages/Chapters/AddChapter";
import { Questions } from "@/pages/Questions/Questions";
import { AddQuestion } from "@/pages/Questions/AddQuestion";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/add" element={<AddSubject />} />
          <Route path="/subjects/:subjectId/chapters" element={<Chapters />} />
          <Route path="/subjects/:subjectId/chapters/add" element={<AddChapter />} />
          <Route path="/chapters/:chapterId/questions" element={<Questions />} />
          <Route path="/chapters/:chapterId/questions/add" element={<AddQuestion />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/subjects" replace />} />
      <Route path="*" element={<Navigate to="/subjects" replace />} />
    </Routes>
  );
}
