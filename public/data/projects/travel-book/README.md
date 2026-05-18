# Travel Book

Travel Book is a digital travel journal web app built with Angular and a physical-book UI metaphor. It helps users organize travel memories across markers, photos, country pages, and travel statistics.

## Overview

Navigation follows: `Cover -> Account -> Map -> Album -> Statistics -> Back Cover`.

The app includes:

- a book selector with a seeded demo book and user books
- a world map with country shapes loaded from GeoJSON
- an album flow organized by country and city
- shared books with multi-user collaboration
- photo uploads and storage through Cloudinary

## Tech Stack

- Angular 19 + TypeScript
- Supabase / PostgreSQL
- Cloudinary
- SCSS
- GitHub Pages
- Local storage for cache and session state

## Data Model

Core data is centered on books, book members, countries, cities, user profiles, dishes, markers, marker visits, and photos. Supabase row-level security keeps shared data protected.

## Getting Started

```bash
npm install
npm start
```

## Scripts

- `npm start` - run the Angular dev server
- `npm run build` - production build
- `npm run watch` - development build watch mode
- `npm test` - run the test suite

## Deployment

Production builds are published to GitHub Pages from `dist/travel-book/browser`.
