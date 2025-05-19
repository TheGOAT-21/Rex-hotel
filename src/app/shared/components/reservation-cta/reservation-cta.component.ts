import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservation-cta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './reservation-cta.component.html',
  styleUrl: './reservation-cta.component.css'
})
export class ReservationCtaComponent {
  @Input() title: string = 'Réservez dès maintenant';
  @Input() description: string = 'Profitez de tous nos services haut de gamme lors de votre prochain séjour au REX HOTEL. Réservez en ligne pour bénéficier de nos meilleurs tarifs.';
  @Input() buttonText: string = 'Réserver maintenant';
  @Input() buttonLink: string = '/reservation';
}