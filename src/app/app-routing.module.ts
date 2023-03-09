import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyRoomComponent } from './lobby-room/lobby-room.component';

import { ParticipantComponent } from './participant/participant.component';

const routes: Routes = [
 
  {path:"", component:HomeComponent, title:"Home"},
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

exports: [RouterModule]
})
export class AppRoutingModule { }
