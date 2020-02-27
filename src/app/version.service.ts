import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription, timer } from 'rxjs';
import { exhaustMap, switchMap, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  version = '2.0.0';

  versionChanged: Observable<boolean>;

  constructor(private http: HttpClient) {
    console.log('Version module constructed');

    this.versionChanged = timer(0, 1000)
      .pipe(
        switchMap(_ => http.get<string>('version.json')),
        filter(v => v !== this.version),
        map(_ => true)
      );
  }
}
