import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecrisesComponent } from './execrises.component';

describe('ExecrisesComponent', () => {
  let component: ExecrisesComponent;
  let fixture: ComponentFixture<ExecrisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecrisesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecrisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
