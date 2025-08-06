"use client"
import React, { useState, useEffect } from 'react';
import { Button, Typography, Space } from 'antd';
import { SafetyOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons';
import { FloatingElement, GradientText, GlowButton } from '../MindMateComponents';
import { styles } from '../styles';
import landingPageStyles from './landingpagestyles';
const { Title, Paragraph } = Typography;

import { useRouter } from 'next/navigation';


interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      style={{
        ...(landingPageStyles.container as React.CSSProperties),
        background: `linear-gradient(135deg, ${styles.colors.primary} 0%, ${styles.colors.secondary} 100%)`,
      }}
    >
      {/* Animated Background Particles */}
      {particles.map(particle => (
        <FloatingElement key={particle.id} delay={particle.delay}>
          <div
            style={{
              ...(landingPageStyles.particle as React.CSSProperties),
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'rgba(255, 255, 255, 0.3)',
            }}
          />
        </FloatingElement>
      ))}

      <div style={landingPageStyles.main as React.CSSProperties}>
        <FloatingElement>
          <div style={landingPageStyles.emoji as React.CSSProperties}></div>
        </FloatingElement>
        <Title level={1} style={landingPageStyles.title as React.CSSProperties}>
          <GradientText style={landingPageStyles.gradientText as React.CSSProperties}>
            MindMate
          </GradientText>
        </Title>
        <Paragraph style={landingPageStyles.paragraph as React.CSSProperties}>
          Your companion in mental wellness. Private, supportive, and always here for you.
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={landingPageStyles.buttonRow as React.CSSProperties}>
            <FloatingElement delay={0.5}>
            <GlowButton 
              size="large"
              onClick={() => router.push('/auth/login')}
              style={{ minWidth: '200px' }}
            >
              Welcome Back, Seeker
            </GlowButton>
            </FloatingElement>
            
            <FloatingElement delay={1}>
              <Button
                size="large"
                onClick={() => router.push('/auth/seeker-signup')}
                style={{
                  minWidth: '200px',
                  height: '50px',
                  borderRadius: '15px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  transition: styles.transitions.smooth,
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.target as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                Begin Your Journey
              </Button>
            </FloatingElement>
          </div>

          <FloatingElement delay={1.5}>
            <div style={landingPageStyles.infoRow as React.CSSProperties}>
              <div style={landingPageStyles.infoItem as React.CSSProperties}>
                <SafetyOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                <div>Private & Secure</div>
              </div>
              <div style={landingPageStyles.infoItem as React.CSSProperties}>
                <HeartOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                <div>Always Supportive</div>
              </div>
              <div style={landingPageStyles.infoItem as React.CSSProperties}>
                <TeamOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                <div>Expert Guidance</div>
              </div>
            </div>
          </FloatingElement>
        </Space>
      </div>
    </div>
  );
};

export default LandingPage;
