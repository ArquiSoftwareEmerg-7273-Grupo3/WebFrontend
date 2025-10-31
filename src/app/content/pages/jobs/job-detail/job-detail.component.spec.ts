import { TestBed } from '@angular/core/testing';
import { JobDetailComponent } from './job-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { of } from 'rxjs';

describe('JobDetailComponent', () => {
  let component: JobDetailComponent;
  let fixture: any;
  let mockJobsService: jasmine.SpyObj<JobsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const jobsServiceSpy = jasmine.createSpyObj('JobsService', ['getJobById', 'saveJob']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      snapshot: {
        params: { id: '1' }
      }
    };

    await TestBed.configureTestingModule({
      imports: [JobDetailComponent],
      providers: [
        { provide: JobsService, useValue: jobsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailComponent);
    component = fixture.componentInstance;
    mockJobsService = TestBed.inject(JobsService) as jasmine.SpyObj<JobsService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load job on init', () => {
    const mockJob = {
      id: 1,
      title: 'Test Job',
      company: 'Test Company',
      location: 'Test Location',
      type: 'full-time' as const,
      category: 'design' as const,
      description: 'Test description',
      requirements: ['Test requirement'],
      postedDate: new Date(),
      deadline: new Date(),
      applicants: 5,
      image: 'test.jpg'
    };

    mockJobsService.getJobById.and.returnValue(of(mockJob));

    component.ngOnInit();

    expect(mockJobsService.getJobById).toHaveBeenCalledWith(1);
    expect(component.job).toEqual(mockJob);
    expect(component.loading).toBeFalse();
  });

  it('should navigate back to jobs', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/jobs']);
  });
});