// Auth-related type definitions and schemas

/**
 * User profile structure
 */
export const UserSchema = {
  id: 'string',
  email: 'string',
  full_name: 'string',
  avatar_url: 'string',
  created_at: 'string',
  updated_at: 'string',
  email_verified: 'boolean'
};

/**
 * Auth state structure
 */
export const AuthStateSchema = {
  user: 'User | null',
  isLoading: 'boolean',
  error: 'string | null'
};

/**
 * Login form data
 */
export const LoginFormSchema = {
  email: 'string',
  password: 'string',
  rememberMe: 'boolean'
};

/**
 * Register form data
 */
export const RegisterFormSchema = {
  email: 'string',
  password: 'string',
  confirmPassword: 'string',
  fullName: 'string',
  terms: 'boolean'
};

/**
 * Password reset form data
 */
export const PasswordResetSchema = {
  email: 'string'
}; 