// Chatbot modal styles for inline style prop usage
import type { CSSProperties } from 'react';

export const chatbotModalStyles: CSSProperties = {
  position: 'fixed',
  right: 24,
  bottom: 90,
  width: 370,
  maxWidth: '90vw',
  minWidth: 0,
  height: '60vh',
  minHeight: 320,
  background: '#fff',
  boxShadow: '0 8px 32px rgba(99,102,241,0.22)',
  borderRadius: '18px',
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
