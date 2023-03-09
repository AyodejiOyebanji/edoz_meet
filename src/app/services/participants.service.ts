import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private participantsSource= new BehaviorSubject<any[]>([])
  participants$= this.participantsSource.asObservable();



  constructor() { }


  setParticipants(participants:any[]){
    this.participantsSource.next(participants);
    console.log(participants);

  }
}
