import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
  }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>404</h1>
    <p style={{ color: '#64748b', marginTop: '0.75rem', fontSize: '1.1rem' }}>
      Page not found
    </p>
    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: '2rem' }}>
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
