import { TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { VersionService, VersionCheck, UpgradeRecommendation } from './version.service';
import { of, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, first, take } from 'rxjs/operators';

class MockHttpClient {
  get<T>(version: string) {
    return of("1.0.0");
  }
}

describe('VersionService', () => {
  let service: VersionService;
  let mockHttpClient : MockHttpClient;


  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: mockHttpClient }]
    });
    service = TestBed.inject(VersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial version', () => {
    expect(service.loadedVersion).toBe("1.0.0");
  })

  it('should not report same version', <any>fakeAsync(() => {
    let flag = false;

    let sub = service.versionChanged.pipe(take(1)).subscribe(result => {
      flag = true;
    });

    tick(2000);

    sub.unsubscribe();

    expect(flag).toBeFalse();

  }));

  it('should report minor version change as a recommended upgrade', <any>fakeAsync(() => {

    let versionCheck: VersionCheck;

    spyOn(mockHttpClient, 'get').and.returnValue(of("1.1.0"));

    let sub = service.versionChanged.pipe(take(1)).subscribe(result => {
      versionCheck = result;
    });

    tick(2000);

    expect(versionCheck.loaded).toBe("1.0.0");
    expect(versionCheck.latest).toBe("1.1.0");
    expect(versionCheck.recommendation).toBe(UpgradeRecommendation.Recommended);

    sub.unsubscribe();

  }));

  it('should report major version change as a recommended upgrade', <any>fakeAsync(() => {

    let versionCheck: VersionCheck;

    spyOn(mockHttpClient, 'get').and.returnValue(of("2.0.0"));

    let sub = service.versionChanged.pipe(take(1)).subscribe(result => {
      versionCheck = result;
    });

    tick(2000);

    expect(versionCheck.loaded).toBe("1.0.0");
    expect(versionCheck.latest).toBe("2.0.0");
    expect(versionCheck.recommendation).toBe(UpgradeRecommendation.Mandatory);

    sub.unsubscribe();

  }));
});