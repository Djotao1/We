import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService,Training } from '../training.service';

@Component({
  selector: 'app-delete-training',
  templateUrl: './delete-training.component.html',
  styleUrls: ['./delete-training.component.css']
})
export class DeleteTrainingComponent implements OnInit {
  
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

  deleteTraining(): void {
    this.trainingService.deleteTraining(this.trainingId).subscribe(
      () => {
        console.log('Training deleted successfully');
        // Optionally, you can navigate to another page after deletion
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error deleting training', error);
      }
    );
  }
}
