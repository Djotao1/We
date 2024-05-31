import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTrainingComponent } from './delete-training.component';

describe('DeleteTrainingComponent', () => {
  let component: DeleteTrainingComponent;
  let fixture: ComponentFixture<DeleteTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTrainingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
