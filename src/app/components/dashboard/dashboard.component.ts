import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayName: string = '';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.displayName = this.authService.userData.displayName || '';
  }

  updateDisplayName() {
    const newDisplayName = this.displayName; // Pobieramy nową nazwę użytkownika
    if (newDisplayName.trim() !== '') {
      console.log("innn dash");
      this.authService.updateDisplayName(newDisplayName)
    }
  }

}
