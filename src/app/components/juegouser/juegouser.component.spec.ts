import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegouserComponent } from './juegouser.component';

describe('JuegouserComponent', () => {
  let component: JuegouserComponent;
  let fixture: ComponentFixture<JuegouserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JuegouserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuegouserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
