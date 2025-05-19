import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faSearch,
  faBed,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-quick-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DatepickerComponent,
    FontAwesomeModule
  ],
  templateUrl: './quick-booking.component.html',
  styleUrls: ['./quick-booking.component.css']
})
export class QuickBookingComponent implements OnInit {
  @Input() isFloating: boolean = false;
  @Input() isCompact: boolean = false;
  @Input() showRoomType: boolean = false;
  @Input() showTitle: boolean = true;
  @Input() selectedDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() rangeStartLabel: string = 'Arrivée';
  @Input() rangeEndLabel: string = 'Départ';
  @Output() rangeSelected = new EventEmitter<{ start: Date, end: Date | null }>();
  @Output() search = new EventEmitter<any>();

  // Icons
  faCalendarAlt = faCalendarAlt;
  faUser = faUser;
  faSearch = faSearch;
  faBed = faBed;
  faChevronDown = faChevronDown;

  // Form values
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedGuests: number = 1;
  selectedRoomType: string = '';

  // UI state
  isExpanded: boolean = false;

  dateRange = { start: new Date(), end: null };

  // Room types options
  roomTypes = [
    { id: '', name: 'Toutes les chambres' },
    { id: 'standard', name: 'Chambre Standard' },
    { id: 'deluxe', name: 'Chambre Deluxe' },
    { id: 'suite', name: 'Suite' },
    { id: 'presidential', name: 'Suite Présidentielle' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialiser les dates par défaut (aujourd'hui et demain)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    this.startDate = tomorrow;
    this.endDate = dayAfter;
  }

  onDateRangeSelected(range: { start: Date | null, end: Date | null }): void {
    if (range.start) {
      this.startDate = range.start;
      this.endDate = range.end;
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  searchRooms(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    // Préparer les paramètres de recherche
    const searchParams = {
      startDate: this.startDate,
      endDate: this.endDate,
      guests: this.selectedGuests,
      roomType: this.selectedRoomType
    };

    // Émettre l'événement pour que le composant parent puisse le gérer s'il le souhaite
    this.search.emit(searchParams);

    // Naviguer vers la page des chambres avec les paramètres
    const queryParams: any = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      guests: this.selectedGuests
    };

    if (this.selectedRoomType) {
      queryParams.type = this.selectedRoomType;
    }

    this.router.navigate(['/rooms'], { queryParams });
  }
}