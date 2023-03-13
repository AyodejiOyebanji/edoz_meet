import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ParticipantsComponent } from './participants/participants.component';
import { FooterComponent } from './footer/footer.component';
import { ParticipantComponent } from './participant/participant.component';
import { CardComponent } from './card/card.component';
import { FormsModule } from '@angular/forms';
import { LobbyRoomComponent } from './lobby-room/lobby-room.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { MultiRoomComponent } from './multi-room/multi-room.component'



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainScreenComponent,
    ParticipantsComponent,
    FooterComponent,
    ParticipantComponent,
    CardComponent,
    LobbyRoomComponent,
    MultiRoomComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
