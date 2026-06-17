import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraScannerComponent } from './camera-scanner.component';

describe('CameraScannerComponent', () => {
  let component: CameraScannerComponent;
  let fixture: ComponentFixture<CameraScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraScannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
