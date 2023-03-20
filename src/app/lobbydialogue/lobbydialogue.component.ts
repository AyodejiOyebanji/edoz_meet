import { Component, OnInit,Input } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lobbydialogue',
  templateUrl: './lobbydialogue.component.html',
  styleUrls: ['./lobbydialogue.component.css']
})
export class LobbydialogueComponent implements OnInit {
  public roomId:any
  constructor(private _snackBar: MatSnackBar, private router:Router) { }

  ngOnInit(): void {
   this.roomId=sessionStorage.getItem('edoz_roomCode')
  }

  GoToRoom(){
    
     this.router.navigate(["/multi", this.roomId])


  }

  copyBtn(){
    navigator.clipboard.writeText(this.roomId).then(()=>{
      this._snackBar.open('Text copied to clipboard', "Close", {duration:5000});

    }).catch((error:any)=>{
      this._snackBar.open('Error copying text', "Close", {duration:5000});
    })

  }

}
