import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { callbackify } from 'util';

@Injectable({
  providedIn: 'root'
})
export class PersistanceService {

  constructor(private databaseConnection: AngularFireDatabase,
              private authenticationService: AuthenticationService ) {
  }

  public write(pathToData: string, dataToWrite: string) {
    this.openReferenceToUserIdInPath(pathToData).set(dataToWrite);
  }

  public readOnce(pathToData: string): Promise<firebase.database.DataSnapshot> {
    return this.openReferenceToUserIdInPath(pathToData).once('value');
  }

  public read(pathToData: string, callback) {
    this.openReferenceToUserIdInPath(pathToData).on( 'value', dataSnapshot => {
      callback(dataSnapshot.val());
    });
  }

  private openReferenceToUserIdInPath(pathToData: string) {
    return this.databaseConnection.database.ref(pathToData + '/' + this.authenticationService.getUserId());
  }
}
