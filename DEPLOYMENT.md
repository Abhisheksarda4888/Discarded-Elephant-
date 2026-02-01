# 🚀 Deployment Guide

Complete guide to deploy **The Discarded Elephants** to various platforms.

---

## 📦 GitHub Pages (Recommended - FREE)

### Method 1: Direct Upload

1. **Create GitHub Account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Create New Repository**
   - Click "+" icon → "New repository"
   - Name: `discarded-elephants`
   - Make it Public
   - Don't initialize with README
   - Click "Create repository"

3. **Upload Files**
   - Click "uploading an existing file"
   - Drag and drop all files:
     - `index.html`
     - `README.md`
     - `LICENSE`
     - `.gitignore`
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Select "main" branch
   - Click Save
   - Wait 1-2 minutes
   - Your site will be live at: `https://yourusername.github.io/discarded-elephants/`

### Method 2: Using Git (Command Line)

```bash
# Initialize git in your project folder
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: The Discarded Elephants website"

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/discarded-elephants.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in Settings → Pages.

---

## 🎨 Netlify (FREE - Custom Domain Support)

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up** (use GitHub account for easy auth)
3. **Deploy Method 1 - Drag & Drop:**
   - Click "Add new site" → "Deploy manually"
   - Drag entire project folder
   - Done! Live in seconds

4. **Deploy Method 2 - From GitHub:**
   - Click "Add new site" → "Import from Git"
   - Connect GitHub account
   - Select your repository
   - Click "Deploy site"

5. **Custom Domain (Optional):**
   - Site settings → Domain management
   - Add custom domain
   - Update DNS records

**Your site URL:** `https://random-name-123.netlify.app`  
(You can change this to custom name in settings)

---

## ▲ Vercel (FREE - Lightning Fast)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up** with GitHub
3. **Import Repository:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Deploy"

4. **That's it!** Your site is live in ~30 seconds

**Your site URL:** `https://discarded-elephants.vercel.app`

---

## 🌐 Custom Domain Setup

### For GitHub Pages:

1. Buy domain from [Namecheap](https://namecheap.com) or [GoDaddy](https://godaddy.com)
2. Add CNAME record pointing to: `yourusername.github.io`
3. In GitHub repo: Settings → Pages → Custom domain
4. Enter your domain → Save

### For Netlify/Vercel:

1. Go to Domain settings
2. Add your custom domain
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

---

## 📱 Testing Your Deployment

After deployment, test:

✅ All pages load correctly  
✅ Currency conversion works  
✅ Cart functionality works  
✅ 3D elephant displays properly  
✅ Mobile responsive design  
✅ All buttons and forms work  
✅ Bill generation works  

---

## 🔧 Troubleshooting

### GitHub Pages not loading?
- Wait 2-5 minutes after enabling
- Check Settings → Pages for build status
- Ensure `index.html` is in root directory

### 3D Elephant not showing?
- Check browser console for errors
- Ensure Three.js CDN is accessible
- Try different browser

### Bill download not working?
- Check browser popup blocker
- Try different browser
- Ensure JavaScript is enabled

---

## 📊 Analytics (Optional)

Add Google Analytics to track visitors:

1. Get tracking code from [analytics.google.com](https://analytics.google.com)
2. Add before `</head>` in index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

---

## 🔄 Updating Your Site

### GitHub Pages:
```bash
git add .
git commit -m "Update: describe your changes"
git push
```
Changes go live in 1-2 minutes.

### Netlify/Vercel:
Just push to GitHub - auto-deploys!

---

## 💡 Pro Tips

1. **Use HTTPS** - Always enable SSL (automatic on all platforms)
2. **Optimize Images** - Compress any images you add later
3. **Test Mobile** - Use Chrome DevTools mobile view
4. **Monitor Performance** - Use Lighthouse in Chrome DevTools
5. **Backup Regularly** - Git commits are your backup!

---

## 🆘 Need Help?

- GitHub Issues: Create an issue in your repository
- Community: Stack Overflow with tag `github-pages`
- Documentation: 
  - [GitHub Pages Docs](https://docs.github.com/pages)
  - [Netlify Docs](https://docs.netlify.com)
  - [Vercel Docs](https://vercel.com/docs)

---

**Happy Deploying! 🚀**

Your website will be live and accessible worldwide within minutes!
