# Adding a New Experience

This folder is fully manual. There is no sync script for experiences like there is for projects.

## How It Works

The app loads experience data at runtime from:

1. `public/data/experience/index.json` - list of experience folder names, in display order
2. `public/data/experience/[experience-code]/info.json` - the data used by the UI
3. `public/data/experience/[experience-code]/[logo-file]` - optional company logo referenced by `company_logo`

The experience list and detail pages read this data directly. Tech pills are not stored in experience data; they are derived from the related project codes in `projects`.

## What To Add Manually

Create a folder such as `public/data/experience/my-experience-code/` and add:

```json
{
  "code": "my-experience-code",
  "company": "My Company",
  "role": "Software Developer",
  "level": "Internship",
  "type": "Full-time",
  "arrangement": "Hybrid",
  "start_date": "01-2024",
  "end_date": "06-2024",
  "ongoing": false,
  "location": { "city": "Porto", "country": "Portugal" },
  "company_logo": "logo.png",
  "company_website": "https://example.com",
  "company_linkedin": "https://linkedin.com/company/example",
  "highlights": ["Built a **React** dashboard."],
  "projects": ["related-project-code"],
  "supervisors": [
    {
      "name": "Jane Doe",
      "role": "Manager",
      "linkedin": "https://linkedin.com/in/janedoe/"
    }
  ]
}
```

## What The UI Uses

- `code`, `company`, `role`, `level`, `type`, `arrangement`
- `start_date`, `end_date`, `ongoing`
- `location.city`, `location.country`
- `company_logo`, `company_website`, `company_linkedin`
- `highlights`
- `projects` for related project links and derived tech pills
- `supervisors`

Dates must use `MM-YYYY` so they display correctly with `formatDate()`.
The current UI does not read `description`, `files`, `images`, or `featured` from experience data.

## What Is Generated

Nothing is generated for experiences. `index.json` is edited by hand, and `info.json` is also maintained by hand.

## Related Files

- `src/App.jsx` - loads `experience/index.json` and each `info.json`
- `src/pages/Experience/Experience.jsx` - renders the list and detail views
- `src/pages/Home/Home.jsx` - shows the experience preview section
- `src/utils/techMerger.js` - derives experience tech pills from related projects
