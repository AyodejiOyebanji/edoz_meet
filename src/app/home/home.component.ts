import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public localStream: any;
  public remoteStream: any;
  public peerConnection: any;
  public userRef: any;
  public participants: any;
  public userName: any;
  @ViewChild('user_1') user_1!: ElementRef;
  @ViewChild('user_2') user_2!: ElementRef;
  public showoption:boolean= true
  public showMeetingRoom:boolean=false
  public showjoinmeet:boolean=false
  public disableBtn:boolean=true

  public firebaseConfig = {
    apiKey: 'AIzaSyC38H2mlLpNST-kCSOLSXfEf5i2gILhm5s',
    authDomain: 'edoz-meet.firebaseapp.com',
    databaseURL: 'https://edoz-meet-default-rtdb.firebaseio.com',
    projectId: 'edoz-meet',
    storageBucket: 'edoz-meet.appspot.com',
    messagingSenderId: '516257517082',
    appId: '1:516257517082:web:5a6c4fd7f6c94c63054ba3',
  };
  public app: any;
  public roomId: any;
  public link:any  ="";


  public servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  constructor() {
    this.app = firebase.initializeApp(this.firebaseConfig);
  }

  async ngOnInit(): Promise<void> {
    this.peerConnection = new RTCPeerConnection(this.servers);


  }


  async allowWebCam() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.remoteStream = new MediaStream();
      this.localStream.getTracks().forEach((track: any) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      this.peerConnection.ontrack = (event: any) => {
        event.streams[0].getTracks().forEach((track: any) => {
          this.remoteStream.addTrack(track);
        });
      };

      this.user_1.nativeElement.srcObject = this.localStream;
      this.user_2.nativeElement.srcObject = this.remoteStream;


    } catch (error) {
      console.error('Error in allowWebCam():', error);
    }
  }


  async createNewRoom() {
    const roomName = prompt('Enter a name for the new room:');
    this.showMeetingRoom= true
    this.showoption=false
    this.showjoinmeet=false
      await  this.allowWebCam();
    const db = firebase.firestore();

    const callDoc = db.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');
    this.roomId = callDoc.id;

    console.log(this.roomId);

    // get candidates caller

    this.peerConnection.onicecandidate = (event: any) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };
    //create offer
    const offerDescription = await this.peerConnection.createOffer();

    await this.peerConnection.setLocalDescription(offerDescription);
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
      userName: roomName,
      uid : Math.random().toString(36).substr(2, 9)
    };
    await callDoc.set({ offer });

    //  listen for remote answer
    callDoc.onSnapshot((snapshot: any) => {
      const data = snapshot.data();

      if (!this.peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.peerConnection.setRemoteDescription(answerDescription);
      }
    });

    // when answered add candidate to peer connection

    answerCandidates.onSnapshot((snapshot: any) => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.peerConnection.addIceCandidate(candidate);
        }
      });
    });
  }

  joinMeeting(){
    this.showoption=false
    this.showMeetingRoom= false
    this.showjoinmeet=true
  }

  checkLink(){
    if (this.link==""){
      this.disableBtn=true
     }else {
      this.disableBtn=false
     }

  }
  async answerCall() {
    const roomName = prompt('Enter a name for the new room:');
        this.showjoinmeet= false
        this.showMeetingRoom= true

    await  this.allowWebCam();

    const db = firebase.firestore();
    const callDoc = db.collection('calls').doc(this.link);
    const answerCandidates = callDoc.collection('answerCandidates');
    const offerCandidates = callDoc.collection('offerCandidates');
    this.peerConnection.onicecandidate = (event: any) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };
    const callData: any = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    console.log(offerDescription);

    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
      userName:roomName,
      uid: Math.random().toString(36).substr(2, 9)
    };
    await callDoc.update({ answer });
    console.log(answer);

    offerCandidates.onSnapshot((snapshot: any) => {
      snapshot.docChanges().forEach((change: any) => {
        console.log();
        if (change.type === 'added') {
          let data = change.doc.data();


          this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });



  }

  toogleCamera(){
    let videoTrack  =this.localStream.getTracks().find((track:any)=> track.kind ==='video')

    if(videoTrack.enabled){
      videoTrack.enabled = false
    }else{
      videoTrack.enabled = true
    }
  }
  toogleMic(){
    let audioTrack  =this.localStream.getTracks().find((track:any)=> track.kind ==='audio')

    if(audioTrack.enabled){
      audioTrack.enabled = false
    }else{
      audioTrack.enabled = true
    }
  }



}
