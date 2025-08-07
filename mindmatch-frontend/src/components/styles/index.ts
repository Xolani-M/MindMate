export const styles = {
  colors: {
    primary: '#6366f1',
    primaryHover: '#5855eb',
    secondary: '#14b8a6',
    accent: '#f472b6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientHover: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    healingGlow: 'rgba(99, 102, 241, 0.15)',
    background: '#fafbff',
    surface: 'rgba(255, 255, 255, 0.95)',
    surfaceGlass: 'rgba(255, 255, 255, 0.1)',
  },
  transitions: {
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    float: 'transform 6s ease-in-out infinite',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
  },
  shadows: {
    soft: '0 4px 20px rgba(99, 102, 241, 0.1)',
    medium: '0 8px 40px rgba(99, 102, 241, 0.15)',
    strong: '0 20px 60px rgba(99, 102, 241, 0.2)',
    glow: '0 0 30px rgba(99, 102, 241, 0.3)',
  }
};
