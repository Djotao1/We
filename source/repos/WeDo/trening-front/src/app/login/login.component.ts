import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // Add error message property

  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtHelper: JwtHelperService // Inject JwtHelperService
  ) { }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    console.log(this.username, this.password);
    this.authService.login({ username: this.username, password: this.password })
      .subscribe(
        response => {
          console.log('Login successful, token:', response.token);
          
          // Decode token to extract username and ID
          const decodedToken = this.jwtHelper.decodeToken(response.token);
          const username = decodedToken.unique_name; // Access Name claim
          const userId = decodedToken.nameid; // Access NameIdentifier claim
          
          // Save username and userId in local storage or a service
          localStorage.setItem('username', username);
          localStorage.setItem('userId', userId);
          console.log('user', username);
          console.log('ID', userId);
          
          // Optionally, you can also navigate to another component or perform other actions
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid username or password'; // Set error message
        }
      );
  }
}
