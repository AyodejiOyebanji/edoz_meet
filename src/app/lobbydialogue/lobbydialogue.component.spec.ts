import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbydialogueComponent } from './lobbydialogue.component';

describe('LobbydialogueComponent', () => {
  let component: LobbydialogueComponent;
  let fixture: ComponentFixture<LobbydialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LobbydialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LobbydialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
