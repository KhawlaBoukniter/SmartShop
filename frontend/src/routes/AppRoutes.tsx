import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ClientDashboard from '../pages/client/ClientDashboard';
import UnauthorizedPage from '../pages/error/UnauthorizedPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import ProductsListPage from '../pages/products/ProductsListPage';

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENT']}>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
                            <ProductsListPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
