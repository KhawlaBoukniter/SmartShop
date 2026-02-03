import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ClientDashboard from '../pages/client/ClientDashboard';
import UnauthorizedPage from '../pages/error/UnauthorizedPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import ProductsListPage from '../pages/products/ProductsListPage';
import ClientsListPage from '../pages/admin/clients/ClientsListPage';
import ClientDetailsPage from '../pages/admin/clients/ClientDetailsPage';
import OrdersListPage from '../pages/orders/OrdersListPage';
import OrderDetailsPage from '../pages/orders/OrderDetailsPage';
import MainLayout from '../components/layout/MainLayout';

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
                            <MainLayout>
                                <AdminDashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENT']}>
                            <MainLayout>
                                <ClientDashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
                            <MainLayout>
                                <ProductsListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/clients"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <MainLayout>
                                <ClientsListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/clients/:id"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <MainLayout>
                                <ClientDetailsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <MainLayout>
                                <OrdersListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders/:id"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <MainLayout>
                                <OrderDetailsPage />
                            </MainLayout>
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
