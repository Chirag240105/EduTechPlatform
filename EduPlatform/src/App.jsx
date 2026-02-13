import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import ProtectedRoute from "./Components/Layout/ProtectedRoute";
import DashBoardPage from "./pages/Dashboard/DashBoardPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import DocumentList from "./pages/documents/DocumentList";
import DocumentDetailPage from "./pages/documents/DocumentDetailPage";
import FlashCardList from "./pages/flashcard/FlashCardList";
import FlashCard from "./pages/flashcard/FlashCard";
import QuizListPage from "./pages/Quizzes/QuizListPage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";

function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><DashBoardPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Layout><DocumentList /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/document/:id"
          element={
            <ProtectedRoute>
              <Layout><DocumentDetailPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/flashcard"
          element={
            <ProtectedRoute>
              <Layout><FlashCardList /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/flashcard/:documentId"
          element={
            <ProtectedRoute>
              <Layout><FlashCard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <Layout><QuizListPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id/take"
          element={
            <ProtectedRoute>
              <Layout><QuizTakePage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id/result"
          element={
            <ProtectedRoute>
              <Layout><QuizResultPage /></Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
