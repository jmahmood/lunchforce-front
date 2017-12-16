import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationSuccessComponent } from './invitation-success.component';

describe('InvitationSuccessComponent', () => {
  let component: InvitationSuccessComponent;
  let fixture: ComponentFixture<InvitationSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
