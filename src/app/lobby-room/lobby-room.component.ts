import { Component, OnInit } from '@angular/core';
import { Router, } from '@angular/router';

@Component({
  selector: 'app-lobby-room',
  templateUrl: './lobby-room.component.html',
  styleUrls: ['./lobby-room.component.css']
})
export class LobbyRoomComponent implements OnInit {
    public name:any
    public roomName:any
    public inviteCode:any
    public showCreateMeeting=false
    public showJoinMeeting=false

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  goToroom(){

    sessionStorage.setItem('edoz_name',this.name)
    this.inviteCode= this.roomName
    if(!this.inviteCode){
       console.log(this.inviteCode, this.roomName);
      this.inviteCode= String(Math.floor(Math.random()*10000))
      this.router.navigate(["/multi", this.inviteCode])
     }else{
      this.router.navigate(["/multi", this.inviteCode])
     }

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
