# The Zone

React/Vite anime search and weather demo.

## Run and check

```sh
npm ci
npm run dev
npm test
npm run build
```

Vite's local middleware serves `/api/anime` using the same handler as the Vercel Function. On Vercel, `api/anime.js` is deployed as a function; the SPA rewrite supports direct visits and refreshes on `/anime` and `/weather`.

Anime searches use a same-origin endpoint that forwards a bounded query to Jikan. Successful responses may be CDN-cached for five minutes. Upstream failures and rate limits are not cached. Requests have timeouts; navigating away or starting another search cancels the previous client request. Find and Retry live search both support submitting the same title again.

During an outage, the interface displays clearly labelled title-only sample entries. They do not include fabricated ratings, artwork or episode counts, and are never presented as live results. A successful live search with zero matches remains a genuine empty result.

The external Jikan service can still be unavailable or rate-limited. The sample mode keeps the interface demonstrable during that period. Weather uses its existing Open-Meteo integration.
