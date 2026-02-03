import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>Vue d'ensemble</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Bienvenue sur votre espace d'administration. Sélectionnez une section pour commencer.</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                <Link to="/products" style={{ textDecoration: 'none' }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        borderLeft: '5px solid #764ba2',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        height: '100%',
                        boxSizing: 'border-box'
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}
                    >
                        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>📦 Produits</h3>
                        <p style={{ margin: 0, color: '#666' }}>Gérer le catalogue, ajouter ou modifier des articles.</p>
                    </div>
                </Link>

                <Link to="/admin/clients" style={{ textDecoration: 'none' }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        borderLeft: '5px solid #007bff',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        height: '100%',
                        boxSizing: 'border-box'
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}
                    >
                        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>👥 Clients</h3>
                        <p style={{ margin: 0, color: '#666' }}>Voir la liste des clients et leurs détails.</p>
                    </div>
                </Link>

                <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        borderLeft: '5px solid #28a745',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        height: '100%',
                        boxSizing: 'border-box'
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}
                    >
                        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>🛒 Commandes</h3>
                        <p style={{ margin: 0, color: '#666' }}>Suivre les commandes, valider ou rejeter les achats.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
