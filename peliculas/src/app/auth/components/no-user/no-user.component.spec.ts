import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoUserComponent } from './no-user.component';

describe('NoUserComponent', () => {
  let component: NoUserComponent;
  let fixture: ComponentFixture<NoUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoUserComponent]
    });
    fixture = TestBed.createComponent(NoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
