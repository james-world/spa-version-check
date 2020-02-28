import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, empty } from 'rxjs';
import { switchMap, map, filter, catchError } from 'rxjs/operators';

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
        switchMap(_ => this.getVersionOrEmpty()),
        filter(v => v !== this.version),
        map(_ => true)
      );
  }

  private getVersionOrEmpty(): Observable<string> {
    return this.http.get<string>('version.json').pipe(
      catchError(_ => empty()));
  }
}
