import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @Input() enableKeyboardNavigation: boolean = true; // Nouveau
  @Input() autoPlay: boolean = false; // Nouveau
  @Input() autoPlayInterval: number = 5000; // Nouveau
  @Input() zoomEnabled: boolean = true; // Nouveau
  @Input() touchEnabled: boolean = true; // Nouveau
  
  @ViewChild('lightboxImage') lightboxImageRef!: ElementRef; // Nouveau
  
  currentIndex: number = 0;
  lightboxOpen: boolean = false;
  zoomLevel: number = 1; // Nouveau
  zoomPosition = { x: 0, y: 0 }; // Nouveau
  isDragging: boolean = false; // Nouveau
  dragStart = { x: 0, y: 0 }; // Nouveau
  dragOffset = { x: 0, y: 0 }; // Nouveau
  
  captionText: string = ''; // Nouveau
  autoPlayTimer: any; // Nouveau

  ngOnInit(): void {
    // Set default images if none provided
    if (this.images.length === 0) {
      this.images = [
        'assets/images/rooms/chambre.jpeg',
        'assets/images/rooms/chambre.jepg',
        'assets/images/rooms/chambre.jepg',
        'assets/images/rooms/chambre.jpeg'
      ];
    }
    
    // Start autoplay if enabled
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  ngOnDestroy(): void {
    // Clear autoplay timer when component is destroyed
    this.stopAutoPlay();
    
    // Remove event listeners
    if (this.enableKeyboardNavigation) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetZoom(); // Nouveau
    this.updateCaption(); // Nouveau
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetZoom(); // Nouveau
    this.updateCaption(); // Nouveau
  }

  setCurrentSlide(index: number): void {
    this.currentIndex = index;
    this.resetZoom(); // Nouveau
    this.updateCaption(); // Nouveau
  }

  openLightbox(): void {
    this.lightboxOpen = true;
    document.body.classList.add('overflow-hidden');
    
    // Add event listeners for keyboard navigation
    if (this.enableKeyboardNavigation) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
    
    this.updateCaption(); // Nouveau
    
    // Stop autoplay when lightbox is opened
    this.stopAutoPlay();
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.classList.remove('overflow-hidden');
    this.resetZoom(); // Nouveau
    
    // Remove event listeners
    if (this.enableKeyboardNavigation) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
    
    // Restart autoplay if it was enabled
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  // Nouveau: Gestion des touches clavier
  handleKeyDown = (event: KeyboardEvent) => {
    // Seulement si le lightbox est ouvert
    if (!this.lightboxOpen) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        this.prevSlide();
        break;
      case 'ArrowRight':
        this.nextSlide();
        break;
      case 'Escape':
        this.closeLightbox();
        break;
      case '+':
        this.zoomIn();
        break;
      case '-':
        this.zoomOut();
        break;
      case '0':
        this.resetZoom();
        break;
    }
  }
  
  // Nouveau: Fonctions de zoom
  zoomIn(): void {
    if (!this.zoomEnabled) return;
    this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3); // Max zoom 3x
  }
  
  zoomOut(): void {
    if (!this.zoomEnabled) return;
    this.zoomLevel = Math.max(this.zoomLevel - 0.25, 1); // Min zoom 1x
    
    // Si on revient au zoom normal, réinitialiser la position
    if (this.zoomLevel === 1) {
      this.resetZoomPosition();
    }
  }
  
  resetZoom(): void {
    this.zoomLevel = 1;
    this.resetZoomPosition();
  }
  
  resetZoomPosition(): void {
    this.zoomPosition = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };
  }
  
  // Nouveau: Gestion du drag pour déplacer l'image zoomée
  onMouseDown(event: MouseEvent): void {
    if (!this.zoomEnabled || this.zoomLevel <= 1) return;
    
    this.isDragging = true;
    this.dragStart = { x: event.clientX, y: event.clientY };
    
    event.preventDefault();
  }
  
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    
    const deltaX = event.clientX - this.dragStart.x;
    const deltaY = event.clientY - this.dragStart.y;
    
    this.dragOffset = { 
      x: this.zoomPosition.x + deltaX, 
      y: this.zoomPosition.y + deltaY 
    };
    
    // Appliquer la transformation au style de l'image
    if (this.lightboxImageRef && this.lightboxImageRef.nativeElement) {
      this.lightboxImageRef.nativeElement.style.transform = 
        `scale(${this.zoomLevel}) translate(${this.dragOffset.x / this.zoomLevel}px, ${this.dragOffset.y / this.zoomLevel}px)`;
    }
  }
  
  onMouseUp(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.zoomPosition = { ...this.dragOffset };
  }
  
  // Nouveau: Gestion du tactile pour smartphones/tablettes
  onTouchStart(event: TouchEvent): void {
    if (!this.touchEnabled || !this.zoomEnabled || this.zoomLevel <= 1) return;
    
    this.isDragging = true;
    this.dragStart = { 
      x: event.touches[0].clientX, 
      y: event.touches[0].clientY 
    };
    
    event.preventDefault();
  }
  
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    
    const deltaX = event.touches[0].clientX - this.dragStart.x;
    const deltaY = event.touches[0].clientY - this.dragStart.y;
    
    this.dragOffset = { 
      x: this.zoomPosition.x + deltaX, 
      y: this.zoomPosition.y + deltaY 
    };
    
    // Appliquer la transformation au style de l'image
    if (this.lightboxImageRef && this.lightboxImageRef.nativeElement) {
      this.lightboxImageRef.nativeElement.style.transform = 
        `scale(${this.zoomLevel}) translate(${this.dragOffset.x / this.zoomLevel}px, ${this.dragOffset.y / this.zoomLevel}px)`;
    }
    
    event.preventDefault();
  }
  
  onTouchEnd(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.zoomPosition = { ...this.dragOffset };
  }
  
  // Nouveau: Légende de l'image
  updateCaption(): void {
    // Extraire le nom de fichier de l'URL actuelle
    const currentImage = this.images[this.currentIndex];
    const filename = currentImage.split('/').pop() || '';
    
    // Formater comme légende (peut être amélioré avec des métadonnées réelles)
    this.captionText = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  }
  
  // Nouveau: Fonctions d'autoplay
  startAutoPlay(): void {
    this.stopAutoPlay(); // Clear any existing timer
    
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);
  }
  
  stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
  
  toggleAutoPlay(): void {
    if (this.autoPlayTimer) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }
}