
import { Component, inject } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    CommonModule
],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  isChecked = false;
  isLoading = false;
  errorMessage = '';

  fname = '';
  lname = '';
  email = '';
  password = '';
  role = 'Teacher';
  roleOptions = ['Teacher', 'Student'];

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignUp() {
    if (!this.fname || !this.lname || !this.email || !this.password || !this.role) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signUp({
      firstName: this.fname,
      lastName: this.lname,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (response) => {
        console.log('Sign up successful:', response);
        // Store token if provided
        if (response.token) {
          this.authService.setToken(response.token);
        }
        if (response?.user) {
          this.authService.setUserData(response.user);
        }
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Sign up error:', error);
        this.errorMessage = error.message || 'Sign up failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
