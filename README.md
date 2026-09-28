# haorantang.github.io

Personal homepage of Haoran Tang, built with Jekyll and hosted on GitHub Pages.
Every push to `main` goes live in about a minute.

## How to update things

| What | Where | Easiest way |
| --- | --- | --- |
| Homepage text (welcome, research, services, misc) | `index.md` | Edit on GitHub (pencil icon), works on a phone too |
| Publications | `_data/publications.yml` | [/upload.html](https://haorantang.github.io/upload.html) → **Publication** tab, or edit the file |
| CV | `assets/files/Haoran_Tang_CV.pdf` | [/upload.html](https://haorantang.github.io/upload.html) → **CV** tab (replaces the PDF) |
| Cat photos | `_data/cats.yml` + `assets/img/cats/` | [/upload.html](https://haorantang.github.io/upload.html) → **Cat photos** tab |
| Cats page text | `dollydayko.md` | Edit on GitHub |
| Name, position, email, icons, profile photo | `_config.yml` | Edit on GitHub |
| Top bar items | `_data/nav.yml` | Edit on GitHub |

The upload page resizes photos, removes their location data, and commits for you.
It needs a GitHub token once per device (instructions are on the page).

## Visitor stats (private)

- Map at the bottom of the homepage: [MapMyVisitors](https://mapmyvisitors.com/b/login) (sign in with Google).
  Visitors only see the small map; clicking it opens the login page.
- Detailed stats: [Google Analytics](https://analytics.google.com/) (property `G-ZYJJ5WFBF3`).

## Folder layout

```
_config.yml              site settings (name, links, analytics)
index.md                 homepage text
dollydayko.md            cats page text
upload.html              private page for uploading photos / CV / publications
_data/
  publications.yml       publication list
  cats.yml               cat photo list (managed by upload.html)
  nav.yml                top bar
_includes/               publications.html, cat-gallery.html (templates)
_layouts/homepage.html   page template
_sass/, assets/css/      styles (extras.css = top bar, cats album, visitor map)
assets/js/               top bar + photo viewer scripts
assets/vendor/photoswipe full-screen photo viewer (MIT)
assets/files/            CV
assets/img/              profile photo, favicons
assets/img/pubs/         publication teaser images
assets/img/cats/         cat photos (+ thumbs/ for the grid)
```

## Preview locally (optional)

```
bundle install
bundle exec jekyll serve
```
then open http://localhost:4000.

Design based on the [Minimal Light](https://github.com/yaoyao-liu/minimal-light) theme (CC0).
