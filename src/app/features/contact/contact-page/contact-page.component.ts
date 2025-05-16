import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { ContactMapComponent } from '../components/contact-map/contact-map.component';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { SettingsService } from '../../../core/services/settings.service';
import { HotelSettings } from '../../../core/models';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    ContactMapComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent implements OnInit {
  hotelSettings: HotelSettings | null = null;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.hotelSettings$.subscribe(settings => {
      this.hotelSettings = settings;
    });
  }

  getPhoneLink(): string {
    if (!this.hotelSettings?.contact?.phone) return 'tel:+22527306450';
    // Nettoyer le numéro de téléphone pour l'URL
    return 'tel:' + this.hotelSettings.contact.phone.replace(/\s+/g, '');
  }

  getEmailLink(): string {
    return 'mailto:' + (this.hotelSettings?.contact?.email || 'contact@rexhotel.com');
  }
}