import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService, Training } from '../training.service';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css']
})
export class EditTrainingComponent implements OnInit {
  trainingId!: number;
  training: Training | null = null; // Initialize to null

  constructor(private route: ActivatedRoute, private trainingService: TrainingService, private router: Router) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.trainingId = idParam ? +idParam : 0;

    this.loadTraining(this.trainingId);
  }

  loadTraining(id: number): void {
    this.trainingService.getTraining(id).subscribe(
      (data: Training | null) => {
        this.training = data;
      },
      error => {
        console.error('Error loading training', error);
      }
    );
  }
  
  saveTraining(): void {
    if (!this.training) {
      console.error('Training data is null or undefined');
      return;
    }
    
    // Ensure that trainingDate is of type Date
    if (typeof this.training.trainingDate === 'string') {
      // Convert trainingDate to Date object
      this.training.trainingDate = new Date(this.training.trainingDate);
    }
    
    // Check if trainingDate is a valid Date object
    if (!(this.training.trainingDate instanceof Date && !isNaN(this.training.trainingDate.getTime()))) {
      console.error('Invalid trainingDate');
      return;
    }

    this.trainingService.updateTraining(this.trainingId, this.training).subscribe(
      () => {
        console.log('Training updated successfully');
        // Optionally, you can navigate to another page after saving
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error updating training', error);
      }
    );
  }
}
