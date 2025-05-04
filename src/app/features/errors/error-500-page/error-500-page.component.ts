
// Composant d'erreur 500 (error-500-page.component.ts)
import { Component } from '@angular/core';
import { ErrorBaseComponent } from '../error-base/error-base.component';

@Component({
  selector: 'app-error-500-page',
  standalone: true,
  imports: [ErrorBaseComponent],
  template: `
    <app-error-base
      errorCode="500"
      title="Erreur serveur"
      message="Une erreur inattendue s'est produite. Notre équipe technique a été notifiée et travaille à résoudre le problème."
      [showRetry]="true">
    </app-error-base>
  `
})
export class Error500PageComponent {}
