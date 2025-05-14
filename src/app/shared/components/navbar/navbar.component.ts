import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  
  // Définition des éléments du menu - UPDATED
  menuItems: MenuItem[] = [
    { label: 'Accueil', routerLink: '/', exact: true },
    { label: 'Chambres', routerLink: '/rooms' },
    { label: 'Services', routerLink: '/services' },
    { label: 'Contact', routerLink: '/contact' }
  ];
  
  // Bouton de réservation séparé - UPDATED
  reservationButton: MenuItem = {
    label: 'Réserver',
    routerLink: '/reservation',
    isButton: true
  };

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