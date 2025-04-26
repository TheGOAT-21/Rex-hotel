// src/app/core/models/user.ts

export enum UserRole {
    CLIENT = 'client',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
  }
  
  export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country?: string;
    idCardUrl?: string; // URL de la pièce justificative
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UserLogin {
    email: string;
    password: string;
  }
  
  export interface UserRegistration extends Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'> {
    password: string;
    confirmPassword: string;
  }
  
  export interface UserProfile extends Omit<User, 'password' | 'role'> {
    reservations?: string[]; // IDs des réservations
  }