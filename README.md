# Your Name — Poems & Writings

A warm, cozy portfolio site for poems and prose. Plain HTML/CSS, no build tools, no dependencies to install.

## Files

```
writer-portfolio/
├── index.html      ← homepage (hero, featured poem, recent picks)
├── poems.html       ← full poems archive
├── writings.html     ← essays / prose archive
├── about.html       ← bio + contact links
└── css/style.css    ← all styling, one file
```

## How to customize

1. **Your name** — find/replace `Your Name` across all four `.html` files.
2. **Bio & photo** — edit `about.html`. Swap the placeholder box under `.about-portrait` for a real `<img src="img/your-photo.jpg">` (drop your photo in the `img` folder first).
3. **Poems** — open `poems.html`. Each poem lives in its own `<article class="piece poem">` block. Copy/paste that block to add more, delete the ones you don't need.
4. **Essays** — same idea in `writings.html`, using `<article class="piece">`.
5. **Homepage cards & featured poem** — edit the `<div class="card">` blocks and the `.featured` section in `index.html`.
6. **Contact links** — update the email and social links at the bottom of `about.html`.
7. **Colors/fonts** — everything lives in `css/style.css` under `:root` at the top if you want to adjust the palette.

## How to host it for free

**Option A — GitHub Pages (recommended, fully free, your own URL)**
1. Create a free account at github.com if you don't have one.
2. Create a new repository (e.g. `my-writing`).
3. Upload all the files in this folder (drag-and-drop works on GitHub's website — click "Add file → Upload files").
4. Go to the repo's **Settings → Pages**, set the source branch to `main` and folder to `/root`, then save.
5. Your site will be live in a minute or two at `https://yourusername.github.io/my-writing/`.

**Option B — Netlify (also free, drag-and-drop)**
1. Go to app.netlify.com and sign up free.
2. Drag the whole `writer-portfolio` folder onto the "Deploy" area on your dashboard.
3. Netlify gives you a live URL instantly; you can rename it or add a custom domain later, still free.

Both options let you use your own domain name later if you ever want one (domains themselves cost a small yearly fee, but the hosting stays free).
