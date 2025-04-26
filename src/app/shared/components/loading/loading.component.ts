import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type: 'spinner' | 'dots' | 'bar' = 'spinner';
  @Input() fullScreen: boolean = false;
  @Input() overlay: boolean = false;
  @Input() message: string = 'Chargement en cours...';
  @Input() showMessage: boolean = true;
}