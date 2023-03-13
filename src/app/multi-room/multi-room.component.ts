import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';

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
  public channel: any;
 
  public unMuteState= true
  public muteState= false

  constructor(
    private elRef: ElementRef,
    private route: ActivatedRoute,
    public router: Router
  ) {}

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

  toggleMemberContainer() {
    this.activeMemberContainer = !this.activeMemberContainer;
    this.memberContainer.nativeElement.style.display = this
      .activeMemberContainer
      ? 'block'
      : 'none';
  }

  toggleChatContainer() {
    this.activeChatContainer = !this.activeChatContainer;
    this.chatContainer.nativeElement.style.display = this.activeChatContainer
      ? 'block'
      : 'none';
  }

  joinRoomInit = async () => {
    // this.rtmClient = await AgoraRTM.createInstance(this.APP_ID);
    // await this.rtmClient.login({ uid: this.uid, token: this.token });
    // this.channel = await this.rtmClient.createChannel(this.roomId);
    // await this.channel.join();

    // this.channel.on('MemberJoined', this.handleMemberJoined);
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    await this.client.join(this.APP_ID, this.roomId, this.token, this.uid);
    this.client.on('user-published', this.handleUserPublished.bind(this));
    this.client.on('user-left', this.handleUserLeft.bind(this));
    this.joinStream();
  };

  joinStream = async () => {
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
           <div class="circle hidden" > A </div>
          <div class="mic-icon"></div>
        </div>
      </div>
    `;

    this.streams__container.nativeElement.insertAdjacentHTML(
      'beforeend',
      player
    );
    document
      .getElementById(`user--container-${this.uid}`)
      ?.addEventListener('click', this.expandVideoFrame);

    this.localTracks[1].play(`user-${this.uid}`);
    await this.client.publish([this.localTracks[0], this.localTracks[1]]);
  };

  async switchToCamera() {
    let player = `
      <div class="video__container" id="user--container-${this.uid}">
        <div class="video-player" id="user-${this.uid}">
          <div class="circle"> A </div>
          <div class="mic-icon"></div>
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
    this.remoteUsers[user.uid] = user;
    await this.client.subscribe(user, mediaType);
    console.log('remoteUsers after subscribe', this.client.remoteUsers);
    const videoElement = document.createElement('div');
    videoElement.id = `user-${user.uid}`;
    videoElement.classList.add('video__container');

    this.streams__container.nativeElement.appendChild(videoElement);
    document
      .getElementById(`user-${user.uid}`)
      ?.addEventListener('click', this.expandVideoFrame);

    if (this.displayFrame.style.display) {
      videoElement.style.height = '100px';
      videoElement.style.width = '100px';
    }
    if (mediaType == 'video') {
      user.videoTrack.play(`user-${user.uid}`);
    }
    if (mediaType == 'audio') {
      user.audioTrack.play();
    }
  }

  async handleUserLeft(user: any) {
    delete this.remoteUsers[user.uid];
    this.streams__container.nativeElement
      .querySelector(`#user-${user.uid}`)
      .remove();
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
  }

  // to put in focus
  ngAfterViewInit() {
    this.displayFrame = this.streams__box.nativeElement;
    this.videoFrame =
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
      this.unMuteState= true;
      this.muteState=false

      
    } else {
      await this.localTracks[1].setMuted(true);
      this.unMuteState= false;
      this.muteState=true
    }
  }
  async mic_btn() {
    if (this.localTracks[0].muted) {
      await this.localTracks[0].setMuted(false);
      this.unMuteState= true;
      this.muteState=false

    } else {
      await this.localTracks[0].setMuted(true);
      this.unMuteState= false;
      this.muteState=true
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
          <div class="circle"> A </div>
          <div class="mic-icon"></div>
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
  leave_btn() {}

  // // Realtime messaging starts here
  //   async handleMemberJoined(MemberId: any) {
  //     console.log('A new member', MemberId);

  //   await  this.addMemberInrealTimeToDom(MemberId);
  //   }




  //   async addMemberInrealTimeToDom(MemberId: any) {
  //     console.log("check id  ",MemberId);


  //     let  memberItem = `
  //   <div class="member__wrapper"  id="member__${MemberId}__wrapper">
  //     <span class="green__icon"></span>
  //     <p class="member_name" style="color:white;">${MemberId}</p>
  //   </div>
  // `;
  //     this.member__list.nativeElement.insertAdjacentHTML(
  //       'beforeend',
  //       memberItem
  //     );
  //   }
}
