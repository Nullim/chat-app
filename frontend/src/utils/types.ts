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

export interface ValidationError {
  error: { message: string };
  payload: PayloadError[]
}
