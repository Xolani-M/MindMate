import React from 'react';
import LandingPage from '@/components/LandingPage';
import { styles } from '@/components/styles';
import WithAuth from '@/hoc/WithAuth';


const MindMateAuth: React.FC = () => {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <LandingPage />
      {/* Global Styles */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .ant-input:hover, .ant-input:focus {
          border-color: ${styles.colors.primary} !important;
          box-shadow: 0 0 0 2px ${styles.colors.healingGlow} !important;
        }
      `}</style>
    </div>
  );
};

export default WithAuth(MindMateAuth);
