import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCreateComponent } from './configuracion-create.component';

describe('ConfiguracionCreateComponent', () => {
  let component: ConfiguracionCreateComponent;
  let fixture: ComponentFixture<ConfiguracionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
