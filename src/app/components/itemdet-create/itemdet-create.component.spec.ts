import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemdetCreateComponent } from './itemdet-create.component';

describe('ItemdetCreateComponent', () => {
  let component: ItemdetCreateComponent;
  let fixture: ComponentFixture<ItemdetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemdetCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemdetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
