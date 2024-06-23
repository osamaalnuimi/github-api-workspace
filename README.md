# Angular GitHub Search Application

## Overview

This application allows users to search for GitHub repositories and commits using the GitHub API. It features two main views:

- `/repos`: Search for repositories by name, optionally filtered by language and minimum number of stars, or by text contained in the title of an issue.
- `/commits`: View the list of commits for a selected repository.

## Features

- **Lazy Loaded Routes**: The application has two lazy-loaded routes, `/repos` and `/commits`.
- **Search Repositories**: Search for repositories by name, language, and stars, or by text in issue titles.
- **Repository Details**: Display repository name, owner avatar, and creation date.
- **Commit Details**: Display commit author, URL, and commit message.
- **UI Components**: Uses Angular Material components for UI and Tailwind CSS for styling.

## Changes Made

### General

1. **Lazy Loading**: Added lazy-loaded routes for `/repos` and `/commits`.
2. **Angular Material**: Added Angular Material for UI components and Tailwind CSS for styling.

### Repos Feature

- **RepoListComponent**: Component to search and display repositories.
- **RepoService**: Service to interact with the GitHub API for repository data.
- **Repo Entities**: Interfaces to define repository data structures.

### Commits Feature

- **CommitListComponent**: Component to search and display commits.
- **CommitService**: Service to interact with the GitHub API for commit data.
- **Commit Entities**: Interfaces to define commit data structures.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
