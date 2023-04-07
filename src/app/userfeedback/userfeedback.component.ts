import { Component, OnInit, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { FirebaseServerService } from '../services/firebase-server.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-userfeedback',
  templateUrl: './userfeedback.component.html',
  styleUrls: ['./userfeedback.component.css']
})
export class UserfeedbackComponent implements OnInit {
 @ViewChild("post") post!:ElementRef;
 @ViewChild("widget") widget!:ElementRef;
 @ViewChild("edit") editBtn!:ElementRef;
 @ViewChild('rate5') rate5!: ElementRef;
@ViewChild('rate4') rate4!: ElementRef;
@ViewChild('rate3') rate3!: ElementRef;
@ViewChild('rate2') rate2!: ElementRef;
@ViewChild('rate1') rate1!: ElementRef;
 public starRating :any
 public experience:any
 public app:any
 public db:any
 public userName = sessionStorage.getItem('edoz_name');


  constructor(private renderer: Renderer2, public _firebaseService:FirebaseServerService,     private _snackBar: MatSnackBar, public route:Router) { 
    this.app= firebase.initializeApp(this._firebaseService.firebaseConfig)
  }

  ngOnInit(): void {
  
  }

  postBtn(){
    if(!this.experience){
      this._snackBar.open(
        'Kindly fill up the missing field',
        'Close',
        { duration: 5000 })
    }else{
      this.renderer.setStyle(this.widget.nativeElement, 'display', 'none');
      this.renderer.setStyle(this.post.nativeElement, 'display', 'block');
      this.starRating = null;
      
      
      if (this.rate5.nativeElement.checked) {
            this.starRating = this.rate5.nativeElement.value;
      } else if (this.rate4.nativeElement.checked) {
            this.starRating = this.rate4.nativeElement.value;
      } else if (this.rate3.nativeElement.checked) {
            this.starRating = this.rate3.nativeElement.value;
      } else if (this.rate2.nativeElement.checked) {
            this.starRating = this.rate2.nativeElement.value;
      } else if (this.rate1.nativeElement.checked) {
            this.starRating = this.rate1.nativeElement.value;
      }
      this.db= firebase.database();
      this.db.ref(`Feedbacks`).push({
        name:this.userName,
        rating:this.starRating,
        experience:this.experience
      }, ((error:any)=>{
        if(error){
          this._snackBar.open(
            'Unable to save your feedback, Try again',
            'Close',
            { duration: 5000 })
        }else{
          this._snackBar.open(
            'Feedback submitted successfully',
            'Close',
            { duration: 5000 })
        }
      }))
    }
    
 
    

  
  }
  goToHome(){
    this.route.navigate(['/']);
  }

  
}
