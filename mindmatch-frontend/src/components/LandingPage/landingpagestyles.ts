const landingPageStyles = {
  container: {
    minHeight: '100vh',
    background: undefined, // set in component for dynamic gradient
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(1px)',
  },
  main: {
    textAlign: 'center',
    zIndex: 2,
    maxWidth: '800px',
    padding: '0 20px',
  },
  emoji: {
    fontSize: '80px',
    marginBottom: '20px',
    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
  },
  title: {
    color: 'white',
    fontSize: '4rem',
    marginBottom: '20px',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
    lineHeight: '1.2',
  },
  gradientText: {
    background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  paragraph: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '24px',
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
  },
  buttonRow: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    marginTop: '60px',
    flexWrap: 'wrap',
  },
  infoItem: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
  },
};

export default landingPageStyles;
