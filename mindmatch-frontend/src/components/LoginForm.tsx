/**
 * @fileoverview Enhanced Login Form Component
 * @description Provides a comprehensive login interface with validation, error handling, and responsive design
 * @author MINDMATE Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuthActions } from '@/providers/authProvider';

//#region Type Definitions

/**
 * Login form input field values
 */
interface ILoginFormInputs {
    /** User's email address or username */
    emailOrUsername: string;
    /** User's password */
    password: string;
}

/**
 * Login form validation errors
 */
interface ILoginFormErrors {
    /** Email/username field validation error message */
    emailOrUsername?: string;
    /** Password field validation error message */
    password?: string;
    /** General form validation error message */
    general?: string;
}

/**
 * Props for the LoginForm component
 */
interface ILoginFormProps {
    /** Callback function called after successful login */
    onLoginSuccess?: () => void;
    /** Callback function called when login fails */
    onLoginError?: (error: string) => void;
    /** Custom CSS class name for styling */
    className?: string;
    /** Whether to show the registration link */
    showRegistrationLink?: boolean;
}

/**
 * Login form submission state
 */
enum ELoginState {
    /** Form is ready for input */
    IDLE = 'idle',
    /** Form is being submitted */
    SUBMITTING = 'submitting',
    /** Login was successful */
    SUCCESS = 'success',
    /** Login failed with error */
    ERROR = 'error'
}


/**
 * Enhanced Login Form Component
 * 
 * Provides a comprehensive login interface with:
 * - Real-time form validation
 * - User-friendly error messages
 * - Responsive design
 * - Accessibility features
 * - Loading states
 * 
 * @param props - Component properties
 * @returns Rendered login form component
 */
export const LoginForm: React.FC<ILoginFormProps> = ({
    onLoginSuccess,
    onLoginError,
    className = '',
    showRegistrationLink = true
}) => {
    
    //#region Constants
    
    /**
     * Maximum number of failed login attempts before lockout
     */
    const MAX_FAILED_ATTEMPTS: number = 5;
    
    /**
     * Minimum password length for validation
     */
    const MIN_PASSWORD_LENGTH: number = 6;
    
    /**
     * Email validation regex pattern
     */
    const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    //#endregion Constants
    
    //#region State Variables
    
    /**
     * Current form input values
     */
    const [formInputs, setFormInputs] = useState<ILoginFormInputs>({
        emailOrUsername: '',
        password: ''
    });
    
    /**
     * Current form validation errors
     */
    const [formErrors, setFormErrors] = useState<ILoginFormErrors>({});
    
    /**
     * Current login submission state
     */
    const [loginState, setLoginState] = useState<ELoginState>(ELoginState.IDLE);
    
    /**
     * Whether to show password in plain text
     */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    /**
     * Number of failed login attempts
     */
    const [failedAttempts, setFailedAttempts] = useState<number>(0);
    
    //#endregion State Variables
    
    //#region Refs
    
    /**
     * Reference to the email/username input field
     */
    const emailInputRef = useRef<HTMLInputElement>(null);
    
    /**
     * Reference to the password input field
     */
    const passwordInputRef = useRef<HTMLInputElement>(null);
    
    //#endregion Refs
    
    //#region Hooks
    
    /**
     * Authentication actions hook
     */
    const { loginUser } = useAuthActions();
    
    //#endregion Hooks
    
    //#region Effect Hooks
    
    /**
     * Focus on email input when component mounts
     */
    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);
    
    /**
     * Clear errors when form inputs change
     */
    useEffect(() => {
        if (Object.keys(formErrors).length > 0) {
            setFormErrors({});
        }
    }, [formInputs, formErrors]);
    
    //#endregion Effect Hooks
    
    //#region Validation Methods
    
    /**
     * Validates the entire form
     * 
     * @returns Object containing validation error messages
     */
    const validateForm = (): ILoginFormErrors => {
        const errors: ILoginFormErrors = {};
        
        // Validate email/username
        if (!formInputs.emailOrUsername.trim()) {
            errors.emailOrUsername = 'Email or username is required';
        } else if (formInputs.emailOrUsername.includes('@') && !EMAIL_REGEX.test(formInputs.emailOrUsername)) {
            errors.emailOrUsername = 'Please enter a valid email address';
        }
        
        // Validate password
        if (!formInputs.password) {
            errors.password = 'Password is required';
        } else if (formInputs.password.length < MIN_PASSWORD_LENGTH) {
            errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
        }
        
        return errors;
    };
    
    //#endregion Validation Methods
    
    //#region Utility Methods
    
    /**
     * Converts error object to user-friendly message
     * 
     * @param error - Error object from login attempt
     * @returns User-friendly error message
     */
    const getErrorMessage = (error: unknown): string => {
        if (typeof error === 'string') {
            return error;
        }
        
        // Type guard for axios error response
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { error?: { message?: string } }; status?: number } };
            
            if (axiosError.response?.data?.error?.message) {
                return axiosError.response.data.error.message;
            }
            
            // Default error messages for common HTTP status codes
            if (axiosError.response?.status === 401) {
                return 'Invalid email/username or password. Please check your credentials and try again.';
            }
            
            if (axiosError.response?.status === 429) {
                return 'Too many login attempts. Please wait a few minutes before trying again.';
            }
            
            if (axiosError.response?.status && axiosError.response.status >= 500) {
                return 'Server is temporarily unavailable. Please try again later.';
            }
        }
        
        // Check for standard Error object
        if (error instanceof Error && error.message) {
            return error.message;
        }
        
        return 'Login failed. Please check your credentials and try again.';
    };
    
    /**
     * Gets CSS classes for form fields based on validation state
     * 
     * @param fieldName - Name of the form field
     * @returns CSS class string for the field
     */
    const getFieldClasses = (fieldName: keyof ILoginFormInputs): string => {
        const baseClasses: string = 'form-input';
        const hasError: boolean = Boolean(formErrors[fieldName]);
        const isValid: boolean = Boolean(formInputs[fieldName] && !hasError);
        
        return [
            baseClasses,
            hasError ? 'form-input--error' : '',
            isValid ? 'form-input--valid' : '',
            loginState === ELoginState.SUBMITTING ? 'form-input--disabled' : ''
        ].filter(Boolean).join(' ');
    };
    
    //#endregion Utility Methods
    
    //#region Event Handlers
    
    /**
     * Handles input field value changes
     * 
     * @param fieldName - Name of the form field being updated
     * @param value - New value for the field
     */
    const handleInputChange = (fieldName: keyof ILoginFormInputs, value: string): void => {
        setFormInputs(prevInputs => ({
            ...prevInputs,
            [fieldName]: value
        }));
    };
    
    /**
     * Handles form submission
     * 
     * @param event - Form submission event
     */
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        
        if (loginState === ELoginState.SUBMITTING) {
            return;
        }
        
        // Validate form before submission
        const validationErrors: ILoginFormErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }
        
        // Check if account is locked due to failed attempts
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            setFormErrors({
                general: 'Account temporarily locked due to multiple failed attempts. Please try again later.'
            });
            return;
        }
        
        setLoginState(ELoginState.SUBMITTING);
        
        try {
            await loginUser({
                email: formInputs.emailOrUsername,
                password: formInputs.password
            });
            setLoginState(ELoginState.SUCCESS);
            setFailedAttempts(0);
            
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (error) {
            setLoginState(ELoginState.ERROR);
            setFailedAttempts(prev => prev + 1);
            
            const errorMessage: string = getErrorMessage(error);
            setFormErrors({ general: errorMessage });
            
            if (onLoginError) {
                onLoginError(errorMessage);
            }
        }
    };
    
    /**
     * Toggles password visibility
     */
    const togglePasswordVisibility = (): void => {
        setShowPassword(prevShow => !prevShow);
    };
    
    //#endregion Event Handlers
    
    //#region Render Methods
    
    /**
     * Renders the form header with title and description
     * 
     * @returns JSX element for form header
     */
    const renderFormHeader = (): React.JSX.Element => {
        return (
            <div className="login-form__header">
                <h2 className="login-form__title">
                    Welcome Back
                </h2>
                <p className="login-form__description">
                    Sign in to your MINDMATE account to continue
                </p>
            </div>
        );
    };
    
    /**
     * Renders an input field with validation
     * 
     * @param fieldName - Name of the form field
     * @param label - Display label for the field
     * @param type - HTML input type
     * @param placeholder - Placeholder text
     * @param ref - React ref for the input element
     * @returns JSX element for input field
     */
    const renderInputField = (
        fieldName: keyof ILoginFormInputs,
        label: string,
        type: string,
        placeholder: string,
        ref?: React.RefObject<HTMLInputElement | null>
    ): React.JSX.Element => {
        const fieldError: string | undefined = formErrors[fieldName];
        const fieldValue: string = formInputs[fieldName];
        
        return (
            <div className="form-field">
                <label htmlFor={fieldName} className="form-field__label">
                    {label}
                </label>
                <div className="form-field__input-container">
                    <input
                        ref={ref}
                        id={fieldName}
                        name={fieldName}
                        type={type}
                        value={fieldValue}
                        placeholder={placeholder}
                        className={getFieldClasses(fieldName)}
                        disabled={loginState === ELoginState.SUBMITTING}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        aria-describedby={fieldError ? `${fieldName}-error` : undefined}
                        aria-invalid={Boolean(fieldError)}
                    />
                    {fieldName === 'password' && renderPasswordToggle()}
                </div>
                {fieldError && (
                    <div
                        id={`${fieldName}-error`}
                        className="form-field__error"
                        role="alert"
                    >
                        {fieldError}
                    </div>
                )}
            </div>
        );
    };
    
    /**
     * Renders the password visibility toggle button
     * 
     * @returns JSX element for password toggle
     */
    const renderPasswordToggle = (): React.JSX.Element => {
        return (
            <button
                type="button"
                className="form-field__password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loginState === ELoginState.SUBMITTING}
            >
                {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
        );
    };
    
    /**
     * Renders the submit button with loading state
     * 
     * @returns JSX element for submit button
     */
    const renderSubmitButton = (): React.JSX.Element => {
        const isSubmitting: boolean = loginState === ELoginState.SUBMITTING;
        
        return (
            <button
                type="submit"
                className={`form-submit-button ${isSubmitting ? 'form-submit-button--loading' : ''}`}
                disabled={isSubmitting}
                aria-describedby="submit-button-status"
            >
                {isSubmitting ? (
                    <>
                        <span className="loading-spinner" aria-hidden="true"></span>{' '}
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>
        );
    };
    
    /**
     * Renders the registration link
     * 
     * @returns JSX element for registration link
     */
    const renderRegistrationLink = (): React.JSX.Element | null => {
        if (!showRegistrationLink) {
            return null;
        }
        
        return (
            <div className="login-form__footer">
                <p className="login-form__footer-text">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="login-form__register-link">
                        Create one here
                    </a>
                </p>
            </div>
        );
    };
    
    //#endregion Render Methods
    
    //#region Main Render
    
    return (
        <div className={`login-form ${className}`}>
            {renderFormHeader()}
            
            <form onSubmit={handleFormSubmit} className="login-form__form" noValidate>
                {formErrors.general && (
                    <div className="form-error form-error--general" role="alert">
                        {formErrors.general}
                    </div>
                )}
                
                {renderInputField(
                    'emailOrUsername',
                    'Email or Username',
                    'text',
                    'Enter your email or username',
                    emailInputRef
                )}
                
                {renderInputField(
                    'password',
                    'Password',
                    showPassword ? 'text' : 'password',
                    'Enter your password',
                    passwordInputRef
                )}
                
                {renderSubmitButton()}
                
                {failedAttempts > 0 && failedAttempts < MAX_FAILED_ATTEMPTS && (
                    <div className="form-warning" role="alert">
                        {MAX_FAILED_ATTEMPTS - failedAttempts} attempts remaining
                    </div>
                )}
            </form>
            
            {renderRegistrationLink()}
        </div>
    );
    
    //#endregion Main Render
};
