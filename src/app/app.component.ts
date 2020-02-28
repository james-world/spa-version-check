import { Component, OnInit } from '@angular/core';
import { VersionService, UpgradeRecommendation, VersionCheck } from './version.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  versionNotice = '';

  constructor(private versionService: VersionService) {
  }
  
  ngOnInit(): void {
    this.versionNotice = `Current version: ${this.versionService.loadedVersion}`;
    this.versionService.versionChanged.subscribe({
      next: v => this.evaluateVersion(v)
    })
  }

  private evaluateVersion(v: VersionCheck) {
    switch(v.recommendation) {
      case UpgradeRecommendation.Mandatory:
        this.versionNotice = `Mandatory verison update from ${v.loaded} to ${v.latest}`;
        timer(5000).subscribe({
          next: _ => window.location.reload()
        });
      case UpgradeRecommendation.Recommended:
        this.versionNotice = `Recommended verison update from ${v.loaded} to ${v.latest}`;
    }
  }


  title = 'SiteUpdaterDemo';
}
