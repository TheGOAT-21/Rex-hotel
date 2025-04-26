import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() showThumbnails: boolean = true;
  
  currentIndex: number = 0;
  lightboxOpen: boolean = false;

  ngOnInit(): void {
    // Set default images if none provided
    if (this.images.length === 0) {
      this.images = [
        'assets/images/rooms/room1.jpg',
        'assets/images/rooms/room2.jpg',
        'assets/images/rooms/room3.jpg',
        'assets/images/rooms/room4.jpg'
      ];
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  setCurrentSlide(index: number): void {
    this.currentIndex = index;
  }

  openLightbox(): void {
    this.lightboxOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.classList.remove('overflow-hidden');
  }
}