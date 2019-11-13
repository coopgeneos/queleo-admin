import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommunityFormComponent } from './add-community-form.component';

describe('AddCommunityFormComponent', () => {
  let component: AddCommunityFormComponent;
  let fixture: ComponentFixture<AddCommunityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommunityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommunityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
