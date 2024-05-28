import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualmeetingdialogueComponent } from './virtualmeetingdialogue.component';

describe('VirtualmeetingdialogueComponent', () => {
  let component: VirtualmeetingdialogueComponent;
  let fixture: ComponentFixture<VirtualmeetingdialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualmeetingdialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualmeetingdialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
