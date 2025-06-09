import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDeployment } from './show-deployment';

describe('ShowDeployment', () => {
  let component: ShowDeployment;
  let fixture: ComponentFixture<ShowDeployment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDeployment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDeployment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
