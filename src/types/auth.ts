export interface AdminUser {
  pk: number;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
export interface GoogleLoginCredentials {
  code: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  user?: AdminUser;
}
