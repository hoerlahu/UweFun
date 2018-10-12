import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserAreaComponent } from './user-area/user-area.component';
import { LoggedInGuard } from './logged-in.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { WelcomePleaseLoginComponent } from './welcome-please-login/welcome-please-login.component';
import { WelcomeLoggedInComponent } from './welcome-logged-in/welcome-logged-in.component';
import { RoleplayCharacterMapComponent } from './roleplayCharacterMap/roleplay-character-map/roleplay-character-map.component';
import { GenerateNewRoleplayCharacterMapComponent } from './roleplayCharacterMap/generate-new-roleplay-character-map/generate-new-roleplay-character-map.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserAreaComponent, canActivate: [LoggedInGuard] },
  { path: 'signup', component: SignUpComponent },
  { path: 'character-map', component: RoleplayCharacterMapComponent, canActivate: [LoggedInGuard] },
  { path: '**', component: WelcomeComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    WelcomeComponent,
    UserAreaComponent,
    SignUpComponent,
    WelcomePleaseLoginComponent,
    WelcomeLoggedInComponent,
    RoleplayCharacterMapComponent,
    GenerateNewRoleplayCharacterMapComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // for database
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
