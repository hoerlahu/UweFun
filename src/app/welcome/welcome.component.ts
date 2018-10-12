import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  isKnownIfLoggedIn : boolean = false;
  isLoggedIn : boolean;

  constructor(private authenticationService : AuthenticationService) { 

  }

  ngOnInit() {
    this.authenticationService.isLoggedIn().then( next => {
      this.isKnownIfLoggedIn = true;
      this.isLoggedIn = next;
    });

    this.authenticationService.isLoggedInSubject.subscribe(
      next => {
        this.isLoggedIn = next;
      }
    );

  }

}
