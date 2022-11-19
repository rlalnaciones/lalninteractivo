import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegopreviewComponent } from './juegopreview.component';

describe('JuegopreviewComponent', () => {
  let component: JuegopreviewComponent;
  let fixture: ComponentFixture<JuegopreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JuegopreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuegopreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
