import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.authenticationService.isLoggedIn().then(
      loggedIn => {
        this.isLoggedIn = loggedIn;
      });

    this.authenticationService.isLoggedInSubject.subscribe( 
      next => {
        this.isLoggedIn = next;
    });

  }

  onLogoutPressed() {
    this.authenticationService.logout();
  }

}
