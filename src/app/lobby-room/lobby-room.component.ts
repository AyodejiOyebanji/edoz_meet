import { LobbydialogueComponent } from './../lobbydialogue/lobbydialogue.component';
import { Component, OnInit } from '@angular/core';
import { Router, } from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-lobby-room',
  templateUrl: './lobby-room.component.html',
  styleUrls: ['./lobby-room.component.css'],
  
})
export class LobbyRoomComponent implements OnInit {
    public name:any
    public joinName:any
    public roomName:any
    public inviteCode:any
    public showCreateMeeting=false
    public showJoinMeeting=false

  constructor(private router:Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  generateRandomString(n:any) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
      let randomCharCode = Math.floor(Math.random() * charactersLength);
      result += String.fromCharCode(characters.charCodeAt(randomCharCode));
    }
    return result;
  }

  openDialog( ): void {
    const dialogRef = this.dialog.open(LobbydialogueComponent, {
      width: '450px',
  
    });
    // Generate and set the invite code
    this.inviteCode=this.generateRandomString(15)
    sessionStorage.setItem('edoz_roomCode', this.inviteCode);
    sessionStorage.setItem('edoz_name',this.name)

    

    
  }


   goToroom(){
    if(this.roomName){
      this.inviteCode= this.roomName;
      sessionStorage.setItem('edoz_name',this.joinName)
      this.router.navigate(["/multi", this.inviteCode])
      

    }
    // this.inviteCode=this.generateRandomString(15)
    // sessionStorage.setItem('edoz_name',this.name)
    // this.inviteCode= this.roomName
    //  this.router.navigate(["/multi", this.inviteCode])
    // if(!this.inviteCode){
    //    console.log(this.inviteCode, this.roomName);
    //   this.inviteCode= String(Math.floor(Math.random()*10000))
    //   //this.router.navigate(["/multi", this.inviteCode])
    //  }else{
    //   //this.router.navigate(["/multi", this.inviteCode])
    //   // this.openDialog()
    //  }

   }


  showCreateMeetingForm() {
    this.showCreateMeeting=true;
    this.showJoinMeeting=false
  }

  showJoinMeetingForm() {
    this.showCreateMeeting=false;
    this.showJoinMeeting=true
  }

}
