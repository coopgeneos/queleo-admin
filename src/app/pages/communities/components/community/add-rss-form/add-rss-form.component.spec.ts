import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRssFormComponent } from './add-rss-form.component';

describe('AddRssFormComponent', () => {
  let component: AddRssFormComponent;
  let fixture: ComponentFixture<AddRssFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRssFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRssFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
