import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Exercise {
  id: number;
  name: string;
  description: string;
  trainingId: number;
  userId: number;
}

@Component({
  selector: 'app-exercises',
  templateUrl: './execrises.component.html',
  styleUrls: ['./execrises.component.css']
})
export class ExercisesComponent implements OnInit {
  exercises: Exercise[] = [];
  trainingId: number = 0;
  userId: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get trainingId and userId from route parameters
    this.route.params.subscribe(params => {
      if (params['trainingId'] && params['userId']) {
        this.trainingId = +params['trainingId'];
        this.userId = +params['userId'];
        // Load exercises for the specified trainingId and userId
        this.loadExercises();
      } else {
        // Handle the case where trainingId or userId is not provided in the URL
        console.error('TrainingId or userId not provided in the URL');
      }
    });
  }

  loadExercises(): void {
    console.log(this.trainingId, 'T');
    console.log(this.userId,'U')
    const url = `https://localhost:44317/api/Exercises/training/${this.trainingId}/user/${this.userId}`;
    this.http.get<Exercise[]>(url).subscribe(
      (data: Exercise[]) => {
        this.exercises = data;
      },
      error => {
        console.error('Error loading exercises', error);
      }
    );
  }

  // Implement methods to add, update, or delete exercises as needed
}
