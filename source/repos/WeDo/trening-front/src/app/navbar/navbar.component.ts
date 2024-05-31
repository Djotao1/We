import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  username:string='';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      this.isLoggedIn = true;
      this.username = loggedInUser;
    }
  }
  logout(): void {
    this.authService.logout();
  }
}
