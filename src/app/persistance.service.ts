import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PersistanceService {

  constructor(private databaseConnection : AngularFireDatabase ) { 

  }

  public read(){
    this.databaseConnection.database.ref('exampleData').once('value').then(data => {
      console.log(data.val());
    });
  }
}
