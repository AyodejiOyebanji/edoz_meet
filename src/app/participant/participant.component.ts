import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {
  @Input() participant: any;
  public currentUserUid:any
  @ViewChild('videoElement') videoElement!: ElementRef;
  stream!: MediaStream;

  constructor() { }

  async ngOnInit() {
    const storedValue = localStorage.getItem('edoz_uid');
    if (storedValue !== null) {
      this.currentUserUid = JSON.parse(storedValue);


    }

  console.log(this.participant)

    // try {
    //   this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //   this.videoElement.nativeElement.srcObject = this.stream;
    // } catch (error) {
    //   console.error('Error accessing user media', error);
    // }

  }
  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

}
