import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GuestInfo } from '../../../../core/models/guest-info.model';

@Component({
  selector: 'app-guest-info-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './guest-info-form.component.html',
  styleUrl: './guest-info-form.component.css'
})
export class GuestInfoFormComponent implements OnInit {
  @Input() initialData: Partial<GuestInfo> | null = null;
  @Input() submitButtonText: string = 'Continuer';
  @Input() showCancelButton: boolean = false;
  @Input() cancelButtonText: string = 'Annuler';
  
  @Output() formSubmit = new EventEmitter<GuestInfo>();
  @Output() formCancel = new EventEmitter<void>();
  
  guestInfoForm!: FormGroup;
  
  guestTitles: {value: string, label: string}[] = [
    {value: 'mr', label: 'M.'},
    {value: 'mrs', label: 'Mme'},
    {value: 'ms', label: 'Mlle'},
    {value: 'dr', label: 'Dr'}
  ];
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.initForm();
    
    if (this.initialData) {
      this.guestInfoForm.patchValue(this.initialData);
    }
  }
  
  initForm(): void {
    this.guestInfoForm = this.fb.group({
      title: ['mr', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]{6,20}$/)]],
      address: this.fb.group({
        street: [''],
        city: [''],
        zipCode: [''],
        country: ['Côte d\'Ivoire']
      })
    });
  }
  
  onSubmit(): void {
    if (this.guestInfoForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.guestInfoForm);
      return;
    }
    
    this.formSubmit.emit(this.guestInfoForm.value);
  }
  
  onCancel(): void {
    this.formCancel.emit();
  }
  
  // Fonction utilitaire pour marquer tous les champs comme touchés
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Fonction utilitaire pour vérifier si un contrôle est invalide
  isInvalid(controlName: string): boolean {
    const control = this.guestInfoForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  
  // Fonction utilitaire pour obtenir le message d'erreur d'un contrôle
  getErrorMessage(controlName: string): string {
    const control = this.guestInfoForm.get(controlName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors?.['email']) {
        return 'Veuillez entrer une adresse email valide.';
      }
      if (control.errors?.['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères.`;
      }
      if (control.errors?.['pattern']) {
        return 'Format invalide.';
      }
    }
    return '';
  }
}