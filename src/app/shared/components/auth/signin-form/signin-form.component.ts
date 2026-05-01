
import { Component, inject } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    CommonModule
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  isChecked = false;
  isLoading = false;
  errorMessage = '';

  email = '';
  password = '';
  role = 'Teacher';
  roleOptions = ['Teacher', 'Student', 'Admin'];

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    console.log('Sign in button clicked');
    if (!this.email || !this.password || !this.role) {
      this.errorMessage = 'Please fill in all fields';
      console.warn('Form validation failed:', { email: this.email, password: this.password, role: this.role });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Calling signIn API with:', { email: this.email, role: this.role });
    this.authService.signIn({ email: this.email, password: this.password, role: this.role }).subscribe({
      next: (response) => {
        console.log('Sign in successful:', response);
        // Store token if provided
        if (response.token) {
          this.authService.setToken(response.token);
        }
        if (response?.user) {
          console.log('User data from response:', response.user);
          this.authService.setUserData(response.user);
        }
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Sign in error:', error);
        this.errorMessage = error.message || 'Sign in failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
