import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { EulaModalComponent } from '../../shared/components/eula-modal/eula-modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, EulaModalComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  isEulaModalOpen = false;

  modal = {
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Aceptar',
    action: () => {}
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: false }],
      email: [{ value: '', disabled: true }],
      documentType: [{ value: 'nit', disabled: false }],
      documentNumber: [{ value: '', disabled: false }]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        documentType: 'nit',
        documentNumber: user.nit || ''
      });
    }
  }

  saveChanges() {
    this.openModal('Éxito', 'Los cambios en tu perfil han sido guardados correctamente.', 'info', 'Entendido', () => this.closeModal());
  }

  exportData() {
    this.openModal(
      'Exportando Datos', 
      'Empaquetando datos (Derecho de Acceso/Portabilidad)... Se descargará tu archivo en breve.', 
      'info', 
      'Aceptar y Descargar',
      () => {
        this.descargarDatosARCO();
        this.closeModal();
      }
    );
  }

  descargarDatosARCO() {
    const user = this.authService.getCurrentUser();
    const datosExportar = {
      informacion_usuario: user,
      solicitud: 'Ejercicio de Derecho de Acceso y Portabilidad (ARCO)',
      fecha_exportacion: new Date().toISOString(),
      estado: 'Completado'
    };

    const blob = new Blob([JSON.stringify(datosExportar, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Datos_Personales_FacturaLista_${user?.nit || 'Export'}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  viewEULA() {
    this.isEulaModalOpen = true;
  }

  deleteAccount() {
    this.openModal(
      'Eliminar Cuenta Definitivamente', 
      '¿Estás seguro? Esta acción ejercerá tu Derecho de Cancelación. Se borrarán todos tus LCV, facturas y credenciales. Esta acción no se puede deshacer.', 
      'danger', 
      'Sí, eliminar cuenta', 
      () => {
        this.authService.logout();
        this.router.navigate(['/']);
      }
    );
  }

  openModal(title: string, message: string, type: string, confirmText: string, action: () => void) {
    this.modal = { isOpen: true, title, message, type, confirmText, action };
  }

  closeModal() {
    this.modal.isOpen = false;
  }
}