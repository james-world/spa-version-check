import { Injectable, Version } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, empty } from 'rxjs';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import * as semver from 'semver';
import { version } from './version';

export enum UpgradeRecommendation {
  None = 0,
  Recommended = 1,
  Mandatory = 2
}

export class VersionCheck {
  loaded: string;
  latest: string;
  recommendation: UpgradeRecommendation;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  loadedVersion = version;

  versionChanged: Observable<VersionCheck>;

  constructor(private http: HttpClient) {
    console.log('Version module constructed');

    this.versionChanged = timer(0, 1000)
      .pipe(
        switchMap(_ => this.getVersionOrEmpty()),
        filter(v => v !== this.loadedVersion),
        map(v => {
            return {
              loaded: this.loadedVersion,
              latest: v,
              recommendation: this.compareVersions(v) };
          })
      );
  }

  private compareVersions(version: string): UpgradeRecommendation {
    const diff = semver.diff(this.loadedVersion, version);
    switch (diff) {
      case 'major':
        return UpgradeRecommendation.Mandatory;
      case 'minor':
      case 'patch':
        return UpgradeRecommendation.Recommended;
      default:
        return UpgradeRecommendation.None;
    }
  }

  private getVersionOrEmpty(): Observable<string> {
    return this.http.get<string>('version.json').pipe(
      catchError(_ => empty()));
  }
}
