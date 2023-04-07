import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyRoomComponent } from './lobby-room/lobby-room.component';
import { MultiRoomComponent } from './multi-room/multi-room.component';

import { ParticipantComponent } from './participant/participant.component';
import { UserfeedbackComponent } from './userfeedback/userfeedback.component';

const routes: Routes = [

  // {path:"", component:HomeComponent, title:"Home"},
  {path:"", component:LobbyRoomComponent, title:""},
  {path:"multi/:roomId", component:MultiRoomComponent, title:""},
  
  {path:"userfeedback", component:UserfeedbackComponent, title:""},





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

exports: [RouterModule]
})
export class AppRoutingModule { }
