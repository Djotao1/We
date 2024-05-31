import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Import the RegisterComponent
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { ExercisesComponent } from './execrises/execrises.component';
import { AddExerciseComponent } from './add-exercise/add-exercise.component'; // Import the AddExerciseComponent
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { DeleteTrainingComponent } from './delete-training/delete-training.component';
import  {AuthGuard } from './auth.guard';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'add-training', component: AddTrainingComponent,canActivate: [AuthGuard] },
  { path: 'exercises/:trainingId/:userId', component: ExercisesComponent,canActivate: [AuthGuard] },// Define dynamic parameters
  { path: 'add-exercise/:trainingId/:userId', component: AddExerciseComponent,canActivate: [AuthGuard] } ,// Define dynamic parameters
  { path: 'edit-training/:id', component: EditTrainingComponent,canActivate: [AuthGuard] },
  { path: 'edit-training/:id', component: DeleteTrainingComponent,canActivate: [AuthGuard] }, // Define the route with a parameter ':id'
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
