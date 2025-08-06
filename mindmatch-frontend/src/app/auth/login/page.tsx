"use client";
import React, { useState } from 'react';
import { useAuthActions, useAuthState } from '@/providers/authProvider';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FloatingElement, GlassCard, GlowButton } from '@/components/MindMateComponents';
import { styles } from '@/components/styles';
import loginStyles from './loginstyles';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const passwordIconRender = (visible: boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />);

export default function LoginPage() {
  const { loginUser } = useAuthActions();
  const { isPending, isError, isSuccess } = useAuthState();
  const [form] = Form.useForm();
  const [passwordValue, setPasswordValue] = useState('');
  const router = useRouter();

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
              await loginUser({
                email: values.email,
                password: values.password,
              });
              // Redirect to dashboard after successful login
              router.push('/seeker/dashboard');
            }}
          >
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}> 
              <Input
                prefix={<MailOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Your email address"
                style={{
                  ...loginStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}> 
              <Input.Password
                prefix={<LockOutlined style={{ color: styles.colors.primary }} />}
                placeholder="Your password"
                iconRender={passwordIconRender}
                style={{
                  ...loginStyles.formInput as React.CSSProperties,
                  border: `2px solid ${styles.colors.healingGlow}`,
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                // Loader and feedback handled below
              />
            </Form.Item>
            <Form.Item>
              <Checkbox style={{ color: '#666' }}>Remember me</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="link" style={{ color: styles.colors.primary, padding: 0 }}>Forgot password?</Button>
            </Form.Item>
            <Form.Item>
              <GlowButton htmlType="submit" loading={isPending} style={{ width: '100%', marginBottom: '15px' }}>Continue Your Journey</GlowButton>
            </Form.Item>
            {isError && (
              <div style={{ color: 'red', marginBottom: '10px' }}>Login failed. Please try again.</div>
            )}
            {isSuccess && (
              <div style={{ color: 'green', marginBottom: '10px' }}>Login successful! Redirecting...</div>
            )}
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
