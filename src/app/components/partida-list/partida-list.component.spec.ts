import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaListComponent } from './partida-list.component';

describe('PartidaListComponent', () => {
  let component: PartidaListComponent;
  let fixture: ComponentFixture<PartidaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartidaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
