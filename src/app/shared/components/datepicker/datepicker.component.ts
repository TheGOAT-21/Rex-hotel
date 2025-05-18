import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, HostListener } from '@angular/core';
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

interface QuickRange {
  label: string;
  value: string;
  start: () => Date;
  end: () => Date;
}

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() isRange: boolean = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() disabledDates: Date[] = [];
  @Input() disabledDateRanges: {start: Date, end: Date}[] = [];
  @Input() placeholder: string = 'Sélectionner une date';
  @Input() rangeStartLabel: string = 'Arrivée';
  @Input() rangeEndLabel: string = 'Départ';
  @Input() monthsToShow: number = 1;
  @Input() allowPastDates: boolean = false;
  @Input() highlightWeekends: boolean = true;
  @Input() showQuickRanges: boolean = true;
  @Input() locale: string = 'fr-FR';
  
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() rangeSelected = new EventEmitter<{start: Date, end: Date | null}>();
  @Output() unavailableDateSelected = new EventEmitter<Date>();
  
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
  
  // Quick ranges for date selection
  quickRanges: QuickRange[] = [
    { 
      label: 'Aujourd\'hui',
      value: 'today',
      start: () => new Date(),
      end: () => new Date()
    },
    {
      label: 'Demain',
      value: 'tomorrow',
      start: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
      end: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      }
    },
    {
      label: 'Cette semaine',
      value: 'this-week',
      start: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
      },
      end: () => {
        const start = this.quickRanges.find(r => r.value === 'this-week')?.start() as Date;
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return end;
      }
    },
    {
      label: 'Week-end',
      value: 'weekend',
      start: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + diff);
        return saturday;
      },
      end: () => {
        const start = this.quickRanges.find(r => r.value === 'weekend')?.start() as Date;
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        return end;
      }
    },
    {
      label: 'Semaine prochaine',
      value: 'next-week',
      start: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + 7;
        return new Date(today.setDate(diff));
      },
      end: () => {
        const start = this.quickRanges.find(r => r.value === 'next-week')?.start() as Date;
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return end;
      }
    },
    {
      label: '2 nuits',
      value: '2-nights',
      start: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
      end: () => {
        const start = this.quickRanges.find(r => r.value === '2-nights')?.start() as Date;
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        return end;
      }
    }
  ];
  
  // Make Math available to template
  protected readonly Math = Math;
  
  // Selection state
  tempStartDate: Date | null = null;
  tempEndDate: Date | null = null;
  rangeSelectionStep: 'start' | 'end' = 'start';
  activeQuickRange: string | null = null;
  
  // Formatted inputs
  startDateFormatted: string = '';
  endDateFormatted: string = '';
  
  // Keyboard navigation
  focusedDay: Date | null = null;
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isOpen) return;
    
    switch (event.key) {
      case 'Escape':
        this.closeCalendar();
        break;
      case 'Enter':
        if (this.focusedDay) {
          const day = this.calendarDays[0].find(d => this.isSameDay(d.date, this.focusedDay));
          if (day) this.selectDay(day);
        }
        break;
      case 'ArrowLeft':
        this.navigateWithKeyboard(-1, 0);
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.navigateWithKeyboard(1, 0);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.navigateWithKeyboard(0, -1);
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.navigateWithKeyboard(0, 1);
        event.preventDefault();
        break;
    }
  }
  
  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    
    // Set default minDate to today if not provided and allowPastDates is false
    if (!this.minDate && !this.allowPastDates) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.minDate = today;
    }
    
    if (this.selectedDate) {
      this.currentMonth = this.selectedDate.getMonth();
      this.currentYear = this.selectedDate.getFullYear();
      this.startDateFormatted = this.formatDate(this.selectedDate);
      this.focusedDay = new Date(this.selectedDate);
    } else {
      this.focusedDay = new Date();
    }
    
    if (this.isRange && this.selectedEndDate) {
      this.endDateFormatted = this.formatDate(this.selectedEndDate);
    }
    
    this.tempStartDate = this.selectedDate;
    this.tempEndDate = this.selectedEndDate;
    
    // Update quick range status
    this.updateActiveQuickRange();
    
    // Generate calendar
    this.generateCalendarDays();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['selectedDate'] && !changes['selectedDate'].firstChange) || 
        (changes['selectedEndDate'] && !changes['selectedEndDate'].firstChange)) {
      this.updateFormattedDates();
      this.tempStartDate = this.selectedDate;
      this.tempEndDate = this.selectedEndDate;
      this.updateActiveQuickRange();
      this.generateCalendarDays();
    }
    
    if ((changes['disabledDates'] && !changes['disabledDates'].firstChange) || 
        (changes['disabledDateRanges'] && !changes['disabledDateRanges'].firstChange)) {
      this.generateCalendarDays();
    }
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
        this.focusedDay = new Date(this.selectedDate);
        this.generateCalendarDays();
      }
    }
  }
  
  // Close the calendar dropdown
  closeCalendar(): void {
    this.isOpen = false;
    
    // Reset temp dates if no selection was confirmed
    if (!this.isSameDay(this.tempStartDate, this.selectedDate) || 
        !this.isSameDay(this.tempEndDate, this.selectedEndDate)) {
      this.tempStartDate = this.selectedDate;
      this.tempEndDate = this.selectedEndDate;
    }
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
        this.focusedDay = new Date(day.date);
      } else {
        // Check if range contains disabled dates
        if (this.tempStartDate && this.hasDisabledDatesInRange(this.tempStartDate, day.date)) {
          this.unavailableDateSelected.emit(day.date);
          return;
        }
        
        // Select end date
        this.tempEndDate = new Date(day.date);
        this.rangeSelectionStep = 'start';
        this.focusedDay = new Date(day.date);
        
        // Apply selection
        this.selectedDate = this.tempStartDate;
        this.selectedEndDate = this.tempEndDate;
        
        // Format dates for display
        this.startDateFormatted = this.formatDate(this.selectedDate);
        this.endDateFormatted = this.formatDate(this.selectedEndDate);
        
        // Check if a quick range matches this selection
        this.updateActiveQuickRange();
        
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
      this.focusedDay = new Date(day.date);
      
      // Emit event
      this.dateSelected.emit(this.selectedDate);
      
      // Close calendar
      this.closeCalendar();
    }
    
    // Update calendar
    this.generateCalendarDays();
  }
  
  // Check if range contains disabled dates
  hasDisabledDatesInRange(start: Date, end: Date): boolean {
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    // Check against disabled date ranges
    for (const range of this.disabledDateRanges) {
      const rangeStartTime = range.start.getTime();
      const rangeEndTime = range.end.getTime();
      
      // Check if ranges overlap
      if (!(endTime < rangeStartTime || startTime > rangeEndTime)) {
        return true;
      }
    }
    
    // Check against individual disabled dates
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
    this.activeQuickRange = null;
    
    // Emit events
    if (this.isRange) {
      this.rangeSelected.emit({ start: null!, end: null });
    } else {
      this.dateSelected.emit(null!);
    }
    
    // Update calendar
    this.generateCalendarDays();
  }
  
  // Select a predefined date range
  selectQuickRange(rangeKey: string): void {
    const range = this.quickRanges.find(r => r.value === rangeKey);
    
    if (!range) return;
    
    const start = range.start();
    const end = range.end();
    
    // Check if this range contains disabled dates
    if (this.hasDisabledDatesInRange(start, end)) {
      this.unavailableDateSelected.emit(start);
      return;
    }
    
    this.tempStartDate = start;
    this.tempEndDate = end;
    this.selectedDate = start;
    this.selectedEndDate = end;
    this.startDateFormatted = this.formatDate(start);
    this.endDateFormatted = this.formatDate(end);
    this.activeQuickRange = rangeKey;
    
    // Adjust view to show selected range
    this.currentMonth = start.getMonth();
    this.currentYear = start.getFullYear();
    this.generateCalendarDays();
    
    // Emit event
    this.rangeSelected.emit({
      start: this.selectedDate,
      end: this.selectedEndDate
    });
    
    // Close calendar if it's a direct selection
    this.closeCalendar();
  }
  
  // Check if a quick range is active
  isActiveQuickRange(rangeKey: string): boolean {
    return this.activeQuickRange === rangeKey;
  }
  
  // Update active quick range based on current selection
  updateActiveQuickRange(): void {
    if (!this.isRange || !this.selectedDate || !this.selectedEndDate) {
      this.activeQuickRange = null;
      return;
    }
    
    // Find a range that matches current selection
    for (const range of this.quickRanges) {
      const start = range.start();
      const end = range.end();
      
      if (this.isSameDay(start, this.selectedDate) && this.isSameDay(end, this.selectedEndDate)) {
        this.activeQuickRange = range.value;
        return;
      }
    }
    
    this.activeQuickRange = null;
  }
  
  // Update formatted dates based on selection
  updateFormattedDates(): void {
    this.startDateFormatted = this.formatDate(this.selectedDate);
    
    if (this.isRange) {
      this.endDateFormatted = this.formatDate(this.selectedEndDate);
    }
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
    
    try {
      return new Intl.DateTimeFormat(this.locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      // Fallback format
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    }
  }
  
  // Format a date for ARIA label
  formatDateForAriaLabel(date: Date): string {
    if (!date) return '';
    
    try {
      return new Intl.DateTimeFormat(this.locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      // Fallback
      return this.formatDate(date);
    }
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
  
  // Check if a date is a weekend
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = dimanche, 6 = samedi
  }
  
  // Navigate calendar with keyboard
  navigateWithKeyboard(xDiff: number, yDiff: number): void {
    if (!this.focusedDay) {
      this.focusedDay = new Date();
      return;
    }
    
    const newDate = new Date(this.focusedDay);
    newDate.setDate(newDate.getDate() + xDiff + (yDiff * 7));
    
    // Check if we need to change month view
    if (newDate.getMonth() !== this.currentMonth) {
      this.currentMonth = newDate.getMonth();
      this.currentYear = newDate.getFullYear();
      this.generateCalendarDays();
    }
    
    this.focusedDay = newDate;
  }
  
  // Get text for duration display
  getDurationText(): string {
    if (!this.tempStartDate || !this.tempEndDate) return '';
    
    const startTime = this.tempStartDate.getTime();
    const endTime = this.tempEndDate.getTime();
    const diff = Math.abs(endTime - startTime);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Même jour';
    if (days === 1) return '1 nuit';
    
    return `${days} nuits`;
  }
}