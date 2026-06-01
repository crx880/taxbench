# TaxBench.ca (TB)

A static, editorial-style website for Canadian income tax information. Runs locally with no backend, no build tools, and no dependencies. Deploy to any web host by uploading the folder.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Quick Start — View Locally](#quick-start--view-locally)
3. [Local Admin Editor (Recommended)](#local-admin-editor-recommended)
   - [Starting the Editor](#starting-the-editor)
   - [Using the Editor](#using-the-editor)
   - [Editor Features](#editor-features)
4. [Editing and Maintaining the Site (Manually)](#editing-and-maintaining-the-site)
   - [Adding an Article](#adding-an-article)
   - [Removing an Article](#removing-an-article)
   - [Editing an Article](#editing-an-article)
   - [Updating Tax Rate Data](#updating-tax-rate-data)
   - [Editing the Estimator](#editing-the-estimator)
   - [Editing Page Content](#editing-page-content)
   - [Customizing the Design](#customizing-the-design)
4. [How the Estimator Works](#how-the-estimator-works)
5. [Newsletter Setup (Email Marketing)](#newsletter-setup-email-marketing)
6. [2026 Tax Rate Corrections](#2026-tax-rate-corrections)
7. [Deploying Live — Full Guide](#deploying-live--full-guide)
   - [Option A: Netlify (Recommended, Free)](#option-a-netlify-recommended-free)
   - [Option B: Cloudflare Pages (Free)](#option-b-cloudflare-pages-free)
   - [Option C: GitHub Pages (Free)](#option-c-github-pages-free)
   - [Option D: Traditional Web Host (cPanel, FTP)](#option-d-traditional-web-host-cpanel-ftp)
   - [Option E: VPS (Nginx / Apache)](#option-e-vps-nginx--apache)
   - [Setting Up a Custom Domain](#setting-up-a-custom-domain)
   - [Enabling HTTPS](#enabling-https)
8. [SEO Considerations](#seo-considerations)
9. [Images](#images)
10. [Browsers and Compatibility](#browsers-and-compatibility)
11. [License and Attribution](#license-and-attribution)

---

## Project Structure

```
tax/
├── index.html                      # Homepage
├── articles.html                   # Articles index page
├── tax-tips.html                   # Tax tips listing
├── personal-tax-rates.html         # Personal rates (federal + provincial tabs)
├── corporate-tax-rates.html        # Corporate rates by province
├── estimator.html                  # Interactive income tax estimator
├── about.html                      # About / contact page
├── privacy.html                    # Privacy policy
├── terms.html                      # Disclaimer and terms of use
│
├── articles/                       # Individual article pages
│   ├── 2026-federal-tax-brackets.html
│   ├── salary-vs-dividends.html
│   ├── rrsp-vs-tfsa.html
│   ├── corporate-tax-instalments.html
│   ├── tax-planning-mistakes.html
│   └── home-office-expenses.html
│
├── assets/
│   ├── css/
│   │   └── style.css               # All site styles (light/dark mode)
│   ├── js/
│   │   ├── main.js                 # Navigation, theme toggle
│   │   └── estimator.js            # Tax calculation engine + UI
│   ├── data/
│   │   ├── federal-2026.json       # Federal brackets, CPP, EI, credits
│   │   ├── provincial-2026.json    # Provincial brackets and rules
│   │   └── corporate-2026.json     # Corporate tax rates
│   └── images/
│       ├── hero-illustration.png
│       ├── icon-set.png
│       ├── estimator-illustration.png
│       ├── tax-rates-header.png
│       └── tax-updates-banner.png
```

Every file is plain HTML, CSS, and JavaScript. There are no frameworks, no build steps, no npm packages, and no server-side code. You can open any `.html` file directly in a browser.

---

## Quick Start — View Locally

### Fedora / Linux

```bash
# 1. Navigate to the project folder
cd /home/chris/Documents/tax

# 2. Start a local web server (Python 3)
python3 -m http.server 8080

# 3. Open your browser to
#    http://localhost:8080
```

### macOS

```bash
cd /path/to/tax
python3 -m http.server 8080
# Open http://localhost:8080
```

### Windows

```powershell
# PowerShell — navigate to the folder first
cd C:\path\to\tax
python -m http.server 8080
# Open http://localhost:8080
```

Alternatively, you can double-click `index.html` to open it directly in your browser. However, running a local server is preferred because it properly resolves relative paths and avoids CORS issues if you add features later.

### Alternative: PHP Built-in Server

```bash
php -S localhost:8080
# Open http://localhost:8080
```

### Alternative: Node.js

```bash
npx serve /home/chris/Documents/tax
```

---

## Local Admin Editor (Recommended)

A local web-based editor is included to manage articles, tax rates, and page content without editing raw HTML or JavaScript. The editor runs only on your machine (never deployed publicly) and saves changes directly to the site files.

### Starting the Editor

```bash
# First time: install dependencies
cd /home/chris/Documents/tax/editor
npm install

# Start the editor server
npm start
```

The editor runs at **http://localhost:3100**.

**Default password:** `cti-admin-2026`

**Change the password** by setting the environment variable before starting:

```bash
CTI_EDITOR_PASSWORD="your-password-here" npm start

# Or change the port:
CTI_EDITOR_PORT=3131 npm start
```

### Using the Editor

1. Open `http://localhost:3100` in your browser.
2. Log in with the password.
3. The dashboard has three sections:

#### Dashboard

Overview cards linking to Articles, Tax Rates, and Pages editors.

#### Articles

- **List view**: See all articles with Edit and Delete buttons.
- **New article**: Creates a new `.html` file in `articles/` from the existing article template. Fill in title, slug, kicker, date, subtitle, reading time, and body HTML. The article is automatically added to the articles index page (`articles.html`).
- **Edit article**: Loads any existing article, lets you edit its metadata and body HTML. Changes are saved directly to the file.
- **Delete article**: Removes the article file and removes its card from both the articles index and homepage.

#### Tax Rates

- Displays the embedded tax data from `assets/js/estimator.js` in an editable form.
- **Federal brackets**: Edit min, max, and rate for each bracket.
- **Federal credits**: Edit basic personal amount, BPA reduction threshold, capital gains inclusion rate, dividend gross-up rates, and dividend tax credit rates.
- **CPP and EI**: Edit contribution rates, maximums, and thresholds.
- **Provincial data**: Tabbed interface for all 13 provinces/territories. Edit each province's brackets, basic personal amount, and dividend tax credit rates. Ontario includes surtax thresholds and health premium tiers. Quebec includes the abatement rate.
- **Save All Rates** writes the updated data back to `assets/js/estimator.js`.

#### Pages

- Lists all site pages with an **Edit** button for raw HTML editing.
- Useful for making quick fixes or bulk edits to any page.

### Editor Features

| Feature | What it does |
|---|---|
| Article CRUD | Create, read, update, delete articles. Auto-updates `articles.html` index. |
| Tax rate editor | Visual table editor for all federal + provincial brackets, rates, credits, CPP, EI. |
| Page editor | Raw HTML editor for any site page. |
| Direct file I/O | All changes saved to the actual site files. Ready to deploy immediately. |
| Local only | Editor never deployed. Auth-protected. |

### Editor Project Structure

```
editor/
├── server.js             # Express backend (auth, file I/O)
├── package.json          # Dependencies (express, express-session)
├── login.html            # Login page
├── dashboard.html        # SPA shell
├── css/
│   └── editor.css        # Editor UI styles
└── js/
    └── editor-app.js     # Frontend SPA (routing, forms, API)
```

---

## Editing and Maintaining the Site (Manually)

### Adding an Article

1. **Create the article file** in `articles/`. Use a descriptive, URL-safe filename with hyphens:
   ```
   articles/my-new-article.html
   ```

2. **Copy the template structure** from any existing article (e.g., `articles/2026-federal-tax-brackets.html`). Every article page needs:
   - The `<!DOCTYPE html>` declaration
   - The `<head>` with meta tags, Google Fonts, CSS, and JS includes
   - The navigation bar (using `../` prefix for root-level links since articles are one level deep)
   - The `<article>` body with your content inside `<div class="container container-narrow article-body">`
   - A "Related Articles" section (optional)
   - The footer

3. **Write your content** between the `<div class="article-body">` tags. Use standard HTML elements:
   - `<h2>` and `<h3>` for subheadings
   - `<p>` for paragraphs
   - `<ul>` and `<ol>` for lists
   - `<table class="tax-table">` for data tables
   - `<div class="callout">` for sidebar callouts/notes

4. **Add the article card** to the articles index page (`articles.html`). Find the `<div class="article-grid">` section and add:
   ```html
   <a href="articles/my-new-article.html" class="article-card">
     <p class="article-card__kicker">Category Name</p>
     <h3 class="article-card__title">Your Article Title</h3>
     <p class="article-card__excerpt">A one-to-two sentence description of the article.</p>
     <div class="article-card__meta"><span>Month 2026</span><span>X min read</span></div>
   </a>
   ```

5. **Optionally add the article card** to the homepage (`index.html`) in the "Latest Articles" grid if it should appear there.

6. **Update any cross-references**: Existing articles link to related articles near the bottom. If your new article relates to existing ones, consider adding reciprocal links for navigation.

### Removing an Article

1. Delete the article file from `articles/`.
2. Remove its card from `articles.html` (the `<a class="article-card">` block).
3. Remove its card from `index.html` if it was featured there.
4. Search for references to the article filename in other article pages and update or remove those links:
   ```bash
   grep -r "my-old-article.html" /home/chris/Documents/tax/
   ```

### Editing an Article

Open the `.html` file in any text editor (VS Code, Sublime Text, vim, etc.) and edit the content inside `<div class="article-body">`. Save and refresh your browser.

### Updating Tax Rate Data

Tax rates are stored in two places:

#### 1. JSON Data Files (`assets/data/`)

These files document rates in a structured format for reference and for future programmatic use:

- **`federal-2026.json`** — Federal brackets, CPP rates, EI rates, basic personal amount, dividend tax credit rates.
- **`provincial-2026.json`** — Brackets and personal amounts for all 13 provinces and territories. Includes Ontario surtax and health premium rules, and Quebec abatement.
- **`corporate-2026.json`** — Federal and provincial corporate tax rates, small business limits.

Update these JSON files when new tax years are announced. Copy the files and rename them for new years (e.g., `federal-2027.json`).

#### 2. Embedded Tax Data in the Estimator (`assets/js/estimator.js`)

The estimator runs entirely client-side and embeds a copy of the tax data so it works without fetching JSON files. Open `assets/js/estimator.js` and find the `var TAX_DATA = { ... }` block (near the top). This object contains:

- `federal` — Brackets (min, max, rate), basic personal amount, BPA reduction threshold.
- `cpp` — Employee and self-employed CPP contribution rates, maximums, exemptions.
- `ei` — EI premium rate and maximum.
- `provinces` — One entry per province with brackets, basic personal amount, and any surtax/abatement/health premium rules.

To update for a new tax year:
1. Change the `year` value.
2. Update bracket thresholds and rates in both `federal.brackets` and each `provinces.X.brackets`.
3. Update `basicPersonalAmount` values.
4. Update `cpp` and `ei` rates and maximums.
5. Update Ontario `surtax` thresholds and `healthPremium` tiers if they change.
6. Update Quebec `abatementRate` if it changes.

The bracket format uses `Infinity` for the upper bound of the last bracket:
```javascript
{ min: 0, max: 58924, rate: 0.15 },
{ min: 58925, max: Infinity, rate: 0.33 }
```

#### 3. Rate Tables on Static Pages

The `personal-tax-rates.html` and `corporate-tax-rates.html` pages contain hardcoded HTML tables. When rates change, update the `<table>` bodies in those files to match.

### Editing the Estimator

The estimator logic lives in `assets/js/estimator.js`. It is structured into clear sections:

| Section | Purpose |
|---|---|
| `TAX_DATA` | All tax brackets, rates, credits (update yearly) |
| `calcBracketTax()` | Progressive bracket tax calculation |
| `calcCPP()` | CPP contribution calculation |
| `calcEI()` | EI premium calculation |
| `calcOntarioSurtax()` | Ontario surtax on provincial tax |
| `calcOntarioHealthPremium()` | Ontario Health Premium tier lookup |
| `calculate()` | Main function — orchestrates everything |
| `fmtDollar()` / `fmtPercent()` | Number formatting helpers |
| `renderResults()` | Builds the HTML for the results display |
| `init()` | Wires up the form, toggle, and events |

To add a new province feature (e.g., a provincial tax credit), add the calculation in `calculate()`, store the result in the return object, and update `renderResults()` to display it.

### Editing Page Content

All pages are plain HTML. The key content areas:

| Page | File | Edit |
|---|---|---|
| Home | `index.html` | Hero section, featured articles, tips teasers, newsletter |
| Articles index | `articles.html` | Article card grid |
| Tax tips | `tax-tips.html` | Tip card blocks (`<div class="tip-card">`) |
| Personal rates | `personal-tax-rates.html` | Federal table + province panel tables |
| Corporate rates | `corporate-tax-rates.html` | Corporate rate tables |
| Estimator | `estimator.html` | Form fields, callout text |
| About | `about.html` | Body text, contact email |
| Privacy | `privacy.html` | Policy text |
| Terms | `terms.html` | Disclaimer text |

### Customizing the Design

All styles are in `assets/css/style.css`. The design uses CSS custom properties (variables) defined in `:root` (light mode) and `[data-theme="dark"]` (dark mode).

**Quick changes you can make by editing the `:root` block:**

```css
:root {
  --color-accent: #0d7377;        /* Change accent colour (default: teal) */
  --color-accent-hover: #095c5f;
  --font-serif: ...;                /* Change heading font */
  --font-sans: ...;                 /* Change body font */
  --max-width-content: 42rem;       /* Change content width */
}
```

**Colour palette reference:**
- `--color-bg`: Page background
- `--color-bg-alt`: Alternate section background (footer, newsletter)
- `--color-bg-card`: Card / estimator background
- `--color-text`: Primary text colour
- `--color-text-secondary`: Secondary text
- `--color-text-muted`: Muted / caption text
- `--color-accent`: Accent colour (used on links, buttons, borders)
- `--color-border`: Main border colour
- `--color-border-light`: Lighter border for cards

**Typography:**
The site loads three Google Fonts in every page head:
- **Source Serif 4** — Headings (`--font-serif`)
- **Inter** — Body text (`--font-sans`)
- **JetBrains Mono** — Code, tax rates, estimator results (`--font-mono`)

To change fonts, update the Google Fonts `<link>` tags in each HTML file's `<head>` and update the corresponding CSS variables.

---

## How the Estimator Works

The estimator (`estimator.html` + `assets/js/estimator.js`) calculates personal income tax client-side:

1. **Inputs**: The user enters annual taxable income, selects a province/territory, and toggles between employment and self-employment.

2. **Federal Tax**: Income is run through the five federal brackets progressively. The basic personal amount credit is applied. For incomes above $177,882, the BPA is reduced on a sliding scale.

3. **Provincial Tax**: Income is run through the province's brackets progressively. The provincial basic personal amount credit is applied using the lowest provincial bracket rate.

4. **Special Rules**:
   - **Ontario**: Surtax (20% on provincial tax over $5,230; additional 36% on tax over $6,694) and Health Premium ($0–$900 based on income tier).
   - **Quebec**: The 16.5% Quebec Abatement reduces federal tax. The estimator uses CPP (not QPP) for simplicity — note this on page.

5. **Payroll Contributions**:
   - CPP: 5.95% on earnings from $3,500–$68,500 for employees (max $4,034). Self-employed: 11.9% (max $8,068).
   - EI: 1.63% on earnings up to $68,500 for employees (max $1,118). Self-employed: $0.

6. **Output**: Total tax, after-tax income, federal tax, provincial tax, surtax/health premium (if ON), Quebec abatement (if QC), CPP, EI, average rate, and combined marginal rate.

The calculation is modular: `calculate()` returns a plain JavaScript object, and `renderResults()` converts it to HTML. You can reuse `calculate()` elsewhere by calling it directly.

Currently the estimator does **not** account for: spousal credits, age credits, disability credits, tuition credits, medical expense credits, RRSP deductions, child care deductions, union dues, employment expenses, Canada Workers Benefit, GST/HST credit, Climate Action Incentive, dividend tax credits, or capital gains. These can be added as optional fields in the future.

---

## Newsletter Setup (Email Marketing)

The newsletter form on the homepage and estimator page is currently static HTML. The `<form>` tag has `action="#"` and does not submit to any service.

### Connecting to an Email Service

#### Option 1: Netlify Forms (easiest if deploying to Netlify)

Netlify automatically detects HTML forms. Change the form tag:

```html
<form class="newsletter-form" name="newsletter" method="post" data-netlify="true">
  <input type="hidden" name="form-name" value="newsletter">
  <label for="newsletter-email" class="visually-hidden">Email address</label>
  <input id="newsletter-email" class="newsletter-form__input" type="email" name="email"
         placeholder="Your email address" required autocomplete="email">
  <button class="btn btn--primary" type="submit">Subscribe</button>
  <!-- consent text stays as-is -->
</form>
```

Deploy to Netlify and form submissions appear in your Netlify dashboard. No backend code needed.

#### Option 2: Buttondown

```html
<form class="newsletter-form"
      action="https://buttondown.email/api/emails/embed-subscribe/YOUR_USERNAME"
      method="post" target="_blank">
```

Replace `YOUR_USERNAME` with your Buttondown username.

#### Option 3: ConvertKit

```html
<form class="newsletter-form"
      action="https://app.convertkit.com/forms/YOUR_FORM_ID/subscriptions"
      method="post">
```

Replace `YOUR_FORM_ID` with your ConvertKit form ID.

#### Option 4: MailerLite

```html
<form class="newsletter-form"
      action="https://assets.mailerlite.com/jsonp/YOUR_ACCOUNT_ID/forms/..."
      method="post">
```

The exact action URL comes from your MailerLite embedded form code.

### CASL Compliance

The consent text under the email input already complies with Canada's Anti-Spam Legislation (CASL). It:
- States that subscribing means agreeing to receive emails
- Confirms CASL compliance
- Notes the ability to unsubscribe at any time
- Links to the privacy policy

When connecting a live email service, make sure your service also supports unsubscribe headers and double opt-in.

---

## 2026 Tax Rate Corrections

The initial estimator data contained bracket threshold errors. These have been corrected as follows:

### Federal Brackets (Fixed)

| Before (Wrong) | After (Correct) |
|---|---|
| $182,676 &ndash; $260,206 @ 29% | $182,686 &ndash; $260,256 @ 29% |
| $260,207+ @ 33% | $260,257+ @ 33% |

The issue: bracket thresholds were manually approximated instead of properly computing `2025_value × 1.027` (the ~2.7% CPI indexation factor). The corrected federal and all provincial brackets now use `Math.round(2025 × 1.027)`.

### Provincial Brackets (Fixed)

All 13 provinces/territories had 2025 bracket thresholds. Each bracket has been corrected:

| Province | Key fix |
|---|---|
| Ontario | $51,446 → $52,835 (first bracket), all tiers updated |
| British Columbia | $47,937 → $49,231, all 7 tiers updated |
| Alberta | $151,234 → $155,317, all 5 tiers updated |
| Quebec | $51,780 → $53,178, all 4 tiers updated |
| All others | All province bracket thresholds indexed by 1.027 |

### How to Verify or Adjust Rates

Use the **Local Admin Editor** (see above) to:
1. Review all bracket thresholds and rates in the Tax Rates tab
2. Compare against official CRA publications when available
3. Make corrections and save — changes go directly into `assets/js/estimator.js`

The editor also updates the JSON data files (`assets/data/federal-2026.json`, `assets/data/provincial-2026.json`) when rates are saved.

---

## Deploying Live — Full Guide

The site is pure static files: HTML, CSS, JS, JSON, and images. You can host it anywhere that serves static files.

### Option A: Netlify (Recommended, Free)

Netlify offers free hosting with automatic HTTPS, a global CDN, form handling, and continuous deployment from Git.

**Deploy by drag-and-drop (quickest):**

1. Go to [netlify.com](https://www.netlify.com) and sign up (free).
2. From the Netlify dashboard, go to **Sites**.
3. Drag the entire `tax/` folder onto the dashed upload area.
4. Netlify deploys the site and gives you a temporary URL like `random-name.netlify.app`.
5. To redeploy after changes, drag the folder again.

**Deploy via Git (recommended for ongoing updates):**

```bash
# 1. Initialize a Git repository in the project folder
cd /home/chris/Documents/tax
git init
git add .
git commit -m "Initial commit — TaxBench.ca site"

# 2. Create a repository on GitHub, GitLab, or Bitbucket
#    (do not initialize with a README — you already have files)

# 3. Push to the remote
git remote add origin https://github.com/YOUR_USERNAME/tax.git
git branch -M main
git push -u origin main
```

Then in Netlify:
1. Click **Add new site** → **Import an existing project**.
2. Connect your Git provider and select the repository.
3. Leave the build command blank and the publish directory as `/` (root).
4. Click **Deploy site**.

Netlify will automatically redeploy whenever you push to the repository.

**Netlify Forms (optional):**
Add `data-netlify="true"` to the newsletter form as described in the [Newsletter Setup](#newsletter-setup-email-marketing) section.

### Option B: Cloudflare Pages (Free)

Cloudflare Pages offers unlimited bandwidth on the free tier with global CDN.

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and sign up.
2. Connect your Git repository (GitHub or GitLab).
3. Configure the project:
   - **Build command**: (leave blank)
   - **Output directory**: `/`
4. Click **Save and Deploy**.

### Option C: GitHub Pages (Free)

1. Push the project to a GitHub repository.
2. Go to the repository **Settings** → **Pages**.
3. Under **Source**, select **Deploy from a branch**, choose `main`, and set the folder to `/` (root).
4. Click **Save**. The site will be available at `https://YOUR_USERNAME.github.io/tax/`.

**Note**: GitHub Pages serves from the repository root. All links in the site use relative paths, so it works correctly without a custom domain.

### Option D: Traditional Web Host (cPanel, FTP)

For hosts like Bluehost, HostGator, Namecheap, GoDaddy, or any shared hosting with cPanel:

1. Log into your hosting control panel (cPanel).
2. Open **File Manager** or use an FTP client (FileZilla, Cyberduck, etc.).
3. Navigate to the `public_html/` or `www/` directory (this is the web root).
4. Upload all files and folders from the `tax/` directory, preserving the folder structure.

```
public_html/
├── index.html
├── articles.html
├── articles/
│   ├── 2026-federal-tax-brackets.html
│   └── ...
├── assets/
│   ├── css/
│   ├── js/
│   ├── data/
│   └── images/
└── ...
```

If you want the site in a subdirectory (e.g., `public_html/tax/`), upload the entire `tax/` folder into `public_html/`. The site will be accessible at `https://yourdomain.com/tax/`.

**FTP Upload (example using lftp):**

```bash
lftp -u your_username,your_password ftp.yourdomain.com
mirror -R /home/chris/Documents/tax/ /public_html/
```

### Option E: VPS (Nginx / Apache)

If you have a VPS running Linux (Fedora, Ubuntu, Debian, etc.):

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/tax;

    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Optional: serve .html files without extension
    # location / {
    #     try_files $uri $uri.html $uri/ =404;
    # }

    # Cache static assets
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Deploy to VPS:**

```bash
# Copy files to the server
rsync -avz /home/chris/Documents/tax/ user@your-server:/var/www/tax/

# Set permissions
ssh user@your-server
sudo chown -R www-data:www-data /var/www/tax
sudo chmod -R 755 /var/www/tax

# Restart Nginx
sudo systemctl restart nginx
```

### Setting Up a Custom Domain

Regardless of your hosting platform, the process is the same:

1. **Buy a domain** from any registrar (Namecheap, Cloudflare Registrar, Google Domains, GoDaddy, etc.).

2. **Point the domain to your host**:
   - **Netlify**: Go to Site Settings → Domain Management → Add custom domain. Enter your domain. Netlify provides the DNS records you need to add at your registrar.
   - **Cloudflare Pages**: Go to your Pages project → Custom domains → Set up a custom domain.
   - **GitHub Pages**: Go to repository Settings → Pages → Custom domain. Add your domain.
   - **Traditional host**: In your registrar's DNS settings, add an A record pointing to your host's IP address. Your host will provide the IP.

3. **DNS Records** (typical setup):
   ```
   Type    Name    Value                  TTL
   A       @       YOUR_HOST_IP           3600
   CNAME   www     yourdomain.com         3600
   ```

4. Wait for DNS propagation (can take up to 48 hours, usually minutes).

### Enabling HTTPS

- **Netlify, Cloudflare Pages, GitHub Pages**: HTTPS is automatic with a valid custom domain. No configuration needed.
- **Traditional host**: Most hosts provide free Let's Encrypt certificates through cPanel. Look for "SSL/TLS" or "Let's Encrypt" in your control panel.
- **VPS with Nginx**: Use Certbot to obtain a free Let's Encrypt certificate.

```bash
# On your VPS (Fedora example)
sudo dnf install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Certificates auto-renew via systemd timer
```

---

## SEO Considerations

Each page includes:

- **Page title** (`<title>`) with relevant keywords
- **Meta description** (`<meta name="description">`)
- **Open Graph tags** (`og:title`, `og:description`, `og:type`, `og:url`) for social media previews
- **Article pages** include `article:published_time` for structured data
- **Semantic HTML**: `<nav>`, `<main>`, `<article>`, `<header>`, `<section>`, `<footer>`
- **Heading hierarchy**: One `<h1>` per page, nested `<h2>`/`<h3>` as appropriate
- **Alt text** on images (the hero illustration uses `alt=""` because it is decorative)
- **Lazy loading** (`loading="lazy"`) on below-the-fold images

To improve SEO further:
1. Register the site with [Google Search Console](https://search.google.com/search-console).
2. Add a `sitemap.xml` file (see below).
3. Add a `robots.txt` file (see below).
4. Submit the sitemap URL in Google Search Console.

**Example `sitemap.xml`** (place in project root):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://yourdomain.com/</loc><priority>1.0</priority></url>
  <url><loc>https://yourdomain.com/articles.html</loc><priority>0.8</priority></url>
  <url><loc>https://yourdomain.com/tax-tips.html</loc><priority>0.7</priority></url>
  <url><loc>https://yourdomain.com/personal-tax-rates.html</loc><priority>0.9</priority></url>
  <url><loc>https://yourdomain.com/corporate-tax-rates.html</loc><priority>0.8</priority></url>
  <url><loc>https://yourdomain.com/estimator.html</loc><priority>0.9</priority></url>
  <url><loc>https://yourdomain.com/articles/2026-federal-tax-brackets.html</loc><priority>0.8</priority></url>
  <url><loc>https://yourdomain.com/articles/salary-vs-dividends.html</loc><priority>0.7</priority></url>
  <url><loc>https://yourdomain.com/articles/rrsp-vs-tfsa.html</loc><priority>0.7</priority></url>
  <url><loc>https://yourdomain.com/articles/corporate-tax-instalments.html</loc><priority>0.7</priority></url>
  <url><loc>https://yourdomain.com/articles/tax-planning-mistakes.html</loc><priority>0.7</priority></url>
  <url><loc>https://yourdomain.com/articles/home-office-expenses.html</loc><priority>0.6</priority></url>
</urlset>
```

**Example `robots.txt`** (place in project root):

```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## Images

Images are in `assets/images/`. All five images were sourced for the project and renamed with clean, web-safe filenames:

| File | Use |
|---|---|
| `hero-illustration.png` | Homepage hero section (decorative) |
| `icon-set.png` | Reserved for future icon use |
| `estimator-illustration.png` | Reserved for estimator page |
| `tax-rates-header.png` | Reserved for tax rates pages |
| `tax-updates-banner.png` | Reserved for updates/news section |

**To add new images:**
1. Place the file in `assets/images/` with a clean, lowercase, hyphenated filename.
2. Reference it in HTML with a relative path:
   ```html
   <img src="assets/images/my-image.png" alt="Description of image" width="800" height="600" loading="lazy">
   ```
3. Always include `alt` text (use `alt=""` only for purely decorative images).
4. Always include `width` and `height` attributes to prevent layout shift.

**Image optimization tips before deploying:**
- Convert PNGs to WebP or optimized PNG using tools like `cwebp`, `pngquant`, or online optimizers.
- Keep hero images under 200 KB.
- Use responsive images if you want to serve different sizes to different screens.

---

## Browsers and Compatibility

The site uses modern CSS features (custom properties, Grid, Flexbox) and is tested to work in:

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- Mobile Safari and Chrome (iOS / Android)

The site does not support Internet Explorer. No polyfills are included.

Dark mode respects the `prefers-color-scheme: dark` media query on first visit and saves the user's preference in `localStorage` for return visits.

---

## License and Attribution

The site code and content are provided as-is for the project. When publishing publicly:

- Verify tax data against official CRA publications before presenting as current.
- Add your own privacy policy contact email addresses (currently placeholder: `hello@cti.example.com`, `privacy@cti.example.com`).
- Replace social media OG URLs from `https://www.example.com/` to your actual domain before going live.
- Add your own Google Analytics or privacy-focused analytics tag if you want visitor metrics.

---

## Quick Reference: File Purposes

| File | What it does |
|---|---|
| `index.html` | Homepage — hero, article grid, tips, newsletter |
| `articles.html` | List of all articles as cards |
| `tax-tips.html` | List of 10 quick tax tips |
| `personal-tax-rates.html` | Federal + provincial bracket tables with tabbed province selector |
| `corporate-tax-rates.html` | Corporate rates table by province |
| `estimator.html` | Tax calculator form and results display |
| `about.html` | About the site, contact info |
| `privacy.html` | Privacy policy including CASL compliance |
| `terms.html` | Disclaimer and terms of use |
| `assets/css/style.css` | All visual styling, layout, light/dark mode |
| `assets/js/main.js` | Mobile nav toggle, theme persistence, active link highlighting |
| `assets/js/estimator.js` | Tax calculation engine and UI binding |
| `assets/data/*.json` | Structured tax rate reference data |
| `assets/images/*.png` | Site illustrations and banners |
