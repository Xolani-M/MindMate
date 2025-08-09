"use client";
import React, { useState } from 'react';
import { useAuthActions, useAuthState } from '@/providers/authProvider';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FloatingElement, GlassCard, GlowButton } from '@/components/MindMateComponents';
import { styles } from '@/components/styles';
import loginStyles from './loginstyles';
import { LoginError, LoginSuccess } from './LoginFeedback';
import { useRouter } from 'next/navigation';
import './login.module.css';

const { Title, Text } = Typography;

const passwordIconRender = (visible: boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />);

export default function LoginPage() {
  const { loginUser, resetAuthState } = useAuthActions();
  const { isPending, isError, isSuccess, errorMessage } = useAuthState();
  const [form] = Form.useForm();
  const [passwordValue, setPasswordValue] = useState('');
  const router = useRouter();

  // Clear any previous errors when component mounts
  React.useEffect(() => {
    resetAuthState();
  }, [resetAuthState]);

  return (
    <div
      style={{
        ...loginStyles.container as React.CSSProperties,
        background: `linear-gradient(135deg, ${styles.colors.background}, #f0f4ff)`,
      }}
    >
      {/* Background Orbs */}
      <div
        style={{
          ...loginStyles.orbTop as React.CSSProperties,
          background: `radial-gradient(circle, ${styles.colors.healingGlow}, transparent)`,
        }}
      />
      <div
        style={{
          ...loginStyles.orbBottom as React.CSSProperties,
          background: `radial-gradient(circle, rgba(20, 184, 166, 0.15), transparent)`,
        }}
      />

      <FloatingElement>
        <GlassCard style={loginStyles.card as React.CSSProperties}>
          <div style={{ ...loginStyles.centerText as React.CSSProperties, marginBottom: '25px' }}>
            <Title level={2} style={{ ...loginStyles.title as React.CSSProperties, color: styles.colors.primary }}>
              Sign In to MindMate
            </Title>
            <Text style={loginStyles.subtitle as React.CSSProperties}>
              Access your account and continue your wellness journey.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            size="large"
            onFinish={async (values) => {
              if (isPending) return; // Prevent multiple submissions
              
              try {
                await loginUser({
                  email: values.email?.trim(),
                  password: values.password,
                });
                // Navigation is handled in the auth provider after successful login
              } catch (error) {
                console.error('Login submission error:', error);
                // Error handling is managed by the auth provider
              }
            }}
            onFinishFailed={(errorInfo) => {
              console.log('Form validation failed:', errorInfo);
            }}
            disabled={isPending}
          >
            <Form.Item 
              name="email" 
              rules={[
                { required: true, message: 'Please enter your email address' }, 
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
              hasFeedback
            > 
              <Input
                prefix={<MailOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Enter your email address"
                style={{
                  ...loginStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
                autoComplete="email"
                size="large"
                disabled={isPending}
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
              hasFeedback
            > 
              <Input.Password
                prefix={<LockOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Enter your password"
                iconRender={passwordIconRender}
                style={{
                  ...loginStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                autoComplete="current-password"
                size="large"
                disabled={isPending}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: '16px' }}>
              <div style={loginStyles.rememberRow as React.CSSProperties}>
                <Checkbox style={{ color: '#666', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>
                  Remember me
                </Checkbox>
                <Button 
                  type="link" 
                  style={{ 
                    ...loginStyles.link as React.CSSProperties, 
                    color: styles.colors.primary 
                  }}
                  disabled={isPending}
                >
                  Forgot password?
                </Button>
              </div>
            </Form.Item>
            <Form.Item>
              <GlowButton 
                htmlType="submit" 
                loading={isPending} 
                style={{ width: '100%', marginBottom: '15px' }}
                disabled={isPending}
              >
                {isPending ? 'Signing you in...' : 'Continue Your Journey'}
              </GlowButton>
            </Form.Item>

            {/* Enhanced Error Display */}
            <LoginError error={isError ? errorMessage : undefined} />

            {/* Success Message */}
            <LoginSuccess visible={isSuccess} />
          </Form>

          <Divider style={loginStyles.divider as React.CSSProperties}>or</Divider>

          <div style={loginStyles.centerText as React.CSSProperties}>
            <Text style={{ color: '#666' }}>New to MindMate? </Text>
            <Button
              type="link"
              onClick={() => router.push('/auth/seeker-signup')}
              style={{ ...loginStyles.link as React.CSSProperties, color: styles.colors.primary }}
            >
              Begin your wellness journey
            </Button>
          </div>

          <div style={loginStyles.backHome as React.CSSProperties}>
            <Button
              type="link"
              onClick={() => router.push('/')}
              style={{ color: '#999', padding: 0 }}
            >
              ← Back to home
            </Button>
          </div>
        </GlassCard>
      </FloatingElement>
    </div>
  );
}
