// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { User, UserRole } from '../models';

interface LoginResponse {
  user: User;
  token: string;
  expiresAt: number;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Clé pour le stockage du token dans localStorage
  private readonly TOKEN_KEY = 'rex_hotel_auth_token';
  private readonly USER_KEY = 'rex_hotel_user';
  
  // BehaviorSubject pour l'état de connexion et l'utilisateur courant
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  
  // Observables publics
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  // Données mockées pour les utilisateurs
  private users: User[] = [
    {
      id: '1',
      email: 'admin@rexhotel.com',
      password: 'admin123', // Dans une vraie application, les mots de passe seraient hashés
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '2',
      email: 'staff@rexhotel.com',
      password: 'staff123',
      firstName: 'Staff',
      lastName: 'User',
      role: UserRole.STAFF,
      isActive: true,
      phone: '+225 07 07 07 07 07',
      lastLogin: new Date(),
      createdAt: new Date('2023-02-15'),
      updatedAt: new Date('2023-02-15')
    },
    {
      id: '3',
      email: 'guest@example.com',
      password: 'guest123',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.GUEST,
      isActive: true,
      phone: '+225 05 05 05 05 05',
      lastLogin: new Date(),
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2023-03-20')
    }
  ];

  constructor() {
    // Vérifier si l'utilisateur est déjà connecté au démarrage
    this.checkAuth();
  }

  /**
   * Connexion d'un utilisateur
   */
  login(email: string, password: string): Observable<LoginResponse> {
    // Trouver l'utilisateur correspondant aux identifiants
    const user = this.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      return throwError(() => new Error('Identifiants incorrects'));
    }
    
    if (!user.isActive) {
      return throwError(() => new Error('Ce compte est désactivé'));
    }
    
    // Créer un token JWT simulé
    const token = this.generateToken(user);
    
    // Date d'expiration du token (24h)
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    
    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    
    // Cloner l'utilisateur sans le mot de passe pour le retour
    const userWithoutPassword = this.removePassword(user);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));
    
    // Mettre à jour les subjects
    this.currentUserSubject.next(userWithoutPassword);
    this.isLoggedInSubject.next(true);
    
    return of({
      user: userWithoutPassword,
      token,
      expiresAt
    }).pipe(delay(800)); // Simuler le délai réseau
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): Observable<boolean> {
    // Supprimer les données de localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Mettre à jour les subjects
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    
    return of(true).pipe(delay(300));
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterRequest): Observable<User> {
    // Vérifier si l'email est déjà utilisé
    const existingUser = this.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }
    
    // Créer un nouvel utilisateur
    const newUser: User = {
      id: `${Date.now()}`,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: UserRole.GUEST, // Par défaut, les nouveaux utilisateurs sont des invités
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ajouter à la liste des utilisateurs
    this.users.push(newUser);
    
    // Retourner l'utilisateur sans mot de passe
    return of(this.removePassword(newUser)).pipe(delay(800));
  }

  /**
   * Vérifie si l'utilisateur est connecté et a un token valide
   */
  checkAuth(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (!token || !userJson) {
      this.currentUserSubject.next(null);
      this.isLoggedInSubject.next(false);
      return false;
    }
    
    try {
      const user = JSON.parse(userJson) as User;
      
      // Vérifier si l'utilisateur existe toujours et est actif
      const currentUser = this.users.find(u => u.id === user.id && u.isActive);
      
      if (!currentUser) {
        this.logout();
        return false;
      }
      
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getUserProfile(): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    // Récupérer les données à jour de l'utilisateur
    const user = this.users.find(u => u.id === currentUser.id);
    
    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    
    return of(this.removePassword(user)).pipe(delay(300));
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  updateUserProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    // Interdire la mise à jour de certains champs
    const { id, role, password, isActive, createdAt, ...allowedUpdates } = updates;
    
    // Mettre à jour l'utilisateur
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...allowedUpdates,
      updatedAt: new Date()
    };
    
    const updatedUser = this.removePassword(this.users[userIndex]);
    
    // Mettre à jour le currentUserSubject
    this.currentUserSubject.next(updatedUser);
    
    // Mettre à jour le localStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    
    return of(updatedUser).pipe(delay(500));
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    if (this.users[userIndex].password !== currentPassword) {
      return throwError(() => new Error('Current password is incorrect'));
    }
    
    // Mettre à jour le mot de passe
    this.users[userIndex].password = newPassword;
    this.users[userIndex].updatedAt = new Date();
    
    return of(true).pipe(delay(500));
  }

  /**
   * Demande une réinitialisation de mot de passe
   */
  requestPasswordReset(email: string): Observable<boolean> {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Pour des raisons de sécurité, ne pas révéler si l'email existe ou non
      return of(true).pipe(delay(800));
    }
    
    // Dans une vraie application, envoyer un email avec un token/lien de réinitialisation
    
    return of(true).pipe(delay(800));
  }

  /**
   * Vérifie si l'utilisateur actuel a un rôle spécifique
   */
  hasRole(role: UserRole): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role === role : false;
  }

  /**
   * Vérifie si l'utilisateur actuel a l'un des rôles spécifiés
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? roles.includes(currentUser.role) : false;
  }

  /**
   * Récupère le token JWT actuel
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Vérifie si un token JWT valide est présent
   */
  private hasValidToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Récupère l'utilisateur stocké dans localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (!userJson) {
      return null;
    }
    
    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      return null;
    }
  }

  /**
   * Génère un token JWT simulé
   */
  private generateToken(user: User): string {
    // Format simplifié d'un token JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // Expire dans 24h
    }));
    const signature = btoa(`fake_signature_${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Supprime le mot de passe d'un objet utilisateur
   */
  private removePassword(user: User): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ----- Méthodes pour l'administration ----- //

  /**
   * Récupère tous les utilisateurs (admin uniquement)
   */
  getAllUsers(): Observable<User[]> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    // Retourner les utilisateurs sans les mots de passe
    const usersWithoutPasswords = this.users.map(user => this.removePassword(user));
    
    return of(usersWithoutPasswords).pipe(delay(500));
  }

  /**
   * Récupère un utilisateur par ID (admin uniquement)
   */
  getUserById(id: string): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    
    return of(this.removePassword(user)).pipe(delay(300));
  }

  /**
   * Crée un nouvel utilisateur (admin uniquement)
   */
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    // Vérifier si l'email est déjà utilisé
    const existingUser = this.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (existingUser) {
      return throwError(() => new Error('Email already in use'));
    }
    
    const newUser: User = {
      id: `${Date.now()}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    
    return of(this.removePassword(newUser)).pipe(delay(500));
  }

  /**
   * Met à jour un utilisateur (admin uniquement)
   */
  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    // Interdire la mise à jour de certains champs
    const { id: _, createdAt, ...allowedUpdates } = updates;
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...allowedUpdates,
      updatedAt: new Date()
    };
    
    return of(this.removePassword(this.users[userIndex])).pipe(delay(500));
  }

  /**
   * Désactive un compte utilisateur (admin uniquement)
   */
  deactivateUser(id: string): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    // Empêcher la désactivation de son propre compte
    if (id === currentUser.id) {
      return throwError(() => new Error('Cannot deactivate your own account'));
    }
    
    this.users[userIndex].isActive = false;
    this.users[userIndex].updatedAt = new Date();
    
    return of(true).pipe(delay(500));
  }

  /**
   * Réactive un compte utilisateur (admin uniquement)
   */
  activateUser(id: string): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    this.users[userIndex].isActive = true;
    this.users[userIndex].updatedAt = new Date();
    
    return of(true).pipe(delay(500));
  }

  /**
   * Change le rôle d'un utilisateur (admin uniquement)
   */
  changeUserRole(id: string, newRole: UserRole): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    // Empêcher la modification de son propre rôle
    if (id === currentUser.id) {
      return throwError(() => new Error('Cannot change your own role'));
    }
    
    this.users[userIndex].role = newRole;
    this.users[userIndex].updatedAt = new Date();
    
    return of(this.removePassword(this.users[userIndex])).pipe(delay(500));
  }

  /**
   * Réinitialise le mot de passe d'un utilisateur (admin uniquement)
   */
  resetUserPassword(id: string, newPassword: string): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return throwError(() => new Error('Unauthorized access'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    this.users[userIndex].password = newPassword;
    this.users[userIndex].updatedAt = new Date();
    
    return of(true).pipe(delay(500));
  }
}