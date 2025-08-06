const loginStyles = {
  container: {
    minHeight: '100vh',
    background: undefined, // set in component for dynamic gradient
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '20px',
  },
  orbTop: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '300px',
    height: '300px',
    background: undefined, // set in component
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: 0.6,
  },
  orbBottom: {
    position: 'absolute',
    bottom: '20%',
    left: '5%',
    width: '200px',
    height: '200px',
    background: undefined, // set in component
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.8,
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    padding: '12px',
    margin: '0 auto',
    boxSizing: 'border-box',
    minHeight: 'unset',
  },
  emoji: {
    fontSize: '50px',
    marginBottom: '15px',
  },
  title: {
    fontSize: '1.5rem',
    margin: 0,
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '10px',
  },
  divider: {
    color: '#ccc',
  },
  formInput: {
    borderRadius: '12px',
    border: undefined, // set in component
    padding: '12px',
    fontSize: '16px',
    transition: undefined, // set in component
  },
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: undefined, // set in component
    padding: 0,
    fontWeight: '600',
  },
  centerText: {
    textAlign: 'center',
  },
  backHome: {
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default loginStyles;
