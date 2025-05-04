
// Composant d'erreur maintenance (error-maintenance-page.component.ts)
import { Component } from '@angular/core';
import { ErrorBaseComponent } from '../error-base/error-base.component';

@Component({
  selector: 'app-error-maintenance-page',
  standalone: true,
  imports: [ErrorBaseComponent],
  template: `
    <app-error-base
      errorCode="503"
      title="Site en maintenance"
      message="Le REX HOTEL effectue actuellement une maintenance pour améliorer votre expérience. Nous serons bientôt de retour."
      [showRetry]="true">
    </app-error-base>
  `
})
export class ErrorMaintenancePageComponent {}