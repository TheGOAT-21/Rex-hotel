
// Composant d'erreur 404 (error-404-page.component.ts)
import { Component } from '@angular/core';
import { ErrorBaseComponent } from '../error-base/error-base.component';

@Component({
  selector: 'app-error-404-page',
  standalone: true,
  imports: [ErrorBaseComponent],
  template: `
    <app-error-base
      errorCode="404"
      title="Page non trouvée"
      message="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
      [showRetry]="false">
    </app-error-base>
  `
})
export class Error404PageComponent {}
