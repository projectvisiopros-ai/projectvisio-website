# ProjectVisio product website

A static website for potential buyers: what ProjectVisio does, the Free and Pro plans, security, and links to the web app and the Windows and Android downloads. It is plain HTML, CSS and a little JavaScript, with no build step, and it is designed to be hosted free on GitHub Pages.

## Why it lives in its own public repository

GitHub Pages is free for public repositories only (private repositories need a paid GitHub plan). Keep your ProjectVisio source code in its private repository, and put just this `website` folder in a separate public repository, for example `projectvisio-website`. Nothing in this folder is secret.

## 1. Publish the website

1. On GitHub, create a new **public** repository named `projectvisio-website`.
2. Upload the contents of this folder, not the folder itself, so that `index.html` sits at the top of the repository. On the repository page choose **Add file > Upload files**, drag in every file and the `fonts` and `images` folders, and commit. (Uploading through the browser accepts files up to 25 MiB; everything here is far smaller.)
3. Open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the site is live at `https://<your-account>.github.io/projectvisio-website/`. The address is shown at the top of the Pages settings.

The empty `.nojekyll` file tells GitHub to publish the files exactly as they are. Keep it.

## 2. Add the downloads

App files are too large to keep in the repository itself (GitHub blocks files over 100 MiB), so they go in a **Release**:

1. In the website repository, open **Releases > Draft a new release**.
2. Create a tag such as `v0.1.0` and a title such as `ProjectVisio 0.1.0`.
3. Attach the app files with exactly these names, so the links on the site never need to change:
   - `ProjectVisio-Windows.exe`
   - `ProjectVisio-Android.apk` (from the *Build Android app* workflow in your private repository)
4. Publish the release.

For a new version, publish a new release with files of the same names. The links always fetch the files from the latest release.

## 3. Point the site at your addresses

Edit `config.js` (on GitHub: open the file and choose the pencil icon), then commit. The site updates within a minute or two.

| Setting | What to enter |
| --- | --- |
| `appUrl` | Your deployed ProjectVisio server, for example `https://app.yourcompany.com`. Sign-up buttons go to its `/signup` page. |
| `windowsDownload` | `https://github.com/<your-account>/projectvisio-website/releases/latest/download/ProjectVisio-Windows.exe` |
| `androidDownload` | `https://github.com/<your-account>/projectvisio-website/releases/latest/download/ProjectVisio-Android.apk` |
| `windowsSigned` | `true` once the Windows app is code-signed; until then the page explains the Windows warning. |
| `proPrice` | How you sell Pro, for example `$29 per workspace per month`. Empty shows "Contact us for pricing". |
| `contactEmail` | Your sales or support address. Contact links stay hidden until this is set. |

Anything not set yet is shown as "available soon" or hidden, so visitors never reach a broken link.

## 4. Your own domain (optional)

In **Settings > Pages > Custom domain**, enter a domain such as `www.yourcompany.com` and create the DNS record GitHub shows you. Tick **Enforce HTTPS** once it becomes available.

## What is on the page

The layout follows the product-led structure common to modern B2B software sites: an announcement bar, a centred hero with two calls to action and a large product screenshot, a "who it's for" card grid, a tabbed product tour, app downloads, security pillars, pricing, questions and a closing call to action, with a multi-column footer.

- Every screenshot in `images/` is a real screen of ProjectVisio, captured with the demo data (fictional projects and people). Replace them by capturing the app at 1440 by 900 pixels and saving WebP files with the same names.
- Every feature described is something the product does today. Plans match what the app enforces: Free (up to 5 projects per workspace) and Pro (unlimited).
- There are deliberately no customer logos, statistics or testimonials. Add them only once you have real customers who have agreed to be named.
- Downloads include honest notes on the unsigned Windows app and on installing an APK. iPhone, Mac and Linux apps are listed as not available yet.

The font is Archivo (SIL Open Font License, see `fonts/OFL.txt`), served from this site, so the page makes no requests to other sites.
