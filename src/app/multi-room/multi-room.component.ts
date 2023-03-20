import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {MatSnackBar} from '@angular/material/snack-bar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { FirebaseServerService } from '../services/firebase-server.service';
import RecordRTC from 'recordrtc';




@Component({
  selector: 'app-multi-room',
  templateUrl: './multi-room.component.html',
  styleUrls: ['./multi-room.component.css'],
})
export class MultiRoomComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('memberContainer') memberContainer!: ElementRef;
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('streams__container', { static: true })
  streams__container!: ElementRef;
  @ViewChild('streams__box', { static: true }) streams__box!: ElementRef;
  @ViewChild('member__list') member__list!: ElementRef;

  activeMemberContainer = false;
  activeChatContainer = false;
  public APP_ID = 'f97bc5a8198048a78504dd89c6d43aff';
  public uid = sessionStorage.getItem('uid');
  public token = null;
  public client: any;
  public queryString = window.location.search;
  public urlParams = new URLSearchParams(this.queryString);
  public roomId = this.urlParams.get('room');
  public localTracks: any = [];
  remoteUsers: { [key: string]: any } = {};
  public displayFrame: any;
  public videoFrame: any;
  public userIdIndisplayFrame: any;
  public localScreenTracks: any;
  public sharingScreen: boolean = false;
  public cameraBtn: boolean = true;
  public userName = sessionStorage.getItem('edoz_name');
  public rtmClient: any;
 
  public unMuteState = true
  public muteState = false
  public unMuteStateMic = true
  public muteStateMic = false
  public player: any
  public currentUser:any;
  public  app:any
  public db:any
  public allParticipants:any
  public remoteUser:any
  public recordingClient: any;
  public channelName:any= 'channel-' + Math.random().toString(36).substring(2, 7);
  public recordRTC!: any;
  public options = {
    mimeType: 'video/webm',
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 128000,
    bitsPerSecond: 128000,
    timeSlice: 1000 // set this to define the recording interval in milliseconds
  };
  public downloadUrl:any
  public loaderState:boolean= true

  constructor(
    private elRef: ElementRef,
    private route: ActivatedRoute,
    public router: Router,
    private _snackBar: MatSnackBar,
    public _firebaseService:FirebaseServerService,
    

  ) { this.app=firebase.initializeApp(this._firebaseService.firebaseConfig)
  
  
}
  
  ngOnInit(): void {
    if (!this.userName) {
      this.router.navigate(['/lobby']);
    }
    this.route.params.subscribe((params) => {
      this.roomId = params['roomId'];
    });

    this.setUid();
    this.setRoomId();
    this.joinRoomInit();
    
    
  
  }

  setUid(): void {
    if (!this.uid) {
      this.uid = String(Math.floor(Math.random() * 10000));
      sessionStorage.setItem('uid', this.uid);
    }
  }

  setRoomId(): void {
    if (!this.roomId) {
      this.roomId = 'main';
    }
  }

  // toggleMemberContainer() {
  //   this.activeMemberContainer = !this.activeMemberContainer;
  //   this.memberContainer.nativeElement.style.display = this
  //     .activeMemberContainer
  //     ? 'block'
  //     : 'none';
  // }

  // toggleChatContainer() {
  //   this.activeChatContainer = !this.activeChatContainer;
  //   this.chatContainer.nativeElement.style.display = this.activeChatContainer
  //     ? 'block'
  //     : 'none';
  // }


  // initialise firebase

  
  joinRoomInit = async () => {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    await this.client.join(this.APP_ID, this.roomId, this.token, this.uid);
    this.db= firebase.database()
    this.db.ref(`participants/${this.roomId}/${this.uid}`).set({
      userName:this.userName,
      uid:this.uid
    })
    this.client.on('user-published', this.handleUserPublished.bind(this));
    this.client.on('user-left', this.handleUserLeft.bind(this));
    this.joinStream();
    this.checkForUpdate()
  };


  async checkForUpdate (){
    this.db.ref(`participants/${this.roomId}`).on("value",(snapshot:any)=>{
      let data = snapshot.val();
       this.allParticipants= data

      
      
      

    })
    
  }
 


  joinStream = async () => {

    try {

      this.localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        {},
        {
          encoderConfig: {
            width: {
              min: 640,
              ideal: 1920,
              max: 1920,
            },
            height: {
              min: 480,
              ideal: 1080,
              max: 1080,
            },
          },
        }
      );
  
      let player = `
        <div class="video__container" id="user--container-${this.uid}">
          <div class="video-player" id="user-${this.uid}">
             <div  class="video__name">${this.userName}  </div>
  
          </div>
        </div>
      `;
        console.log(this.uid)
      this.streams__container.nativeElement.insertAdjacentHTML(
        'beforeend',
        player
      );
      document
        .getElementById(`user--container-${this.uid}`)
        ?.addEventListener('click', this.expandVideoFrame);
  
      this.localTracks[1].play(`user-${this.uid}`);
      await this.client.publish([this.localTracks[0], this.localTracks[1]]);
      this._snackBar.open('You have successfully joined the stream.', "Close",{duration:5000});
      this.db.ref(`participants/${this.roomId}/${this.uid}`).set({
        userName:this.userName,
        uid:this.uid
      })


    }catch(error:any){
      if (error.code === 'NETWORK_ERROR') {
        this._snackBar.open('Failed to join stream due to a network error. Please check your network connection and try again.', "Close",{duration:5000});
        
      } else if (error.name === 'TypeError' && error.message.includes('AgoraRTC.createMicrophoneAndCameraTracks is not a function')) {
        this._snackBar.open('Failed to join stream. Please try again later.', "Close", {duration:5000});
      
      } else {
        this._snackBar.open('Failed to join stream. Please try again later.', "Close", {duration:5000});
        
      }
      
    }
  };

  async switchToCamera() {
    let player = `
      <div class="video__container" id="user--container-${this.uid}">
        <div class="video-player" id="user-${this.uid}">
        
        </div>
      </div>
    `;
    this.displayFrame.insertAdjacentHTML('beforeend', player);
    await this.localTracks[0].setMuted(true);
    await this.localTracks[1].setMuted(true);
    this.localTracks[1].play(`user-${this.uid}`);
    await this.client.publish([this.localTracks[1]]);
  }
    async handleUserPublished(user: any, mediaType: any) {
      await this.client.subscribe(user, mediaType);
      this._snackBar.open(`${this.remoteUser} joined the meeting`, "Close",{duration:5000});
        
      let participantsRef = this.db.ref(`participants/${this.roomId}`);
      participantsRef.on('value', (snapshot:any)=>{
        let data = snapshot.val();
        let participant= data[user.uid]
        this.remoteUser = participant ? participant.userName: "";
        console.log(this.remoteUser);
      })
      let videoElement = document.getElementById(`user-${user.uid}`);
      if (!videoElement) {
        
        videoElement = document.createElement('div');
        videoElement.id = `user-${user.uid}`;
        videoElement.classList.add('video__container');
        this.streams__container.nativeElement.appendChild(videoElement);
        let nameLabel = document.createElement('div');
        nameLabel.classList.add('video__name');
        nameLabel.textContent = this.remoteUser;
        videoElement.appendChild(nameLabel);
        
    
        document
          .getElementById(`user-${user.uid}`)
          ?.addEventListener('click', this.expandVideoFrame);
    
        if (this.displayFrame.style.display) {
          videoElement.style.height = '100px';
          videoElement.style.width = '100px';
        }
      }
    
      // Update the video or audio track
      if (mediaType == 'video') {
        user.videoTrack.play(`user-${user.uid}`);
      }
      if (mediaType == 'audio') {
        user.audioTrack.play();
      }
    }
    

  async handleUserLeft(user: any) {
    try{
      delete this.remoteUsers[user.uid];
      let userFrame= this.streams__container.nativeElement
        .querySelector(`#user-${user.uid}`)
        if(userFrame){
          userFrame.remove()
        }
      // // check if a user leave and he is still in focus  then remove
      if (this.userIdIndisplayFrame === `user-${user.uid}`) {
        this.displayFrame.style.display = null;
        this.videoFrame =
          this.elRef.nativeElement.getElementsByClassName('video__container');
        for (let i = 0; this.videoFrame.length > i; i++) {
          this.videoFrame[i].style.height = '300px';
          this.videoFrame[i].style.width = '300px';
        }
      }

    }catch{
      this._snackBar.open('Something went wrong', "Close", {duration:5000});
        
    }
  }

  // to put in focus
  ngAfterViewInit() {
    this.displayFrame = this.streams__box.nativeElement;
   
      this.elRef.nativeElement.getElementsByClassName('video__container');
    for (let i = 0; this.videoFrame.length > i; i++) {
      this.videoFrame[i].addEventListener('click', this.expandVideoFrame);
    }

    this.userIdIndisplayFrame = null;
    this.displayFrame.addEventListener('click', this.hideDisplayFrame);
  }

  expandVideoFrame = (e: any) => {
    let child = this.displayFrame.children[0];
    if (child) {
      this.streams__container.nativeElement.appendChild(child);
    }
    this.displayFrame.style.display = 'block';
    this.displayFrame.appendChild(e.currentTarget);
    this.userIdIndisplayFrame = e.currentTarget.id;
    for (let i = 0; this.videoFrame.length > i; i++) {
      if (this.videoFrame[i].id != this.userIdIndisplayFrame) {
        this.videoFrame[i].style.height = '100px';
        this.videoFrame[i].style.width = '100px';
      }
    }
  };

  hideDisplayFrame() {
    this.userIdIndisplayFrame = null;

    this.displayFrame.style.display = 'none';
    let child = this.displayFrame.children[0];
    this.streams__container.nativeElement.appendChild(child);

    for (let i = 0; i < this.videoFrame.length; i++) {
      this.videoFrame[i].style.height = '300px';
      this.videoFrame[i].style.width = '300px';
    }
  }

  async camera() {
    if (this.localTracks[1].muted) {
      await this.localTracks[1].setMuted(false);
      this.unMuteState = true;
      this.muteState = false


    } else {
      await this.localTracks[1].setMuted(true);
      this.unMuteState = false;
      this.muteState = true
    }
  }
  async mic_btn() {
    if (this.localTracks[0].muted) {
      await this.localTracks[0].setMuted(false);
      this.unMuteStateMic = true;
      this.muteStateMic = false

    } else {
      await this.localTracks[0].setMuted(true);
      this.unMuteStateMic = false;
      this.muteStateMic = true
    }
  }
  toggleCircle() {
    const circle = document.querySelector(`#user-${this.uid} .circle`);

  }
  async screen_btn(e: any) {
    if (!this.sharingScreen) {
      this.sharingScreen = true;
      this.cameraBtn = false;
      this.localScreenTracks = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: {
          width: 1920,
          height: 1080,
          frameRate: 30,
        },
        optimizationMode: 'detail',
      });
      document.getElementById(`user--container-${this.uid}`)?.remove();
      this.displayFrame.style.display = 'block';
      let player = `
      <div class="video__container" id="user--container-${this.uid}">
        <div class="video-player" id="user-${this.uid}">
        
        </div>
      </div>
    `;
      this.displayFrame.insertAdjacentHTML('beforeend', player);
      document
        .getElementById(`user--container-${this.uid}`)
        ?.addEventListener('click', this.expandVideoFrame);
      this.userIdIndisplayFrame = `user--container-${this.uid}`;
      this.localScreenTracks.play(`user-${this.uid}`);
      await this.client.unpublish([this.localTracks[1]]);
      await this.client.publish([this.localScreenTracks]);
      let videoFrame =
        this.elRef.nativeElement.getElementsByClassName('video__container');
      for (let i = 0; videoFrame.length > i; i++) {
        if (videoFrame[i].id != this.userIdIndisplayFrame) {
          videoFrame[i].style.height = '100px';
          videoFrame[i].style.width = '100px';
        }
      }
    } else {
      this.sharingScreen = false;
      this.cameraBtn = true;
      document.getElementById(`user--container-${this.uid}`)?.remove();
      await this.client.unpublish([this.localScreenTracks]);
      this.switchToCamera();
    }
  }
  
    
  async leave_btn() {
    for (let i = 0; i < this.localTracks.length; i++) {
      this.localTracks[i].stop(); 
      this.localTracks[i].close();
    }
  
    await this.client.unpublish([this.localTracks[0], this.localTracks[1]]);
  
    if (this.localScreenTracks) {
      await this.client.unpublish([this.localScreenTracks])
    }
  
    // Leave the channel
    await this.client.leave();
  
    // Remove the local video element from the DOM
    // let localVideoElement = document.getElementById(`user-${this.uid}`);
    // if (localVideoElement) {
    //   this.streams__container.nativeElement.removeChild(localVideoElement);
    // }
    
    this.router.navigateByUrl('/');

  }
  

  async startRecord() {
    
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" } as MediaStreamConstraints['video'],
        audio: true,
      });
      this.recordRTC = new RecordRTC(stream, this.options);
      this.recordRTC.startRecording();
      this._snackBar.open('Recording started', "Close", {duration:5000});
    } catch (error) {
      console.error('Error starting recording:', error);
    }
}

  
  
  stopRecording() {
    if (this.recordRTC) {
      this.recordRTC.stopRecording(() => {
        const recordedBlob = this.recordRTC.getBlob();
  
        const storageRef = firebase.storage().ref();
        const filename = Math.random().toString(36).substring(2);
        const metadata = {
          contentType: 'video/webm',
        };
  
        const uploadTask = storageRef.child(`recordings/${filename}`).put(recordedBlob, metadata);
  
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            // upload progress monitoring
            console.log("Uploading");
            
          },
          (error) => {
            console.error(error);
          },
          () => {
            // upload complete
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.downloadUrl=downloadURL
              this.loaderState= false
              this._snackBar.open('Recording stopped', "Close", {duration:5000});
            });
          }
        );
  
        this.recordRTC = null;
      });
    }
  }
  

}