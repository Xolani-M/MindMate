/**
 * @fileoverview Chatbot modal styles for inline style prop usage
 * Optimized positioning to prevent overlap with dashboard content
 * Follows MINDMATE coding standards with proper documentation
 */
import type { CSSProperties } from 'react';

export const chatbotModalStyles: CSSProperties = {
  position: 'fixed',
  right: 32,
  bottom: 32,
  width: 400,
  maxWidth: '90vw',
  minWidth: 320,
  height: '65vh',
  minHeight: 400,
  maxHeight: 600,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 20px 64px rgba(99, 102, 241, 0.25)',
  borderRadius: '24px',
  zIndex: 9999, // High z-index to ensure it's above dashboard content
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: 'Inter, Arial, sans-serif',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  padding: 0,
  border: '2px solid #e2e8f0',
  touchAction: 'manipulation',
  // Ensure modal doesn't interfere with scrolling
  backdropFilter: 'blur(10px)',
};
