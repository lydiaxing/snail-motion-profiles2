import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { HelpComponent } from './help/help.component';
//import { HeroDetailComponent } from './hero-detail/hero-detail.component'

const routes: Routes =[
    { path: 'create',   component: CreateComponent },
    { path: 'help',     component: HelpComponent },
    //{ path: 'detail/:id', component: HeroDetailComponent },
    { path: '',               redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
