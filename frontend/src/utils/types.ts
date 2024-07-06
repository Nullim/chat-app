export interface User {
  id: string;
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Registry extends Credentials {
  email: string;
}

export interface PayloadError {
  message: string;
  type: string;
}

export interface PasswordConfirmation {
  password: string;
  confirmPassword: string;
}

export interface ValidationError {
  error: { message: string };
  payload: PayloadError[]
}

export type Status = 'Idle' | 'Pending' | 'Success' | 'Error'
