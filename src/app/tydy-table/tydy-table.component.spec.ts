import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TydyTableComponent } from './tydy-table.component';

describe('TydyTableComponent', () => {
  let component: TydyTableComponent;
  let fixture: ComponentFixture<TydyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TydyTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TydyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
