import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JobsService, Job, JobFilters } from './jobs.service';
import { environment } from '../../../../../environments/environment';

describe('JobsService', () => {
  let service: JobsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobsService]
    });
    service = TestBed.inject(JobsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch jobs with filters', () => {
    const mockResponse = {
      jobs: [
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'Tech Corp',
          location: 'Remote',
          type: 'full-time' as const,
          category: 'design' as const,
          description: 'Test job',
          requirements: ['Angular', 'TypeScript'],
          postedDate: new Date(),
          deadline: new Date(),
          applicants: 5,
          image: 'test.jpg'
        }
      ],
      total: 1
    };

    const filters: JobFilters = {
      category: 'design',
      type: 'full-time',
      search: 'frontend'
    };

    service.getJobs(filters).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request => 
      request.url === `${environment.baseUrlAuth}/proyectos` &&
      request.params.get('category') === 'design' &&
      request.params.get('type') === 'full-time' &&
      request.params.get('search') === 'frontend'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch job by id', () => {
    const mockJob: Job = {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'full-time',
      category: 'design',
      description: 'Test job',
      requirements: ['Angular', 'TypeScript'],
      postedDate: new Date(),
      deadline: new Date(),
      applicants: 5,
      image: 'test.jpg'
    };

    service.getJobById(1).subscribe(job => {
      expect(job).toEqual(mockJob);
    });

    const req = httpMock.expectOne(`${environment.baseUrlAuth}/proyectos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockJob);
  });

  it('should apply to job', () => {
    const application = {
      jobId: 1,
      message: 'I am interested in this position'
    };

    service.applyToJob(application).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseUrlAuth}/postulaciones`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(application);
    req.flush({ success: true });
  });
});