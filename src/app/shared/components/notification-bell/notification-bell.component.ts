import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css'
})
export class NotificationBellComponent implements OnInit {
  unreadCount: number = 0;
  isDropdownOpen: boolean = false;
  notifications: any[] = [];
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    // Subscribe to unread count
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    
    // Subscribe to notifications
    this.notificationService.systemNotifications$.subscribe(notifications => {
      this.notifications = notifications.slice(0, 5); // Get only the 5 most recent
    });
    
    // Initial load of unread count
    this.notificationService.getUnreadCount().subscribe();
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  
  markAsRead(notificationId: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(notificationId).subscribe();
  }
  
  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
    this.closeDropdown();
  }
  
  getTimeAgo(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  }
}