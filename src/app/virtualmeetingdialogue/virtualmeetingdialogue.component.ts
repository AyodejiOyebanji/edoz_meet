import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseServerService } from '../services/firebase-server.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
@Component({
  selector: 'app-virtualmeetingdialogue',
  templateUrl: './virtualmeetingdialogue.component.html',
  styleUrls: ['./virtualmeetingdialogue.component.css']
})
export class VirtualmeetingdialogueComponent implements OnInit {

  public panelOpenState = false;
  public message=''
   public  app:any
   public db:any
   public receivedMessage:any
   public allParticipants: { [key: string]: { uid: string; userName: string } } =
   {};
   public getObjectKeys(obj: any): string[] {
     return Object.keys(obj);
   }
   public start_time:any
   public end_time:any
   progress: number = 0;

 constructor(
   private dialogRef: MatDialogRef<VirtualmeetingdialogueComponent>,  
   @Inject(MAT_DIALOG_DATA) public data: any,   public _firebaseService: FirebaseServerService
 ) {
   this.app = firebase.initializeApp(this._firebaseService.firebaseConfig);
 }
 ngOnInit(){

   this.fetchMessages()
   this.setupMessageListener();
   this.allParticipants=this.data.participants
   this.start_time=     sessionStorage.getItem("start_time") 
   this.end_time=  sessionStorage.getItem("end_time")
   this._firebaseService.progress$.subscribe((progress) => {
     this.progress = Math.ceil(progress);
     
   });
   
   
   
 }


 onNoClick(){

     this.dialogRef.close();

 }

 sendBtn() {
   this.db = firebase.database();
   const newMessageRef = this.db.ref(`messages/${this.data.roomId}`).push(); // Generate a new unique key
   newMessageRef.set({
     message: this.message,
     userName: this.data.username,
     timestamp: new Date().getTime(),
   });
   this.fetchMessages()
   this.message = ''; 
 }
 
 fetchMessages() {
   this.db = firebase.database();
   this.db.ref(`messages/${this.data.roomId}`)
     .once('value')
     .then((snapshot:any) => {
       const data = snapshot.val();
       if (data) {
         // Convert the object of messages into an array
         this.receivedMessage = Object.values(data);
       } else {
         this.receivedMessage = [];
       }
       console.log(this.receivedMessage);
     })
     .catch((error:any) => {
       console.error('Error fetching messages:', error);
     });
 }
 
 // Listen for real-time updates
 setupMessageListener() {
  this.db.ref(`messages/${this.data.roomId}`)
    .on('value', (snapshot:any) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of messages into an array
        this.receivedMessage = Object.values(data);
      } else {
        this.receivedMessage = [];
      }
      console.log(this.receivedMessage);
    });
}
 close(){
   this.dialogRef.close(true);
 }




}
