// src/app/core/models/user.model.ts
export enum UserRole {
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    GUEST = 'GUEST'
  }
  
  export interface User {
    id?: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive?: boolean;
    avatar?: string;
    phone?: string;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }