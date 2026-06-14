import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  savedMessage: boolean = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{value: '', disabled: true}],
      documentType: ['nit'],
      documentNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ngOnInit(): void {
    this.profileForm.patchValue({
      name: localStorage.getItem('user_name') || '',
      email: 'usuario@empresa.com',
      documentType: 'nit',
      documentNumber: localStorage.getItem('empresa_id') || ''
    });
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      localStorage.setItem('user_name', this.profileForm.value.name);
      this.savedMessage = true;
      setTimeout(() => this.savedMessage = false, 3000);
    }
  }

  downloadData() {
    alert('Empaquetando datos (Derecho de Acceso/Portabilidad)... Se descargará un ZIP en breve.');
  }

  deleteAccount() {
    if (confirm('¿Estás seguro? Esto ejercerá tu Derecho de Cancelación (ARCO). Todos tus datos serán borrados permanentemente.')) {
      alert('Cuenta eliminada. Redirigiendo...');
      localStorage.clear();
      window.location.href = '/';
    }
  }
}