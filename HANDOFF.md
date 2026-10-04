# Travel With Sarah — redesign handoff

## Delivered

- Ivory, evergreen teal, sand, and restrained terracotta palette with locally served DM Serif Display and DM Sans.
- Cinematic Italy hero, distinct editorial inspiration features, introduction to Sarah, planning guidance, three journal features, and clear planning actions.
- Home, Plan Your Trip, About, Travel Journal, Contact and FAQs, Disney inspiration, Cruise inspiration, and Italy/Europe inspiration pages.
- All three original articles and original `/post/...` paths retained in full.
- Existing `/about` and `/blog` routes retained; compatibility pages and Netlify 301 rules provided for legacy routes.
- Keyboard-visible focus, native dropdown navigation and FAQs, collapsible mobile navigation with Escape handling, labeled fields, error messages, reduced-motion styles, and locally optimized photographs.
- Enquiry form with optional details, review state, mailto draft, and clipboard fallback. It clearly states that the enquiry has not yet been sent.

## Source observations — October 4, 2026

The supplied `MICHEALSHOE2000/travels` repository had no branches or files. The existing public site is Wix and does not share its source with this repository.

Reviewed the live Home, About, Team Members, and original journal page; retrieved the page and article sitemaps and all three original article HTML documents. The original home highlighted Italy, Disney, and Carnival, but did not establish current service availability or booking terms.

Verified published contact links:

- Name: **Sarah Harry**.
- Email link: **sarah_harry@gettravelwithsarah.com**.
- Phone link: **+1 563 690 8606**.
- Facebook: `https://www.facebook.com/profile.php?id=61594135268016`.
- X: `https://x.com/GetGuideSHarry`.

The original visible footer spelled the domain `getrravelwithsarah.com`; this redesign uses the address in the site’s email action links. Published contact links confirm what the website displays; inbox delivery, ownership, and current social access are not independently verified.

Biography facts come from Sarah’s existing About page: two decades in customer service, move into travel, husband, daughter, and four Pomsky dogs. Iowa location and the Archer Travel relationship were supplied in the approved brief. No invented reviews, credentials, prices, savings, exclusivity, guarantees, or fee policies are included.

## Sarah must confirm before public launch

1. Current planning/booking services for Disney, Carnival/other cruises, Italy/Europe, and custom travel. Destination pages currently describe inspiration, not bookable offers.
2. Exact planning process: intake, follow-up method, services included, fees, payment handling, and booking responsibilities. The current process section offers conversation guidance, not a promised operational workflow.
3. Phone number, email inbox, Facebook and X profile ownership, current availability, and acceptable response expectations. No response-time guarantee is published.
4. Preferred biography wording and explicit approval to continue using the existing family photos. Supply a higher-resolution solo portrait if desired.
5. Archer Travel’s required affiliate wording, agency disclosures, approved logo usage, and any booking-system links.
6. Approved form provider/destination and applicable privacy wording, including retention, sharing, and deletion/contact details. No unverified privacy-policy or booking-policy document has been published.
7. Booking terms, supplier cancellation terms, fees, insurance wording, and applicable policy documents/URLs.
8. Continued permission for original journal photography. See asset credits for new photography provenance.

## Technical limits and rollout

- **The existing Wix domain has not been replaced.** This is a private review deployment and a complete static source repository. Changing the original Wix site requires Wix access or migrating hosting and domain configuration. GitHub code cannot be deployed into Wix as a drop-in theme.
- **Direct form delivery is not configured.** The user sends the reviewed enquiry using their email app; no server receives or stores it. The interface never displays a false “sent” confirmation. A verified endpoint must be connected for one-click submission and end-to-end delivery testing.
- **Review mode is on:** `noindex, nofollow` and a disallowing robots file protect the review version. For the final public domain, approve content, change `review_mode` to `false`, confirm canonical origin, rebuild, and deploy.
- The Netlify configuration supports true 301 redirects. Static compatibility pages use immediate redirect fallbacks; the production host must support the supplied 301 rules or implement equivalents. Preserve the original three article slugs during migration.
- The existing member profile, booking-service, product, and category data is not in this repository. Review these separately before changing the original domain. The empty generic `/product-page` destination links are mapped to homepage inspiration in the compatibility plan.
- No live email was sent to Sarah during testing. Mailto inbox arrival and clipboard permission depend on the visitor’s device and email configuration.

## Verification

The build and JavaScript syntax check pass. The automated route/content audit checks all generated HTML, internal links/anchors/assets, the retained article text, form labels, image descriptions/dimensions, unique IDs, headings, descriptions, and local fonts. Interaction checks exercise menu toggling/Escape, filters, required/email/numeric/date validation, enquiry review, address encoding, and copy success/failure in an isolated DOM harness.

CSS includes layouts for the requested 360, 390, 768, 1024, and 1440 px targets with breakpoint changes at 600, 850, and 1100 px, fluid type, wrapping controls, and single-column small-screen forms.

**Browser visual QA is incomplete:** the environment does not expose the required control-browser skill for Sites preview, so screenshots and actual viewport/layout checks were not performed. Do not describe these widths as browser-tested. Before public domain migration, visually review every page at each target width, test keyboard and mobile menu behavior on devices, verify screen-reader announcements, and test the final connected form inbox end to end.
