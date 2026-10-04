# Travel With Sarah

An editorial, responsive travel-planning website for **Sarah Harry**, an Iowa-based independent travel consultant through Archer Travel.

## Build

No package installation or framework is required. Python 3 generates the static pages; JavaScript enhances navigation, journal filters, and the enquiry form.

```sh
python3 scripts/build.py
node --check dist/assets/site.js
python3 scripts/check.py
```

Deploy `dist/` with any static host. `netlify.toml` includes a build command, 301 redirects, and response headers for a future Netlify deployment. Existing Wix pages are separate from this repository.

## Content and launch settings

- `content/articles.json`: the three original journal articles, captured from the existing Wix pages on October 4, 2026. Original article slugs are retained.
- `content/site.json`: canonical origin and `review_mode`. Review mode intentionally prevents indexing. Change it to `false` only when the approved site is ready for the public domain.
- `scripts/build.py`: page structure and copy.
- `dist/assets/site.css`: palette, responsive layouts, and typography.
- `dist/assets/site.js`: accessible menu, journal filters, validation, enquiry preview, and copy fallback.

## Enquiry delivery

The form validates details and creates a reviewed email addressed to the contact email published on Sarah’s existing site. **It does not submit directly to a server, send email automatically, store an enquiry, or confirm delivery.** The visitor sends the prepared message in their own email app. This limitation is explained before and after completing the form, with a copy option if a mail app is unavailable. A direct submission endpoint needs Sarah’s approved provider and privacy information.

See [HANDOFF.md](HANDOFF.md) for evidence, launch requirements, and verification limits. See [ASSET-CREDITS.md](ASSET-CREDITS.md) for image and font provenance.
