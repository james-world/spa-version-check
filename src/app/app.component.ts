import { Component } from '@angular/core';
import { VersionService } from './version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  version = '';

  constructor(private versionService: VersionService) {
    this.versionService.versionChanged.subscribe(
      {
        next: _ => {
          console.log('new version!');
          window.location.reload();
        }
      }
    );
  }

  title = 'SiteUpdaterDemo';
}
