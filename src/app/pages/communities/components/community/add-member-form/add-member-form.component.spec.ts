import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberFormComponent } from './add-member-form.component';

describe('AddMemberFormComponent', () => {
  let component: AddMemberFormComponent;
  let fixture: ComponentFixture<AddMemberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
