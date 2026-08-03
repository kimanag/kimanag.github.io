# Anastasia Kim — Personal Website

A bold, creative personal website with portfolio, blog, and contact sections. Built with plain HTML, CSS, and JavaScript — no build tools required.

---

## Deploy to GitHub Pages

### 1. Create a GitHub repository

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `yourusername.github.io` (replace with your actual GitHub username)
3. Set it to **Public**, leave everything else default → **Create repository**

### 2. Push the files

```bash
git init
git add .
git commit -m "Initial site"
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Branch**, select `main` and `/ (root)` → **Save**
3. Your site will be live at `https://yourusername.github.io` in ~2 minutes

---

## Connect your custom domain

1. In your repo → **Settings** → **Pages** → **Custom domain**
2. Enter your domain (e.g. `anastasiakim.com`) → **Save**
3. GitHub will create a `CNAME` file automatically

### DNS settings (at your domain registrar)

Add these DNS records:

| Type  | Host | Value              |
|-------|------|--------------------|
| A     | @    | 185.199.108.153    |
| A     | @    | 185.199.109.153    |
| A     | @    | 185.199.110.153    |
| A     | @    | 185.199.111.153    |
| CNAME | www  | yourusername.github.io |

DNS changes can take up to 48 hours to propagate. Once live, check **Enforce HTTPS** in GitHub Pages settings.

---

## Customize the site

| What                  | Where                        |
|-----------------------|------------------------------|
| Name, tagline, bio    | `index.html` → hero + about  |
| Skills list           | `index.html` → `.skill-list` |
| Portfolio projects    | `index.html` → `#portfolio`  |
| Blog posts            | `index.html` → `#blog`       |
| Social links          | `index.html` → `.contact__socials` |
| Colors                | `style.css` → `:root` variables |
| Fonts                 | `style.css` → Google Fonts import |

### Adding a real contact form

The form currently shows a mock success state. To make it actually send emails:

1. Sign up at [formspree.io](https://formspree.io) (free tier available)
2. Create a form → copy your form endpoint URL
3. In `index.html`, change `<form class="contact__form" id="contactForm">` to `<form class="contact__form" id="contactForm" action="https://formspree.io/f/YOURCODE" method="POST">`
4. Remove the `e.preventDefault()` block in `script.js` (or keep it and use `fetch`)
