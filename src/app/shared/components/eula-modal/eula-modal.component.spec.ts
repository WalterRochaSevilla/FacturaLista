import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EulaModalComponent } from './eula-modal.component';

describe('EulaModalComponent', () => {
  let component: EulaModalComponent;
  let fixture: ComponentFixture<EulaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EulaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EulaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
