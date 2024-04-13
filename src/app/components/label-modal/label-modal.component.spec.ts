import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelModalComponent } from './label-modal.component';

describe('LabelModalComponent', () => {
  let component: LabelModalComponent;
  let fixture: ComponentFixture<LabelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
