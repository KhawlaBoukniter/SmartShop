import React from 'react';

const DashboardPage: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <div className="m-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome to the administration panel.</p>
            </div>
        </div>
    );
};

export default DashboardPage;
