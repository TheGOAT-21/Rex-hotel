// Composant de base pour les erreurs (error-base.component.ts)
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-base',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#000000] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <!-- Code d'erreur -->
        <div class="text-[#E0C989] text-6xl font-bold mb-4">{{ errorCode }}</div>
        
        <!-- Titre de l'erreur -->
        <h1 class="text-3xl font-bold text-white mb-4 uppercase tracking-wider">{{ title }}</h1>
        
        <!-- Message d'erreur -->
        <p class="text-white mb-8">{{ message }}</p>
        
        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/" 
             class="inline-flex items-center justify-center px-6 py-3 border border-[#E0C989] text-base font-medium text-[#E0C989] hover:bg-[#E0C989] hover:text-[#000000] transition-colors duration-300 uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Retour à l'accueil
          </a>
          
          <button *ngIf="showRetry" 
                  (click)="retryLastAction()"
                  class="inline-flex items-center justify-center px-6 py-3 bg-[#E0C989] text-[#000000] font-medium hover:bg-opacity-80 transition-colors duration-300 uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Réessayer
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ErrorBaseComponent {
  @Input() errorCode: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() showRetry: boolean = false;

  retryLastAction(): void {
    window.location.reload();
  }
}
