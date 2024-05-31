// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTrainingComponent } from './add-training/add-training.component';

import { AppRoutingModule } from './app-routing.module';
import { ExercisesComponent } from './execrises/execrises.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { DeleteTrainingComponent } from './delete-training/delete-training.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AddTrainingComponent,
    ExercisesComponent,
    NavbarComponent,
    AddExerciseComponent,
    EditTrainingComponent,
    DeleteTrainingComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // Import ReactiveFormsModule
    HttpClientModule, // Import HttpClientModule
    AppRoutingModule,
    RouterModule // Import RouterModule for routing
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
