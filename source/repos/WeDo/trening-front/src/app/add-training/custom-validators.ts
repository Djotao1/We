
import { AbstractControl, ValidatorFn, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
// Custom validator function to validate the range of fatigue (0-10)
export function fatigueRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const fatigue = control.value;
    if (fatigue !== null && (isNaN(fatigue) || fatigue < 0 || fatigue > 10)) {
      return { 'fatigueRange': true };
    }
    return null;
  };
}

// Custom validator function to validate the range of intensity (0-10)
export function intensityRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const intensity = control.value;
    if (intensity !== null && (isNaN(intensity) || intensity < 0 || intensity > 10)) {
      return { 'intensityRange': true };
    }
    return null;
  };
}

// Custom validator function to validate the duration (greater than 1)
export function durationValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const duration = control.value;
    return new Observable(observer => {
      if (duration !== null && (isNaN(duration) || duration <= 1)) {
        observer.next({ 'durationInvalid': true });
      } else {
        observer.next(null);
      }
      observer.complete();
    });
  };
}