import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserDashboard from './pages/UserDashboard';
import ManagerReview from './pages/status/ManagerReview';
import ManagerStatus from './pages/status/ManagerStatus';
import ManagerMonthlyStatus from './pages/status/ManagerMonthlyStatus';
import Logout from './pages/Logout';
import InvoiceGenerator from './pages/InvoiceGenerator';



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route path="*" element={<Navigate to="/login" />} />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />

          {/* Role-based protected routes */}
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerdashboard"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerreview"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerstatusview"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managermonthlystatus"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerMonthlyStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <InvoiceGenerator />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
