import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Training {
  id: number;
  userId: number;
  exerciseType: string;
  duration: number;
  calories: number;
  intensity: number;
  fatigue: number;
  notes: string;
  trainingDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = 'https://localhost:44317/api/Trainings'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getTrainingsByUserId(userId: number): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/user/${userId}`);
  }

  addTraining(training: Training): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, training);
  }

  updateTraining(trainingId: number, training: Training): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${trainingId}`, training);
  }

  deleteTraining(trainingId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${trainingId}`);
  }

  getTraining(trainingId: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${trainingId}`);
  }

  getTrainingsByWeek(date: string, userId: number): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/week?date=${date}&userId=${userId}`);
  }
}
