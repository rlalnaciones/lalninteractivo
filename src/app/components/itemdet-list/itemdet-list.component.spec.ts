import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemdetListComponent } from './itemdet-list.component';

describe('ItemdetListComponent', () => {
  let component: ItemdetListComponent;
  let fixture: ComponentFixture<ItemdetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemdetListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemdetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
