import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseServerService } from '../services/firebase-server.service';
import firebase from 'firebase/compat/app';
import 'firebase/database';
@Component({
  selector: 'app-new-one',
  templateUrl: './new-one.component.html',
  styleUrls: ['./new-one.component.css']
})
export class NewOneComponent implements OnInit {
public localStream:any
public remoteStream:any
public peerConnection:any
public uid =String(Math.floor(Math.random() * 10000));
@ViewChild('user_1') user_1!: ElementRef;
@ViewChild('user_2') user_2!: ElementRef;
public database:any;
public channelRef:any;
public servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
};

  constructor(public _firebaseService:FirebaseServerService ) { }

  async ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyC38H2mlLpNST-kCSOLSXfEf5i2gILhm5s",
      authDomain: "edoz-meet.firebaseapp.com",
      databaseURL: "https://edoz-meet-default-rtdb.firebaseio.com",
      projectId: "edoz-meet",
      storageBucket: "edoz-meet.appspot.com",
      messagingSenderId: "516257517082",
      appId: "1:516257517082:web:5a6c4fd7f6c94c63054ba3"


    })

    this.database = firebase.database();
    this.channelRef = this.database.ref('channels/main');

    this.channelRef.on('child_added', this.handleUserJoined);
    this.localStream =await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    this.user_1.nativeElement.srcObject = this.localStream;
    this.createOffer()
  }
  handleUserJoined = async(snapshot: any) => {
    console.log('a new user has joined', snapshot);
  };

  createOffer = async () => {
    this.peerConnection = new RTCPeerConnection(this.servers)
    this.remoteStream = new MediaStream()
    this.user_2.nativeElement.srcObject = this.remoteStream;
    this.localStream.getTracks().forEach((track:any)=>{
        this.peerConnection.addTrack(track,this.localStream)
    })
    this.peerConnection.ontrack = ((event:any) => {
      event.streams[0].getTracks().forEach((track:any) => {
        this.remoteStream.addTrack(track)
      })
    })

    this.peerConnection.onicecandidate = async (event:any) => {
      if (event.candidate) {
        console.log('New Ice can:', event.candidate);
      }
    }

    let offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    console.log(offer);

  }
}
