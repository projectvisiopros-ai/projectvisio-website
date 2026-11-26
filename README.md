# ProjectVisio product website

A static website for potential buyers: what ProjectVisio does, the Free and Pro plans, security, and links to the web app and the Windows and Android downloads. It is plain HTML, CSS and a little JavaScript, with no build step, and it is designed to be hosted free on GitHub Pages.

## Why it lives in its own public repository

GitHub Pages is free for public repositories only (private repositories need a paid GitHub plan). Keep your ProjectVisio source code in its private repository, and put just this `website` folder in a separate public repository, for example `projectvisio-website`. Nothing in this folder is secret.

## 1. Publish the website

1. On GitHub, create a new **public** repository named `projectvisio-website`.
2. Upload the contents of this folder, not the folder itself, so that `index.html` sits at the top of the repository. On the repository page choose **Add file > Upload files**, drag in every file and the `fonts`, `images`, `media` and `demo` folders, and commit. (Uploading through the browser accepts files up to 25 MiB; everything here is far smaller.)
3. Open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the site is live at `https://<your-account>.github.io/projectvisio-website/`. The address is shown at the top of the Pages settings.

The empty `.nojekyll` file tells GitHub to publish the files exactly as they are. Keep it.

## 2. The downloads

The apps are served from the `downloads` folder of this repository:

- `downloads/ProjectVisio-Windows.exe` (portable Windows app, about 104 MB)
- `downloads/ProjectVisio-Android.apk` (Android 7.0 or later, about 93 MB)

GitHub refuses any single file over 100 MiB (104,857,600 bytes), and the Windows app is close to that limit. It fits because Windows builds leave out unused interface languages, binaries for other platforms and the database engine's source code (see `build.win.files` in the desktop app's `package.json`). If a future version no longer fits, publish it as a **Release** instead (Releases accept files up to 2 GiB): attach the files under the same names, and point `windowsDownload` and `androidDownload` in `config.js` at `https://github.com/<account>/projectvisio-website/releases/latest/download/<file name>`.

## 3. Point the site at your addresses

Edit `config.js` (on GitHub: open the file and choose the pencil icon), then commit. The site updates within a minute or two.

| Setting | What to enter |
| --- | --- |
| `appUrl` | Your deployed ProjectVisio server, for example `https://app.yourcompany.com`. Sign-up buttons go to its `/signup` page. |
| `windowsDownload` | `downloads/ProjectVisio-Windows.exe` (or a Release address, see section 2) |
| `androidDownload` | `downloads/ProjectVisio-Android.apk` (or a Release address, see section 2) |
| `windowsSigned` | `true` once the Windows app is code-signed; until then the page explains the Windows warning. |
| `proPrice` | How you sell Pro, for example `$29 per workspace per month`. Empty shows "Contact us for pricing". |
| `contactEmail` | Your sales or support address. Contact links stay hidden until this is set. |

Anything not set yet is shown as "available soon" or hidden, so visitors never reach a broken link.

## 4. The interactive demo (by request)

The demo page (`demo.html`) lets visitors request access by email (to `contactEmail` in `config.js`) and open the demo with an access code.

- The demo itself is stored only in encrypted form (`demo/demo.bin`, AES-256-GCM with a key derived from the access code by PBKDF2-SHA256, 600,000 rounds). The file is public, like everything on this site, but it cannot be read without the code.
- **Keep the access code out of this repository and out of any file here.** Send it by email only to organisations you approve.
- Anyone who has the code can pass it on. To revoke access, or for a new version of the demo, encrypt again with a new code and replace `demo/demo.bin`:

  ```bash
  # in the private projectvisio repository
  node tools/encrypt-demo.mjs ProjectVisio_Interactive_Demo.html ../projectvisio-website/demo/demo.bin
  ```

  The command prints the new code. The old code stops working as soon as the new file is published.

## 5. The walkthrough video

`media/projectvisio-walkthrough.mp4` plays without sound when the home page loads, with a button to turn the narration on; visitors who have asked their device to reduce motion see the cover image (`media/walkthrough-poster.webp`) and press play themselves. To replace the video, keep the same file name, keep it under 50 MB, and prepare it for streaming first: `ffmpeg -i new.mp4 -c copy -movflags +faststart media/projectvisio-walkthrough.mp4`. Captions are recommended: add a WebVTT file and a `<track>` element if you have a transcript.

## 6. Your own domain (optional)

In **Settings > Pages > Custom domain**, enter a domain such as `www.yourcompany.com` and create the DNS record GitHub shows you. Tick **Enforce HTTPS** once it becomes available.

## What is on the page

The layout follows the product-led structure common to modern B2B software sites: an announcement bar, a centred hero with two calls to action and a large product screenshot, a "who it's for" card grid, a tabbed product tour, app downloads, security pillars, pricing, questions and a closing call to action, with a multi-column footer.

- Every screenshot in `images/` is a real screen of ProjectVisio, captured with the demo data (fictional projects and people). Replace them by capturing the app at 1440 by 900 pixels and saving WebP files with the same names.
- Every feature described is something the product does today. Plans match what the app enforces: Free (up to 5 projects per workspace) and Pro (unlimited).
- There are deliberately no customer logos, statistics or testimonials. Add them only once you have real customers who have agreed to be named.
- Downloads include honest notes on the unsigned Windows app and on installing an APK. iPhone, Mac and Linux apps are listed as not available yet.

The font is Archivo (SIL Open Font License, see `fonts/OFL.txt`), served from this site, so the page makes no requests to other sites.
