import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() showPageNumbers: boolean = true;
  @Input() showFirstLast: boolean = true;
  @Input() maxVisiblePages: number = 5;
  
  @Output() pageChange = new EventEmitter<number>();
  
  totalPages: number = 0;
  pages: number[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePagination();
  }
  
  calculatePagination(): void {
    // Calculate total pages
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Generate page numbers array
    if (this.showPageNumbers) {
      this.generatePageNumbers();
    }
  }
  
  generatePageNumbers(): void {
    this.pages = [];
    
    if (this.totalPages <= this.maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      // Calculate the range of pages to show
      let startPage: number;
      let endPage: number;
      
      // Always show current page in the middle if possible
      const halfMaxPages = Math.floor(this.maxVisiblePages / 2);
      
      if (this.currentPage <= halfMaxPages) {
        // Current page is near the start
        startPage = 1;
        endPage = this.maxVisiblePages;
      } else if (this.currentPage + halfMaxPages >= this.totalPages) {
        // Current page is near the end
        startPage = this.totalPages - this.maxVisiblePages + 1;
        endPage = this.totalPages;
      } else {
        // Current page is in the middle
        startPage = this.currentPage - halfMaxPages;
        endPage = this.currentPage + halfMaxPages;
      }
      
      // Adjust if we need to show ellipsis
      if (this.showFirstLast) {
        if (startPage > 1) {
          this.pages.push(1);
          if (startPage > 2) {
            this.pages.push(-1); // -1 represents ellipsis
          }
        }
        
        for (let i = startPage; i <= endPage; i++) {
          this.pages.push(i);
        }
        
        if (endPage < this.totalPages) {
          if (endPage < this.totalPages - 1) {
            this.pages.push(-1); // -1 represents ellipsis
          }
          this.pages.push(this.totalPages);
        }
      } else {
        for (let i = startPage; i <= endPage; i++) {
          this.pages.push(i);
        }
      }
    }
  }
  
  goToPage(page: number): void {
    if (page === this.currentPage || page < 1 || page > this.totalPages) {
      return;
    }
    
    this.pageChange.emit(page);
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.goToPage(1);
    }
  }
  
  goToLastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.goToPage(this.totalPages);
    }
  }
}