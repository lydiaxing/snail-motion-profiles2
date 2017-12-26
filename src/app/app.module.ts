import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import {
  MatButtonModule,
  MatInputModule,
  MatTableModule,
  MatDialogModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule
} from '@angular/material';

import { WaypointService } from './waypoint.service';
//import { WaypointDetailComponent } from './hero-detail/hero-detail.component';
import { CreateComponent } from './create/create.component';
import { HelpComponent } from './help/help.component';
import { CanvasComponent } from './create/canvas.component';
import { EditSettings, EditSettingsDialog } from './edit-settings/edit-settings';

@NgModule({
  declarations: [
    AppComponent,
    CreateComponent,
    HelpComponent,
    CanvasComponent,
    //HeroDetailComponent,
    EditSettings,
    EditSettingsDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule
  ],
  entryComponents: [EditSettings, EditSettingsDialog],
  providers: [WaypointService],
  bootstrap: [AppComponent]
})
export class AppModule { }
