# SiteUpdaterDemo

## Overview

This is a Proof Of Concept to show how we could handle the situation when a new version of an Angular SPA is available.

This solution is useful when your users tend to keep your SPA open for days or weeks at a time. You release a new build, and they need to refresh/reload to get new features and fixes.

Note, this isn't necessarily about backend breaking changes. This can be handled with, for example, versioned URLs in your APIs, use of client/server version headers etc. Here, we are just thinking about changes in the SPA code itself. Also, we aren't looking at anything like reloading parts of the application - this is about a full refresh situation.

Following semver, we wanted to differentiate between a minor version change that represents a recommended upgrade, verus a major version change representing a mandatory change. IN the recommended case, we'd want to show a banner advising of the change, but in the mandatory case, we'd want to force the refresh after a timeout.

## Trying out the Solution

Most of the interesting code is in the `src/app/version.service.ts`.

To try out the code, clone, `npm install` and build with `ng build` and then serve it **without** a hotloader running. (Eg. Don't use `ng serve`, instead you could install npm package `httpserver` globally and run `httpserver -p 9201` from the `/dist/SiteUpdateDemo` folder.)

Point a browser at the site and then modify the version numbers in `/src/version.json` and `/src/app/version.ts` to a new minor or major version number (make them both the same). After a second or two you should see a notice appear indicating a Recommended (minor/patch version change) or Mandatory (major version change). If it's Mandatory the site will refresh after a few seconds.

The central conceit is the use of a `version.json` file and a compiled `const` both of which include the semantic version number of the build. The `const` version is compiled into the code and the `version.json` is regularly polled from the server. When a new build is deployed, the code running the browser will have the old version, but `version.json` will contain the new version.

The VersionService manages the polling and compares the compiled version with the `version.json` using the `diff` function from the `semver` library. If the difference is in the major version number, a mandatory upgrade event is issued.. If the difference is in the minor or patch version then a recommended upgrade event is issued. Otherwise the version difference is ignored.

These events are published as an Observable from the VersionService, and contain the loaded and latest versions and the upgrade recommendation.

The app component consumes this and displays an appropriate message. If the recommendation is mandatory, the site reloads after a short delay.

To make this all work, the `/src/version.json` filed is marked as an asset and `/src/app/version.ts` is compiled into the app. Both of these files need to be updated by your CI build pipeline to reflect the version of the application. Version numbers should follow semver so that a major version change is used to indicate a breaking change.

## Implementation considerations

- How frequently should polling take place? The PoC hard codes for 1 second so that you don't have to wait around. You might want to do something fancy with SignalR or similar if polling doesn't appeal. Make sure you plan how you'll serve `version.json` - you may want to not cache it all, or only for a duration related to the polling frequency. No point polling every minute if you cache `version.json` for a day!
- What should happen if the `version.json` fetch fails? The PoC ignores failures and keeps polling.
- What should the user experience be? I envisage showing a dismissable banner for recommended upgrades, and something more imposing with a countdown for mandatory upgrades.
- You'll need to think carefully about version numbering and what constitutes a breaking change.
- You'll need to think about how the version number gets written into the code at build time.
- Do you downgrade/rollback? This code will still work - it doesn't check whether the version change is up or down.

## Testing

- It's actually fairly easy to test rxjs time based streams in Angular now, check out `version.service.spec.ts` for ideas of how to test this stuff.
