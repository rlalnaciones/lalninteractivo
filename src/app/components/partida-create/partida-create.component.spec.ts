import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaCreateComponent } from './partida-create.component';

describe('PartidaCreateComponent', () => {
  let component: PartidaCreateComponent;
  let fixture: ComponentFixture<PartidaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartidaCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
