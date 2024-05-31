import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../training.service';
import { fatigueRangeValidator, intensityRangeValidator, durationValidator } from './custom-validators'; // Import custom validators

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.css']
})
export class AddTrainingComponent implements OnInit {
  trainingForm!: FormGroup;
  training: any = {}; // Define the training object
  successMessage: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private trainingService: TrainingService
  ) { }

  ngOnInit(): void {
    this.trainingForm = this.formBuilder.group({
      exerciseType: ['', Validators.required],
      dateTime: ['', Validators.required], // Use single field for date and time
      duration: ['', Validators.required,durationValidator()], // Duration field
      calories: ['', Validators.required],
      intensity: ['', [Validators.required, intensityRangeValidator()]],
      fatigue: ['', [Validators.required, fatigueRangeValidator()]],
      notes: [''],
      trainingDate:[]
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      // Form is valid, proceed with submission
      const userIdStr = localStorage.getItem('userId');
      if (userIdStr !== null) {
        const userId = +userIdStr;
        const formData = this.trainingForm.value;
        formData.userId = userId;
  
        // Combine date and time fields into a single field
        const dateTime = new Date(formData.dateTime);
        // Adjust for timezone offset
        dateTime.setHours(dateTime.getHours() + 2);
        formData.trainingDate = dateTime.toISOString(); // Assign to trainingDate field
  
        console.log('Form Data:', formData);
  
        this.trainingService.addTraining(formData).subscribe(
          () => {
            console.log('Training added successfully');
            this.trainingForm.reset(); // Reset the form
            // Add a success message (you can define a variable for this message and display it in your template)
            this.successMessage = 'Training added successfully';
          },
          error => {
            console.error('Error adding training', error);
          }
        );
      } else {
        console.error('userId is null');
      }
    } else {
      // Form is invalid, display error messages
      this.markFormGroupTouched(this.trainingForm);
    }
  }
  
  
  // Helper function to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}  