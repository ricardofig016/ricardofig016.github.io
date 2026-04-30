# Tech Stack Cards

This folder contains the component that renders the Tech Stack section on the home page.

The cards are data-driven. In practice, adding a new card does not require editing the component unless the rendering rules change. You usually only need to add a new entry in `public/data/tech/index.json` and provide a matching icon file in `public/data/tech/icons/`.

## How A Tech Card Is Built

The home page fetches `public/data/tech/index.json` in `src/App.jsx` and passes the resulting array to `Home.jsx`, which renders `TechStack.jsx`.

For each item in the array, `TechStack.jsx`:

1. Reads `tech.code` and `tech.color`.
2. Uses `tech.code` as the visible label and as the filter target for `/projects?tech=...`.
3. Converts `tech.code` to a kebab-case filename and loads `/data/tech/icons/<kebab>.svg`.
4. Uses `tech.color` to generate the card background color.

That means a new card only appears if the JSON entry and icon file both match the expected convention.

## Steps To Add A New Tech Card

1. Add a new object to [public/data/tech/index.json](../../../public/data/tech/index.json).
2. Use this shape:

```json
{ "code": "new tech name", "color": "#123456" }
```

3. Make sure `code` is the exact label you want displayed on the card.
4. Make sure `color` is a valid hex color, because `src/utils/colorUtils.js` converts it to the background color used by the card.
5. Make sure the `color` is one of the main colors of the tech's logo, so the card visually matches the brand.
6. Create an SVG icon at [public/data/tech/icons/](../../../public/data/tech/icons/) using the kebab-case version of `code`.
7. Match the filename rule used by `TechStack.jsx`:

```js
String(code)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-") + ".svg";
```

8. Example:
   - `OpenAI API` becomes `openai-api.svg`
   - `Spring Boot` becomes `spring-boot.svg`
9. Open the home page and confirm the new card appears under the Tech Stack section.
10. Click the card and verify it routes to `/projects?tech=<code>`.

## Files Involved

- [src/App.jsx](../../App.jsx): fetches `public/data/tech/index.json` and passes `techData` to `Home`.
- [src/pages/Home/Home.jsx](../../pages/Home/Home.jsx): renders the Tech Stack section.
- [src/components/TechStack/TechStack.jsx](./TechStack.jsx): maps each tech entry into a clickable card.
- [src/components/TechStack/TechStack.module.css](./TechStack.module.css): controls the grid, card sizing, and hover styles.
- [src/utils/colorUtils.js](../../utils/colorUtils.js): turns the hex color into the darker card background.
- [public/data/tech/index.json](../../../public/data/tech/index.json): list of tech cards shown on the home page.
- [public/data/tech/icons/](../../../public/data/tech/icons/): SVG icons loaded by filename.

## Notes

- The component does not perform any fallback icon lookup. If the SVG filename is wrong or missing, the card will render with a broken image.
- The visible label and the projects filter value both come from `code`, so keep that field stable and descriptive.
- The grid uses fixed card sizing in `TechStack.module.css`, so unusually long labels may wrap across two lines.
