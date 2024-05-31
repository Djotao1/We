// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators'; // Import catchError

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  phone: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  registrationError: string = ''; // New property to hold registration error message

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    const user = {
      username: this.username,
      email: this.email,
      phone: this.phone,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    };

    this.authService.register(user)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          if (error.status === 409) {
            this.registrationError = 'Username already exists. Please choose a different one.'; // Set username conflict error message
          } else {
            this.registrationError = 'Registration failed. Please try again.'; // Set general registration error message
          }
          throw error; // Rethrow error to be caught by outer subscribe
        })
      )
      .subscribe(
        () => {
          console.log('Registration successful');
          // After successful registration, log in the user
          this.authService.login({ username: this.username, password: this.password })
            .subscribe(
              response => {
                console.log('Login successful');
                const token = response.token;
                // Save token and other user data to local storage
                localStorage.setItem('auth_token', token);
                localStorage.setItem('username', this.username);
                // Redirect to the dashboard or any other desired route
                this.router.navigate(['/dashboard']);
              },
              loginError => {
                console.error('Login failed after registration:', loginError);
                // Handle login error
              }
            );
        },
        error => {
          console.error('Registration failed:', error);
          // Handle registration error appropriately
          this.registrationError = 'Registration failed. Please try again.'; // Set general registration error message
        }
      );
  }
}
