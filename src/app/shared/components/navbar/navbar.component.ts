import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Interface pour définir la structure des éléments du menu
interface MenuItem {
  label: string;
  routerLink: string;
  exact?: boolean;
  isButton?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  
  // Définition des éléments du menu
  menuItems: MenuItem[] = [
    { label: 'Accueil', routerLink: '/', exact: true },
    { label: 'Chambres', routerLink: '/catalog' },
    { label: 'Services', routerLink: '/services' },
    { label: 'Contacts', routerLink: '/contact' }
  ];
  
  // Bouton de réservation séparé (traitement spécial)
  reservationButton: MenuItem = {
    label: 'Réserver',
    routerLink: '/auth/login',
    isButton: true
  };

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Si vous avez besoin d'initialiser quoi que ce soit
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}