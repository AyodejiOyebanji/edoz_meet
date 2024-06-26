import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FirebaseServerService {
  private progressSubject = new Subject<number>();
  progress$ = this.progressSubject.asObservable();
  public  firebaseConfig = {
    apiKey: "AIzaSyBZatKlMVj_TESPsRfI3gFaW89SDPOunac",
    authDomain: "edoz-meet-4ca27.firebaseapp.com",
    projectId: "edoz-meet-4ca27",
    storageBucket: "edoz-meet-4ca27.appspot.com",
    messagingSenderId: "1038835794664",
    appId: "1:1038835794664:web:8969065760249fba7fbf5d",
    measurementId: "G-LX1B2QR02G"
  };

  constructor() {
  


  }

  setProgress(progress: number) {
    this.progressSubject.next(progress);
  }


}
