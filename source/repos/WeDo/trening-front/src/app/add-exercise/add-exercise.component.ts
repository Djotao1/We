import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Exercise {
  id: number;
  name: string;
  description: string;
  trainingId: number;
  userId: number;
}

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.css']
})
export class AddExerciseComponent {
  exerciseName: string = '';
  exerciseDescription: string = '';
  trainingId: number = 0;
  userId: number = 0;
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      if (params['trainingId'] && params['userId']) {
        this.trainingId = +params['trainingId'];
        this.userId = +params['userId'];
      } else {
        console.error('TrainingId or userId not provided in the URL');
      }
    });
  }

  addExercise(): void {
    this.isSubmitting = true;

    const newExercise: Exercise = {
      id: 0, // Assuming the server generates the ID
      name: this.exerciseName,
      description: this.exerciseDescription,
      trainingId: this.trainingId,
      userId: this.userId
    };

    this.http.post<Exercise>('https://localhost:44317/api/Exercises', newExercise).subscribe(
      (data: Exercise) => {
        console.log('Exercise added successfully:', data);
        this.successMessage = 'Exercise added successfully';
        this.isSubmitting = false;
        this.resetForm();
        // Redirect to exercises page
        
      },
      error => {
        console.error('Error adding exercise', error);
        this.successMessage = '';
        this.isSubmitting = false;
        // Handle error appropriately, such as displaying an error message to the user
      }
    );
  }
  Redirect(): void {
    this.router.navigate(['/exercises', this.trainingId, this.userId]);
  }
  
  resetForm(): void {
    this.exerciseName = '';
    this.exerciseDescription = '';
  }
}
