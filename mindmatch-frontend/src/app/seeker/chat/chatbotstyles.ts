// Chatbot modal styles as a JS object for use with style prop or styled-components
import type { CSSProperties } from 'react';

export const chatbotModalStyles: CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  margin: '0 auto',
  width: '100vw',
  maxWidth: 400,
  minWidth: 0,
  height: '60vh',
  minHeight: 320,
  background: '#fff',
  boxShadow: '0 8px 32px rgba(99,102,241,0.22)',
  borderRadius: '18px 18px 0 0',
  zIndex: 2000,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: 'Inter, Arial, sans-serif',
  transition: 'box-shadow 0.2s',
  padding: 0,
  border: 'none',
  touchAction: 'manipulation',
};
