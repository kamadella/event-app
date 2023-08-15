import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  isAdmin() {
    return this.authService.isAdmin;
  }
}
