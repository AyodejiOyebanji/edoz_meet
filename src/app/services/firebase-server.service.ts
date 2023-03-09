import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';



@Injectable({
  providedIn: 'root'
})
export class FirebaseServerService {
  public  firebaseConfig = {
    apiKey: "AIzaSyC38H2mlLpNST-kCSOLSXfEf5i2gILhm5s",
    authDomain: "edoz-meet.firebaseapp.com",
    databaseURL: "https://edoz-meet-default-rtdb.firebaseio.com",
    projectId: "edoz-meet",
    storageBucket: "edoz-meet.appspot.com",
    messagingSenderId: "516257517082",
    appId: "1:516257517082:web:5a6c4fd7f6c94c63054ba3"


  };

  constructor() {
  
  }



}
