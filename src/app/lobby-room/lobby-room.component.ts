import { Component, OnInit } from '@angular/core';
import { Router, } from '@angular/router';

@Component({
  selector: 'app-lobby-room',
  templateUrl: './lobby-room.component.html',
  styleUrls: ['./lobby-room.component.css']
})
export class LobbyRoomComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  createMeeting(){
    
    this.router.navigate(['/home'])
  }
}
