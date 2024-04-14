import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsModalComponent } from './actions-modal.component';

describe('ActionsModalComponent', () => {
  let component: ActionsModalComponent;
  let fixture: ComponentFixture<ActionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
