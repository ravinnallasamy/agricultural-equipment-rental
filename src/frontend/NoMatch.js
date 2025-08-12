import React from 'react';

// Internal styles (CSS-in-JS)
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#dc3545',
    marginBottom: '20px'
  },
  message: {
    fontSize: '1.5rem',
    color: '#6c757d',
    marginBottom: '30px',
    maxWidth: '600px',
    lineHeight: '1.6'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }
  },
  image: {
    width: '150px',
    marginBottom: '30px',
    opacity: '0.8'
  }
};

export default function NoMatch() {
  return (
    <div style={styles.container}>
      {/* Inline SVG for the 404 illustration */}
      <div style={styles.image}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="150" height="150" fill="#dc3545">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      
      <h1 style={styles.title}>404 - Page Not Found</h1>
      
      <p style={styles.message}>
        Oops! The page you're looking for doesn't exist or has been moved.
        Try checking the URL or navigate back to our homepage.
      </p>
      
      <a 
        href="/" 
        style={styles.button}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#0056b3';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#007bff';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Go to Homepage
      </a>
    </div>
  );
}