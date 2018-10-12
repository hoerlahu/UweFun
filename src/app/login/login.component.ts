import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService : AuthenticationService) { }

  ngOnInit() {
  }
  
  onLoginButtonPressed(){
    let password = this.getPassword();
    let email = this.getEmail();

    this.authenticationService.login(email, password);
  }
  getEmail(): string {
    return (<HTMLInputElement>document.getElementById('email')).value;
  }
  getPassword(): string {
    return (<HTMLInputElement>document.getElementById('password')).value;
  }

}
