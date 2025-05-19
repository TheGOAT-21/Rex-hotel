import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isDisabled: boolean;
  isStartDay: boolean;
  isEndDay: boolean;
}

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css'
})
export class DatepickerComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() isRange: boolean = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() disabledDates: Date[] = [];
  @Input() disabledDateRanges: {start: Date, end: Date}[] = []; // Nouveau: plages de dates désactivées
  @Input() placeholder: string = 'Sélectionner une date';
  @Input() rangeStartLabel: string = 'Arrivée';
  @Input() rangeEndLabel: string = 'Départ';
  @Input() monthsToShow: number = 1;
  @Input() allowPastDates: boolean = false; // Nouveau: permettre/bloquer les dates passées
  @Input() highlightWeekends: boolean = true; // Nouveau: mettre en évidence les weekends
  
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() rangeSelected = new EventEmitter<{start: Date, end: Date | null}>();
  @Output() unavailableDateSelected = new EventEmitter<Date>(); // Nouveau: émis quand une date désactivée est sélectionnée
  
  // UI state
  isOpen: boolean = false;
  currentMonth: number = 0;
  currentYear: number = 0;
  calendarDays: CalendarDay[][] = [];
  weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  monthNames: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  // Make Math available to template
  protected readonly Math = Math;
  
  // Selection state
  tempStartDate: Date | null = null;
  tempEndDate: Date | null = null;
  rangeSelectionStep: 'start' | 'end' = 'start';
  
  // Formatted inputs
  startDateFormatted: string = '';
  endDateFormatted: string = '';
  
  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    
    // Définir minDate par défaut à aujourd'hui si non fourni et allowPastDates est false
    if (!this.minDate && !this.allowPastDates) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.minDate = today;
    }
    
    if (this.selectedDate) {
      this.currentMonth = this.selectedDate.getMonth();
      this.currentYear = this.selectedDate.getFullYear();
      this.startDateFormatted = this.formatDate(this.selectedDate);
    }
    
    if (this.isRange && this.selectedEndDate) {
      this.endDateFormatted = this.formatDate(this.selectedEndDate);
    }
    
    this.tempStartDate = this.selectedDate;
    this.tempEndDate = this.selectedEndDate;
    
    // Generate calendar
    this.generateCalendarDays();
  }
  
  // Toggle the calendar dropdown
  toggleCalendar(): void {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      // Reset temp dates when opening
      this.tempStartDate = this.selectedDate;
      this.tempEndDate = this.selectedEndDate;
      this.rangeSelectionStep = 'start';
      
      // Adjust view to show current selection
      if (this.selectedDate) {
        this.currentMonth = this.selectedDate.getMonth();
        this.currentYear = this.selectedDate.getFullYear();
        this.generateCalendarDays();
      }
    }
  }
  
  // Close the calendar dropdown
  closeCalendar(): void {
    this.isOpen = false;
  }
  
  // Navigate to previous month
  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendarDays();
  }
  
  // Navigate to next month
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendarDays();
  }
  
  // Generate the calendar grid
  generateCalendarDays(): void {
    this.calendarDays = [];
    
    // Generate calendar for each month to show
    for (let m = 0; m < this.monthsToShow; m++) {
      let monthData: CalendarDay[] = [];
      
      // Calculate month and year for this specific calendar
      let targetMonth = (this.currentMonth + m) % 12;
      let targetYear = this.currentYear + Math.floor((this.currentMonth + m) / 12);
      
      // Get first day of the month
      const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
      
      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
      let firstWeekday = firstDayOfMonth.getDay() - 1;
      if (firstWeekday < 0) firstWeekday = 6; // Adjust Sunday to be 6 (for Monday as first day of week)
      
      // Get the number of days in the month
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      
      // Get the number of days in previous month
      const daysInPreviousMonth = new Date(targetYear, targetMonth, 0).getDate();
      
      // Get today's date for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Add days from previous month
      for (let i = 0; i < firstWeekday; i++) {
        const prevMonthYear = targetMonth === 0 ? targetYear - 1 : targetYear;
        const prevMonth = targetMonth === 0 ? 11 : targetMonth - 1;
        const day = daysInPreviousMonth - firstWeekday + i + 1;
        
        const date = new Date(prevMonthYear, prevMonth, day);
        
        monthData.push({
          date,
          day,
          month: prevMonth,
          year: prevMonthYear,
          isCurrentMonth: false,
          isToday: this.isSameDay(date, today),
          isSelected: this.isDateSelected(date),
          isInRange: this.isDateInRange(date),
          isDisabled: this.isDateDisabled(date),
          isStartDay: this.isSameDay(date, this.tempStartDate),
          isEndDay: this.isSameDay(date, this.tempEndDate)
        });
      }
      
      // Add days of current month
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(targetYear, targetMonth, i);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        monthData.push({
          date,
          day: i,
          month: targetMonth,
          year: targetYear,
          isCurrentMonth: true,
          isToday: this.isSameDay(date, today),
          isSelected: this.isDateSelected(date),
          isInRange: this.isDateInRange(date),
          isDisabled: this.isDateDisabled(date),
          isStartDay: this.isSameDay(date, this.tempStartDate),
          isEndDay: this.isSameDay(date, this.tempEndDate)
        });
      }
      
      // Add days from next month to complete the grid
      const remainingDays = 42 - monthData.length; // 6 rows of 7 days for a complete grid
      
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthYear = targetMonth === 11 ? targetYear + 1 : targetYear;
        const nextMonth = (targetMonth + 1) % 12;
        
        const date = new Date(nextMonthYear, nextMonth, i);
        
        monthData.push({
          date,
          day: i,
          month: nextMonth,
          year: nextMonthYear,
          isCurrentMonth: false,
          isToday: this.isSameDay(date, today),
          isSelected: this.isDateSelected(date),
          isInRange: this.isDateInRange(date),
          isDisabled: this.isDateDisabled(date),
          isStartDay: this.isSameDay(date, this.tempStartDate),
          isEndDay: this.isSameDay(date, this.tempEndDate)
        });
      }
      
      this.calendarDays.push(monthData);
    }
  }
  
  // Handle day selection
  selectDay(day: CalendarDay): void {
    if (day.isDisabled) {
      this.unavailableDateSelected.emit(day.date);
      return;
    }
    
    if (this.isRange) {
      // Range selection mode
      if (this.rangeSelectionStep === 'start' || 
          (this.tempStartDate && day.date < this.tempStartDate)) {
        // Select start date
        this.tempStartDate = new Date(day.date);
        this.tempEndDate = null;
        this.rangeSelectionStep = 'end';
      } else {
        // Vérifier si la plage contient des dates désactivées
        if (this.tempStartDate && this.hasDisabledDatesInRange(this.tempStartDate, day.date)) {
          // Si des dates désactivées dans la plage, notifier et réinitialiser
          this.unavailableDateSelected.emit(day.date);
          return;
        }
        
        // Select end date
        this.tempEndDate = new Date(day.date);
        this.rangeSelectionStep = 'start';
        
        // Apply selection
        this.selectedDate = this.tempStartDate;
        this.selectedEndDate = this.tempEndDate;
        
        // Format dates for display
        this.startDateFormatted = this.formatDate(this.selectedDate);
        this.endDateFormatted = this.formatDate(this.selectedEndDate);
        
        // Emit event
        this.rangeSelected.emit({
          start: this.selectedDate!,
          end: this.selectedEndDate
        });
        
        // Close calendar
        this.closeCalendar();
      }
    } else {
      // Single date selection
      this.selectedDate = new Date(day.date);
      this.startDateFormatted = this.formatDate(this.selectedDate);
      
      // Emit event
      this.dateSelected.emit(this.selectedDate);
      
      // Close calendar
      this.closeCalendar();
    }
    
    // Update calendar
    this.generateCalendarDays();
  }
  
  // Nouveau: vérifier si une plage contient des dates désactivées
  hasDisabledDatesInRange(start: Date, end: Date): boolean {
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    // Vérifier dans les plages désactivées
    for (const range of this.disabledDateRanges) {
      const rangeStartTime = range.start.getTime();
      const rangeEndTime = range.end.getTime();
      
      // Si les plages se chevauchent
      if (!(endTime < rangeStartTime || startTime > rangeEndTime)) {
        return true;
      }
    }
    
    // Vérifier dans les dates individuelles désactivées
    for (const date of this.disabledDates) {
      const dateTime = date.getTime();
      if (dateTime >= startTime && dateTime <= endTime) {
        return true;
      }
    }
    
    return false;
  }
  
  // Clear the selection
  clearSelection(): void {
    this.selectedDate = null;
    this.selectedEndDate = null;
    this.tempStartDate = null;
    this.tempEndDate = null;
    this.startDateFormatted = '';
    this.endDateFormatted = '';
    this.rangeSelectionStep = 'start';
    
    // Emit events
    if (this.isRange) {
      this.rangeSelected.emit({ start: null!, end: null });
    } else {
      this.dateSelected.emit(null!);
    }
    
    // Update calendar
    this.generateCalendarDays();
  }
  
  // Check if a date is the same as another date (ignoring time)
  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  // Check if a date is selected
  isDateSelected(date: Date): boolean {
    if (this.isRange) {
      return this.isSameDay(date, this.tempStartDate) || this.isSameDay(date, this.tempEndDate);
    } else {
      return this.isSameDay(date, this.tempStartDate);
    }
  }
  
  // Check if a date is within the selected range
  isDateInRange(date: Date): boolean {
    if (!this.isRange || !this.tempStartDate || !this.tempEndDate) return false;
    
    return date > this.tempStartDate && date < this.tempEndDate;
  }
  
  // Check if a date is disabled
  isDateDisabled(date: Date): boolean {
    // Check min date
    if (this.minDate && date < this.minDate) return true;
    
    // Check max date
    if (this.maxDate && date > this.maxDate) return true;
    
    // Check disabled dates
    if (this.disabledDates.some(disabledDate => this.isSameDay(date, disabledDate))) {
      return true;
    }
    
    // Check disabled ranges
    for (const range of this.disabledDateRanges) {
      const dateTime = date.getTime();
      if (dateTime >= range.start.getTime() && dateTime <= range.end.getTime()) {
        return true;
      }
    }
    
    return false;
  }
  
  // Format a date to display string
  formatDate(date: Date | null): string {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
  
  // Get month name
  getMonthName(monthIndex: number): string {
    return this.monthNames[monthIndex];
  }
  
  getYearForMonth(monthIndex: number): number {
    return this.currentYear + Math.floor((this.currentMonth + monthIndex) / 12);
  }
  
  // Check if day should be marked as the range start
  isRangeStart(day: CalendarDay): boolean {
    return this.isRange && day.isStartDay;
  }
  
  // Check if day should be marked as the range end
  isRangeEnd(day: CalendarDay): boolean {
    return this.isRange && day.isEndDay;
  }
  
  // Nouveau: vérifier si c'est un weekend
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = dimanche, 6 = samedi
  }
}