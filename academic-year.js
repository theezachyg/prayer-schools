/*
 * academic-year.js
 * Single source of truth for the academic year + event dates shown across the site.
 *
 * The "21 Days of Prayer" event runs August 1-21. The academic year label
 * (e.g. "2026-2027") and the event year roll forward on MAY 1 each year, so
 * from May 1 onward the site promotes the UPCOMING academic year through summer.
 *
 * Examples (rollover on May 1):
 *   Jul 2026    -> 2026-2027, August 1-21, 2026
 *   Apr 30 2027 -> 2026-2027, August 1-21, 2026
 *   May 1 2027  -> 2027-2028, August 1-21, 2027
 *
 * Usage in HTML (visible text is pre-rendered so the page is correct even
 * before JS runs or if JS is disabled; the script re-renders and self-corrects):
 *   <p data-year-tpl="{{ACADEMIC_YEAR}} Academic Year">2026-2027 Academic Year</p>
 *   <title data-year-tpl="... {{ACADEMIC_YEAR}} ...">...</title>
 *   <meta data-year-attr="content" data-year-tpl="... {{EVENT_DATES}} ..." content="..." />
 *
 * Tokens:
 *   {{ACADEMIC_YEAR}} -> "2026-2027"
 *   {{EVENT_YEAR}}    -> "2026"
 *   {{EVENT_DATES}}   -> "August 1-21, 2026"
 *
 * Inline scripts can read the computed values from window.PRAYER_YEAR.
 */
(function () {
  var now = new Date();
  var year = now.getFullYear();
  // getMonth() is 0-indexed; 4 === May. On/after May 1, promote the next academic year.
  var startYear = now.getMonth() >= 4 ? year : year - 1;

  var tokens = {
    ACADEMIC_YEAR: startYear + "-" + (startYear + 1),
    EVENT_YEAR: String(startYear),
    EVENT_DATES: "August 1-21, " + startYear,
  };

  // Expose for inline scripts (e.g. share / email text).
  window.PRAYER_YEAR = tokens;

  function render(str) {
    return str.replace(
      /\{\{(ACADEMIC_YEAR|EVENT_YEAR|EVENT_DATES)\}\}/g,
      function (_, key) {
        return tokens[key];
      }
    );
  }

  function apply() {
    var nodes = document.querySelectorAll("[data-year-tpl]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var out = render(el.getAttribute("data-year-tpl"));
      var attr = el.getAttribute("data-year-attr");
      if (attr) {
        el.setAttribute(attr, out);
      } else {
        el.textContent = out;
      }
    }
    var titleEl = document.querySelector("title[data-year-tpl]");
    if (titleEl) document.title = titleEl.textContent;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
