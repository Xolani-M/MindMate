import React, { useState } from 'react';
import { useAuthActions, useAuthState } from '@/providers/authProvider';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';

import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

import { FloatingElement, GlassCard, GlowButton, PasswordStrength } from '@/components/MindMateComponents';
import { styles } from '@/components/styles';
import signupStyles from './signupstyles';
import LandingPage from '@/components/LandingPage';

import type { FormInstance } from 'antd/es/form/Form';

interface SignupPageProps {
  setCurrentView: (view: string) => void;
  form: FormInstance;
  password: string;
  setPassword: (pwd: string) => void;
}

const { Title, Text } = Typography;


const SignupPage: React.FC<SignupPageProps> = ({ setCurrentView, form, password, setPassword }) => {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { registerSeeker } = useAuthActions();
  const { isPending, isError, isSuccess } = useAuthState();
  const [showLanding, setShowLanding] = useState(false);

if (showLanding) {
    return <LandingPage />;
  }

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

      <FloatingElement>
        <GlassCard style={signupStyles.card as React.CSSProperties}>
          <div style={{ ...signupStyles.centerText as React.CSSProperties, marginBottom: '25px' }}>
            <Title level={2} style={{ ...signupStyles.title as React.CSSProperties, color: styles.colors.primary }}>
              Begin Your Journey
            </Title>
            <Text style={signupStyles.subtitle as React.CSSProperties}>
              Join our community of seekers!
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            size="large"
            onFinish={async (values) => {
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
            }}
        onValuesChange={(changed) => {
            if ('password' in changed) setPassword(changed.password);
            // Removed unused variable 'all'
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
              <GlowButton htmlType="submit" loading={isPending} style={{ width: '100%', marginBottom: '15px' }}>Start Your Wellness Journey</GlowButton>
            </Form.Item>
            {isError && (
              <div style={{ color: 'red', marginBottom: '10px' }}>Signup failed. Please try again.</div>
            )}
            {isSuccess && (
              <div style={{ color: 'green', marginBottom: '10px' }}>Signup successful! Redirecting...</div>
            )}
          </Form>

          <Divider style={signupStyles.divider as React.CSSProperties}>or</Divider>

          <div style={signupStyles.centerText as React.CSSProperties}>
            <Text style={{ color: '#666' }}>Already a seeker? </Text>
            <Button
              type="link"
              onClick={() => setCurrentView('login')}
              style={{ ...signupStyles.link as React.CSSProperties, color: styles.colors.primary }}
            >
              Sign In
            </Button>
          </div>

          <div style={signupStyles.backHome as React.CSSProperties}>
            <Button
              type="link"
              onClick={() => setShowLanding(true)}
              style={{ color: '#999', padding: 0 }}
            >
              ← Back to home
            </Button>
          </div>
        </GlassCard>
      </FloatingElement>
    </div>
  );
};

export default SignupPage;
