import { Component, OnInit } from '@angular/core';
import { TrainingService, Training } from '../training.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  trainings: Training[] = [];
  filteredTrainings: Training[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0]; // Initialize with today's date
  noTrainingsMessage: string = '';

  constructor(private trainingService: TrainingService, private router: Router) { }

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId'); // Retrieve userId from localStorage

    if (userIdStr) {
      const userId = +userIdStr; // Convert to number
      this.loadAllTrainings(userId);
    } else {
      console.error('User ID not found in local storage');
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.filterTrainingsByWeek(new Date(this.selectedDate));
  }

  loadAllTrainings(userId: number): void {
    this.trainingService.getTrainingsByUserId(userId).subscribe(
      (data: Training[]) => {
        this.trainings = data;
        this.filteredTrainings = data; // Initialize filteredTrainings with all trainings
        this.filterTrainingsByWeek(new Date(this.selectedDate)); // Apply initial week filter
      },
      error => {
        console.error('Error loading trainings', error);
      }
    );
  }

  filterTrainingsByWeek(date: Date): void {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // End of week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    this.filteredTrainings = this.trainings.filter(training => {
      const trainingDate = new Date(training.trainingDate);
      return trainingDate >= startOfWeek && trainingDate <= endOfWeek;
    });

    if (this.filteredTrainings.length === 0) {
      this.noTrainingsMessage = 'No training this week';
    } else {
      this.noTrainingsMessage = '';
    }
  }
  editTraining(trainingId: number): void {
    // Navigate to edit training page with selected training id
    this.router.navigate(['/edit-training', trainingId]);
  }
  viewTraining(trainingId: number, userId: number):void{
    this.router.navigate(['/exercises', trainingId, userId]);
  }
  deleteTraining(trainingId: number): void {
    if (confirm('Are you sure you want to delete this training?')) {
      this.trainingService.deleteTraining(trainingId).subscribe(
        () => {
          // Remove the deleted training from the array
          this.trainings = this.trainings.filter(training => training.id !== trainingId);
          // Also update the filteredTrainings array
          this.filteredTrainings = this.filteredTrainings.filter(training => training.id !== trainingId);
        },
        error => {
          console.error('Error deleting training', error);
        }
      );
    }
  }
  navigateToExercises(trainingId: number, userId: number): void {
    // Navigate to exercises page with selected training id and user id
    this.router.navigate(['/add-exercise', trainingId, userId]);
  }
  
}
