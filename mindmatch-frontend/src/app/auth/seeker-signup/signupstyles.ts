const signupStyles = {
  container: {
    minHeight: '100vh',
    background: undefined, // set in component for dynamic gradient
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
    padding: '6px',
    overflowY: 'auto',
  },
  orb: {
    position: 'absolute',
    top: '5%',
    left: '15%',
    width: '250px',
    height: '250px',
    background: undefined, // set in component
    borderRadius: '50%',
    filter: 'blur(50px)',
  },
  card: {
    maxWidth: '600px',
    width: '100%',
    padding: '16px',
    margin: '0 auto',
    boxSizing: 'border-box',
    minHeight: 'unset',
  },
  emoji: {
    fontSize: '32px',
    marginBottom: '8px',
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
    margin: '10px 0',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    width: '100%',
    boxSizing: 'border-box',
  },
  formItemHalf: {
    width: '48%',
    minWidth: '180px',
    marginBottom: '12px',
    display: 'inline-block',
    verticalAlign: 'top',
  },
  '@media (max-width: 600px)': {
    container: {
      padding: '5px',
      minHeight: '100vh',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    card: {
      maxWidth: '100%',
      padding: '6px',
      margin: '0 auto',
      boxSizing: 'border-box',
    },
    formRow: {
      flexDirection: 'column',
      gap: '0',
    },
    formItemHalf: {
      width: '48%',
      minWidth: '120px',
      marginBottom: '8px',
      display: 'inline-block',
      verticalAlign: 'top',
    },
    emoji: {
      fontSize: '32px',
      marginBottom: '8px',
    },
    title: {
      fontSize: '1.2rem',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '13px',
      marginBottom: '8px',
    },
    formInput: {
      padding: '8px',
      fontSize: '15px',
    },
    divider: {
      margin: '12px 0',
    },
    backHome: {
      marginTop: '10px',
    },
    centerText: {
      marginBottom: '8px',
    },
  },
  formInput: {
    borderRadius: '12px',
    border: undefined, // set in component
    padding: '8px',
    fontSize: '15px',
  },
  checkbox: {
    color: '#666',
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
    marginTop: '8px',
  },
};

export default signupStyles;
