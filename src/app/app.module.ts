import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';

import { ParticipantsComponent } from './participants/participants.component';

import { ParticipantComponent } from './participant/participant.component';

import { FormsModule } from '@angular/forms';
import { LobbyRoomComponent } from './lobby-room/lobby-room.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { MultiRoomComponent } from './multi-room/multi-room.component'
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { LobbydialogueComponent } from './lobbydialogue/lobbydialogue.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import { UserfeedbackComponent } from './userfeedback/userfeedback.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VirtualmeetingdialogueComponent } from './virtualmeetingdialogue/virtualmeetingdialogue.component';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ParticipantsComponent,
    ParticipantComponent,
    LobbyRoomComponent,
    MultiRoomComponent,
    LobbydialogueComponent,
    UserfeedbackComponent,
    VirtualmeetingdialogueComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSidenavModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatExpansionModule
    
  
  




  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
