# SiteUpdaterDemo

This is a Proof Of Concept to show how we could handle mandatory and recommended uploading of new versions of Angular SPAs.

The central conceit is the use of a `version.json` file and a compiled `const` both of which include the semantic version number of the build.

The `const` version is compiled into the code and the `version.json` is regularly polled from the server.

The VersionService manages the polling and compares the compiled version with the `version.json` using the `diff` function from the `semver` library. If the difference is in the major version number, a mandatory upgrade event is issued.. If the difference is in the minor or patch version then a recommended upgrade event is issued. Otherwise the version difference is ignored.

These events are published as an Observable from the VersionService, and contain the loaded and latest versions and the upgrade recommendation.

The app component consumes this and displays an appropriate message. If the recommendation is mandatory, the site reloads after a short delay.

To make this all work, the `/src/version.json` filed is marked as an asset and `/src/app/version.ts` is compiled into the app. Both of these files need to be updated by your CI build pipeline to reflect the version of the application. Version numbers should follow semver so that a major version change is used to indicate a breaking change.