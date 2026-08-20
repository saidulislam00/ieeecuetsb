# IEEE CUET Student Branch — Official Website

> The website of the IEEE Student Branch at Chittagong University of Engineering & Technology.
> **Live at [ieeecuetsb.org](https://ieeecuetsb.org)**

This guide explains how the website is put together — in plain language, for anyone on the
team, technical or not. If you have ever wondered *"where does that page come from?"* or
*"who do I ask to change a name?"*, start here.

---

## What this website is

A **static website** — 36 pages of ready-made HTML that a web server hands straight to a
visitor's browser. There is no database and no login system.

Think of it like a **printed magazine** rather than a live TV broadcast: every page already
exists, finished and complete. That makes the site fast, nearly free to host, and almost
impossible to break. The trade-off is that changes happen by editing files and publishing
them, not by logging into an admin panel.

---

## The site at a glance

```
ieeecuetsb.org
│
├── Home ······················ the front page: hero, societies, events, achievements
│
├── About
│   ├── /ieee/ ················ what IEEE is, worldwide
│   ├── /ieeebd/ ·············· the IEEE Bangladesh Section
│   └── /ieeecuetsb/ ·········· our own Student Branch, and its committee
│
├── Societies & Chapters ······ one page each, in the society's own colours
│   ├── /wie/ ················· Women in Engineering Affinity Group   (pink)
│   ├── /ras/ ················· Robotics and Automation Society       (orange)
│   ├── /pes/ ················· Power and Energy Society              (green)
│   ├── /embs/ ················ Engineering in Medicine and Biology   (coral)
│   ├── /photonics/ ··········· Photonics Society                     (violet)
│   ├── /sps/ ················· Signal Processing Society             (cyan)
│   └── /aps/ ················· Antennas and Propagation Society      (purple)
│
├── Executive Committees ······ 8 bodies × 3 sessions = 24 pages
│   └── /<society>/excom/<year>/     e.g. /wie/excom/2026-27/
│
└── /sciblitz/ ················ standalone microsite for the SciBlitz 2.0 event
```

Every society page follows the **same layout** — hero, about, mission & vision, events,
committee — so the site feels like one family rather than seven unrelated websites. Only
the accent colour and the content change.

---

## How it is organised behind the scenes

Everything shared lives in the **`assets/`** folder, so a change made once appears
everywhere:

| Folder | What lives there | Everyday meaning |
| --- | --- | --- |
| `assets/data/` | Committee rosters | **The most important folder.** One file per session |
| `assets/js/` | Small scripts | Build the menu, footer and committee cards |
| `assets/css/` | Styling | Colours, fonts, spacing, mobile layout |
| `assets/images/` | Logos and photos | Society marks and event pictures |

### The committee rosters — one file, many pages

This is the part worth understanding, because it saves the most work.

Every Executive Committee list on the site is generated from a **single file per session**:

```
assets/data/excom-2025-26.json
assets/data/excom-2026-27.json
```

Each file is a plain, readable list of people — name, role, department, photo. The website
reads it and draws the cards automatically.

> **Why this matters:** to correct a spelling, change a designation or add a photo, you edit
> **one line in one file**. Every page showing that person updates at once. Nobody has to
> hunt through 24 pages hoping they caught them all.

The same idea applies to the **navigation menu** and the **footer**: each is written once
and shared by every page, so they can never drift out of step.

---

## What we have done

A recent round of work focused on accuracy, consistency and mobile use.

**Fixed the committee records**
- The 2025-26 page was showing the **2026-27 officers** under a 2025-26 heading. Both
  sessions were rebuilt from the signed ExCom PDFs, and all **241 names were checked
  against the source documents** — not typed from memory.
- Rosters moved out of scattered page code into the two data files described above.

**Brought in real photographs**
- Members' cards previously showed generated initials and abstract patterns. Real portraits
  are now used — **110 of 114** people for 2025-26 and **102 of 127** for 2026-27, drawn
  from the information-collection forms and matched by name.
- Photos are served straight from Google Drive, so nothing is copied into the repository and
  the site stays small.

**Made every page consistent**
- One shared footer across all 36 pages, replacing copies that had quietly drifted apart —
  one still carried a 2024 copyright and dead social links.
- The menu now spells out full society names ("Power and Energy Society" rather than "PES").
- Society logos are presented on a uniform plate, each sized so a wide wordmark and a square
  emblem carry the same visual weight.

**Improved the experience on phones**
- Removed the sideways scrolling that affected every society Executive Committee page.
- Enlarged buttons and links so they are comfortable to tap.
- Committee cards now arrange themselves so nobody is left stranded alone on a row.

**Faster to load**
- Oversized images were re-sized. The society logos alone dropped from **8.3 MB to under
  1 MB**, with one 6 MB file becoming 70 KB — a real difference on mobile data.

---

## What is planned next

**Content still to gather**
- **Photographs for about 25 people** in the 2026-27 committee — mainly nine RAS members who
  have not yet submitted one, plus several faculty moderators. Four are outstanding for
  2025-26. Once collected, they slot straight into the roster files.
- **The 2024-25 Executive Committee.** Those pages exist and are wired up, but currently show
  a "not published yet" note because the roster has not been supplied.

**Corrections queued**
- Six event photographs on the **PES and SPS** pages point at a folder that does not exist,
  so those images are blank.
- The **WIE** page lists faculty who differ from the signed 2026-27 document and needs
  refreshing.
- A few empty links left over on the SPS page should be tidied away.

**Improvements under consideration**
- Make the **"Join IEEE"** button reachable on phones — it is currently hidden on small
  screens, exactly where most visitors are.
- Give the **SciBlitz** microsite the shared footer, so it matches the rest of the site.
- Publish committee lists for future sessions using the same data files, so each new
  session is a copy-and-edit rather than a rebuild.

---

## Viewing the site on your own computer

The pages link to each other using absolute paths, so opening a file directly will look
broken. Run a tiny local server instead — one command, nothing to install:

```bash
python -m http.server 5500
```

Then open **http://localhost:5500** in your browser. Press `Ctrl + C` in the terminal to stop.

> **Tip:** if a change does not appear, your browser is showing a saved copy.
> Press `Ctrl + F5` to force a fresh load.

---

## Making a change

| I want to… | Go to |
| --- | --- |
| Fix a name, role or photo | `assets/data/excom-<year>.json` |
| Change the footer | `assets/js/site-footer.js` |
| Change the menu | the navigation block in each page, and `assets/js/excom-page.js` |
| Edit a society's own content | that society's `index.html` |
| Adjust colours or spacing | the matching file in `assets/css/` |

---

<div align="center">

**IEEE CUET Student Branch**
Chittagong University of Engineering & Technology · Chattogram 4349, Bangladesh

Designed & developed by the **IEEE CUET SB Web Development Team**

</div>
