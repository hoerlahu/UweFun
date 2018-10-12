import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private authenticationService : AuthenticationService) { }

  ngOnInit() {
  }
  
  getEmail(): string {
    return (<HTMLInputElement>document.getElementById('email')).value;
  }
  getPassword(): string {
    return (<HTMLInputElement>document.getElementById('password')).value;
  }

  onSignUpButtonPressed(){
    let password = this.getPassword();
    let email = this.getEmail();

    this.authenticationService.signUpWithEmailAndPassword(email, password);
  }

}
