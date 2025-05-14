import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-space-type-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-type-badge" [ngClass]="size">
      <span class="icon">{{ getIcon() }}</span>
      <span class="label">{{ type }}</span>
    </div>
  `,
  styles: [`
    .space-type-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      background-color: #f5f5f5;
      color: #333;
      font-size: 12px;
    }

    .icon {
      margin-right: 4px;
    }

    .small {
      font-size: 10px;
      padding: 2px 6px;
    }

    .large {
      font-size: 14px;
      padding: 6px 10px;
    }
  `]
})
export class RoomTypeBadgeComponent {
  @Input() type: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  getIcon(): string {
    const iconMap: { [key: string]: string } = {
      'office': '🏢',
      'meeting': '👥',
      'coworking': '💻',
      'event': '🎉',
      'private': '🔒',
      'shared': '👥',
      'virtual': '🌐'
    };
    return iconMap[this.type.toLowerCase()] || '📍';
  }
} 