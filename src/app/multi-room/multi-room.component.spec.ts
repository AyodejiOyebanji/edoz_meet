import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRoomComponent } from './multi-room.component';

describe('MultiRoomComponent', () => {
  let component: MultiRoomComponent;
  let fixture: ComponentFixture<MultiRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
