import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EulaModalComponent } from '../../../shared/components/eula-modal/eula-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, EulaModalComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  isEulaModalOpen = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.,&-]+$/)]],
      perfil: ['pyme', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)]],
      eula: [{value: false, disabled: true}, Validators.requiredTrue] 
    });
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  openEulaModal(event: Event) {
    event.preventDefault();
    this.isEulaModalOpen = true;
  }

  onEulaClosed(accepted: boolean) {
    this.isEulaModalOpen = false;
    if (accepted) {
      this.registerForm.get('eula')?.enable(); 
      this.registerForm.patchValue({ eula: true });
    }
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const randomId = Math.floor(Math.random() * 1000000).toString();
    localStorage.setItem('auth_token', 'mock-token-nuevo-usuario');
    localStorage.setItem('user_name', this.registerForm.value.razonSocial);
    localStorage.setItem('user_email', this.registerForm.value.email);
    localStorage.setItem('empresa_id', randomId);
    localStorage.setItem('user_type', 'new');
    localStorage.removeItem('document_number');
    this.router.navigate(['/dashboard']);
  }
}