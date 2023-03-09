import { Component, OnInit,  ViewChild, ElementRef  } from '@angular/core';
import { FirebaseServerService } from '../services/firebase-server.service';
import { ParticipantsService } from '../services/participants.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
 public participants:any[]=[]
 public gridSize: number = 2;
 public rowSize: number = 1;

 @ViewChild('localVideo') localVideo!: ElementRef;
 @ViewChild('remoteVideo') remoteVideo!: ElementRef;


 constructor(private _participantService: ParticipantsService, private _firebaseService:FirebaseServerService) { }

  ngOnInit(): void {


    this._participantService.participants$.subscribe((participants:any) =>{
      this.participants = participants
      this.updateGrid();
    })

    
    this.localVideo.nativeElement.srcObject=navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.remoteVideo.nativeElement.srcObject = new MediaStream();


  }


  private updateGrid(): void {
    if (this.participants.length === 1) {
      this.gridSize = 1;
      this.rowSize = 1;
    } else if (this.participants.length === 2) {
      this.gridSize = 2;
      this.rowSize = 1;
    } else if (this.participants.length === 3) {
      this.gridSize = 3;
      this.rowSize = 1;
    } else if (this.participants.length === 4) {
      this.gridSize = 2;
      this.rowSize = 2;
    } else {
      this.gridSize = 3;
      this.rowSize = Math.ceil(this.participants.length / 3);
    }
  }



}
