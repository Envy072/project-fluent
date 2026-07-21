// Shared contract for the Identity & Access Service's HTTP surface (M18),
// consumed by both apps/api (the source of truth) and apps/web (via
// Auth.js's Credentials provider). Types only — no runtime code, no
// business logic beyond this sprint's Identity & Access scope.

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}
