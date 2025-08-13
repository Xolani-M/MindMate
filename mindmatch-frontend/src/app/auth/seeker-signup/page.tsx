"use client";
import React, { useState } from 'react';
import { useAuthActions, useAuthState } from '@/providers/authProvider';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { GlassCard, GlowButton, PasswordStrength } from '@/components/MindMateComponents';
import { styles } from '@/components/styles';
import signupStyles from './signupstyles';
import { SignupError, SignupSuccess } from './SignupFeedback';
import { useRouter } from 'next/navigation';
import '../login/auth-animations.css';

interface SignupFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  displayName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  terms?: boolean;
}


const { Title, Text } = Typography;

const SignupPage: React.FC = () => {
  const [form] = Form.useForm();
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { registerSeeker, resetAuthState } = useAuthActions();
  const { isPending, isError, isSuccess, errorMessage } = useAuthState();
  const router = useRouter();

  React.useEffect(() => {
    if (isSuccess) {
      resetAuthState();
      router.push('/auth/login');
    }
  }, [isSuccess, router, resetAuthState]);
  return (
    <div
      style={{
        ...signupStyles.container as React.CSSProperties,
        background: `linear-gradient(135deg, ${styles.colors.background}, #f0f4ff)`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          ...signupStyles.orb as React.CSSProperties,
          background: `radial-gradient(circle, rgba(244, 114, 182, 0.15), transparent)`,
        }}
      />

  <GlassCard style={signupStyles.card as React.CSSProperties}>
          {/* Header with MindMate logo */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: styles.colors.primary,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center',
              marginBottom: '5px'
            }}>
              MindMate
            </div>
          </div>

          <div style={{ ...signupStyles.centerText as React.CSSProperties, marginBottom: '25px' }}>
            <Title level={2} style={{ ...signupStyles.title as React.CSSProperties, color: styles.colors.primary }}>
              Begin Your Journey
            </Title>
            <Text style={signupStyles.subtitle as React.CSSProperties}>
              Join thousands discovering their path to wellness
            </Text>
          </div>

          {/* Enhanced Error Display */}
          <SignupError error={isError ? errorMessage : undefined} />

          {/* Success/Loading Message */}
          <SignupSuccess visible={isPending} />

          <Form
            form={form}
            layout="vertical"
            size="large"
            onFinish={async (values: SignupFormValues) => {
              const payload = {
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password,
                displayName: values.displayName,
                emergencyContactName: values.emergencyContactName,
                emergencyContactPhone: values.emergencyContactPhone,
              };
              await registerSeeker(payload);
              // Redirect handled by useEffect when isSuccess is true
            }}
            onValuesChange={(changed: Partial<SignupFormValues>) => {
              if ('password' in changed && typeof changed.password === 'string') setPassword(changed.password);
            }}
          >
            <div style={signupStyles.formRow as React.CSSProperties}>
              <Form.Item name="name" rules={[{ required: true, message: 'First name required' }]} style={signupStyles.formItemHalf as React.CSSProperties}>
                <Input
                  prefix={<UserOutlined style={{ color: styles.colors.primary }} />}
                  placeholder="First name"
                  style={{
                    ...signupStyles.formInput as React.CSSProperties,
                    border: `2px solid ${styles.colors.healingGlow}`,
                  }}
                />
              </Form.Item>
              <Form.Item name="surname" rules={[{ required: true, message: 'Last name required' }]} style={signupStyles.formItemHalf as React.CSSProperties}>
                <Input
                  placeholder="Last name"
                  style={{
                    ...signupStyles.formInput as React.CSSProperties,
                    border: `2px solid ${styles.colors.healingGlow}`,
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item name="displayName" rules={[{ required: true, message: 'Display name required' }]}> 
              <Input
                placeholder="Display name"
                style={{
                  ...signupStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
              />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}> 
              <Input
                prefix={<MailOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Your email address"
                style={{
                  ...signupStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please create a password' }, { min: 8, message: 'Password must be at least 8 characters' }]}> 
              <Input.Password
                prefix={<LockOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Create a secure password"
                style={{
                  ...signupStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </Form.Item>
            {passwordFocused && password && <PasswordStrength password={password} />}
            <Form.Item name="emergencyContactName" rules={[{ required: true, message: 'Emergency contact name required' }]}> 
              <Input
                placeholder="Emergency contact name"
                style={{
                  ...signupStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
              />
            </Form.Item>
            <Form.Item name="emergencyContactPhone" rules={[{ required: true, message: 'Emergency contact phone required' }]}> 
              <Input
                placeholder="Emergency contact phone"
                style={{
                  ...signupStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
              />
            </Form.Item>
            <Form.Item name="terms" valuePropName="checked" rules={[{ validator: (_: unknown, value: boolean) => value ? Promise.resolve() : Promise.reject(new Error('Please accept our terms')) }]}> 
              <Checkbox style={signupStyles.checkbox as React.CSSProperties}>
                I agree to{' '}
                <button type="button" style={{ background: 'none', border: 'none', color: styles.colors.primary, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</button>{' '}and{' '}
                <button type="button" style={{ background: 'none', border: 'none', color: styles.colors.primary, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</button>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <GlowButton 
                htmlType="submit" 
                loading={isPending} 
                className={`auth-button ${isPending ? 'loading-button' : ''}`}
                style={{ 
                  width: '100%', 
                  marginBottom: '15px',
                  height: 'clamp(48px, 12vw, 56px)',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  background: styles.colors.gradientHover, // Gradient as default
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.2)',
                  transition: 'none',
                  color: isPending ? '#1f2937' : '#ffffff',
                }}
                disabled={isPending}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isPending) {
                    e.currentTarget.style.background = styles.colors.primary; // Solid color on hover only when not loading
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isPending) {
                    e.currentTarget.style.background = styles.colors.gradientHover; // Back to gradient only when not loading
                  }
                }}
              >
                {isPending ? (
                  <span className="loading-text">Creating your account...</span>
                ) : (
                  <span style={{ color: '#ffffff' }}>Start Your Wellness Journey</span>
                )}
              </GlowButton>
            </Form.Item>
          </Form>

          <Divider style={signupStyles.divider as React.CSSProperties}>or</Divider>

          <div style={signupStyles.centerText as React.CSSProperties}>
            <Text style={{ color: '#666' }}>Already a seeker? </Text>
            <Button
              type="link"
              onClick={() => router.push('/auth/login')}
              style={{ ...signupStyles.link as React.CSSProperties, color: styles.colors.primary }}
            >
              Sign In
            </Button>
          </div>

          <div style={signupStyles.backHome as React.CSSProperties}>
            <Button
              type="link"
              onClick={() => router.push('/')}
              style={{ color: '#999', padding: 0 }}
            >
              ← Back to home
            </Button>
          </div>
  </GlassCard>
    </div>
  );
};

export default SignupPage;

