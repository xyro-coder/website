# Sulayman Yusuf - Personal Portfolio

A professional portfolio website showcasing research in geometric deep learning, mechanistic interpretability, and ML engineering. Built with Next.js 14, TypeScript, Three.js, and Tailwind CSS.

🌐 **Live Site**: [Coming Soon]

## ✨ Features

- **Interactive 3D Visualizations**: Hero section with SO(3)-equivariant geometric animations
- **Geometric Design Language**: Mathematical precision meets modern web design
- **Blog System**: MDX support with math equations (KaTeX) and code highlighting
- **Dark/Light Mode**: Smooth theme transitions with user preference persistence
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Performance First**: <3s load time, Lighthouse score >90
- **Easy Content Management**: Add projects, publications, and blog posts via markdown files

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.x or v20.x ([Download here](https://nodejs.org/))
- **npm**: v9.x or later (comes with Node.js)
- **Git**: Latest version

### Local Development

1. **Clone the repository**
   ```bash
   cd /path/to/your/desired/location
   # If cloning from a repository:
   # git clone <repo-url>
   # cd website

   # Or if you already have the code:
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This will install all required packages (~500MB). Takes 2-5 minutes depending on your internet speed.

3. **Run development server**
   ```bash
   npm run dev
   ```

   The site will be available at [http://localhost:3000](http://localhost:3000)

4. **Build for production (test locally)**
   ```bash
   npm run build
   npm run start
   ```

   This tests that your production build works correctly.

## 📁 Project Structure

```
website/
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── blog/                # Blog listing and posts
│   ├── contact/             # Contact page
│   ├── projects/            # Projects page
│   ├── publications/        # Publications page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── geometric/           # 3D visualizations
│   │   ├── HeroScene.tsx   # Main 3D hero scene
│   │   └── GeometricBackground.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeProvider.tsx
│   ├── mdx/                 # MDX components
│   │   └── MDXComponents.tsx
│   └── ui/                  # UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Badge.tsx
├── content/                 # Content (markdown/MDX files)
│   ├── projects/            # Project markdown files
│   ├── publications/        # Publication markdown files
│   └── blog/                # Blog MDX files
├── lib/                     # Utility functions
│   ├── content.ts           # Content loading
│   ├── mdx.ts               # MDX processing
│   └── utils.ts             # Helper functions
├── public/                  # Static assets
│   ├── images/              # Images
│   └── resume/              # Resume PDF
├── types/                   # TypeScript types
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🌐 Deployment to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended for automatic deployments)

### Step 2: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. In Vercel dashboard, click "**New Project**"
2. Click "**Import**" next to your GitHub repository
3. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click "**Deploy**"
5. Wait 2-3 minutes for the build to complete
6. You'll get a URL like: `your-portfolio.vercel.app`

### Step 4: Set Up Custom Domain (Optional)

1. **Buy a domain** from:
   - [Namecheap](https://www.namecheap.com) (~$10-15/year)
   - [Google Domains](https://domains.google.com)
   - [Cloudflare](https://www.cloudflare.com/products/registrar/)

   Recommended: `sulaymanyusuf.com`

2. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Click "**Add**"
   - Enter your domain (e.g., `sulaymanyusuf.com`)
   - Follow the DNS configuration instructions

3. **Configure DNS** (example for Namecheap):
   - Log into your domain registrar
   - Go to DNS settings
   - Add these records:
     ```
     Type: A
     Host: @
     Value: 76.76.21.21

     Type: CNAME
     Host: www
     Value: cname.vercel-dns.com
     ```
   - Save changes
   - Wait 5-60 minutes for DNS propagation

4. **HTTPS** is automatically enabled by Vercel (free SSL certificate)

### Continuous Deployment

Once set up, every time you push to GitHub:
1. Vercel automatically detects the push
2. Builds the new version
3. Deploys it live (takes ~2-3 minutes)

```bash
# Make changes to your code
git add .
git commit -m "Update about page"
git push origin main
# Vercel automatically deploys!
```

## 📝 Content Management

### Adding a New Project

1. Create a new markdown file in `content/projects/`:
   ```bash
   cp content/projects/_template.md content/projects/my-new-project.md
   ```

2. Edit the frontmatter and content:
   ```markdown
   ---
   title: "My New Project"
   description: "Short description"
   date: "2025-02-15"
   tags: ["PyTorch", "ML"]
   github: "https://github.com/xyro-coder/my-project"
   featured: false
   ---

   ## Project content here...
   ```

3. Add project image to `public/images/projects/` (optional)

4. Commit and push:
   ```bash
   git add content/projects/my-new-project.md
   git commit -m "Add new project"
   git push origin main
   ```

### Adding a New Publication

1. Create file in `content/publications/`:
   ```bash
   cp content/publications/_template.md content/publications/my-paper.md
   ```

2. Fill in the frontmatter with paper details

3. Commit and push

### Adding a New Blog Post

1. Create file in `content/blog/`:
   ```bash
   cp content/blog/_template.mdx content/blog/my-post.mdx
   ```

2. Write your post with full MDX support:
   - **Code blocks** with syntax highlighting
   - **Math equations** with KaTeX
   - **Callouts** for notes/warnings/tips
   - **Images** with automatic optimization

3. Commit and push

### Updating Your Resume

1. Replace `public/resume/resume.pdf` with your updated resume:
   ```bash
   cp ~/Downloads/new-resume.pdf public/resume/resume.pdf
   ```

2. Commit and push:
   ```bash
   git add public/resume/resume.pdf
   git commit -m "Update resume"
   git push origin main
   ```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  'navy-dark': '#0a0e27',  // Change background color
  'cyan-accent': '#06b6d4', // Change primary accent
  'purple-accent': '#a855f7', // Change secondary accent
}
```

### Typography

Edit `app/layout.tsx` to change fonts:
```typescript
import { Inter, IBM_Plex_Mono } from 'next/font/google'
```

### 3D Visualization

Customize the hero scene in `components/geometric/HeroScene.tsx`:
- Change icosahedron colors
- Adjust rotation speed
- Modify particle count

## 🛠 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Build Fails

1. **Check the error message** in terminal or Vercel dashboard
2. **Test locally first**:
   ```bash
   npm run build
   ```
3. **Common issues**:
   - Missing dependencies: run `npm install`
   - TypeScript errors: check the error messages
   - Image optimization errors: ensure images exist in `public/`

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
```

### Vercel Deployment Slow

- Check [Vercel Status Page](https://www.vercel-status.com/)
- Usually takes 2-3 minutes
- Check build logs for errors

### 3D Scene Not Loading

- Check browser console for errors
- Ensure WebGL is enabled in browser
- Try different browser (Chrome/Firefox recommended)

## 📊 Performance Optimization

The site is optimized for speed:
- ✅ Code splitting (3D components loaded dynamically)
- ✅ Image optimization (Next.js Image component)
- ✅ Font optimization (next/font)
- ✅ CSS optimization (Tailwind CSS purging)
- ✅ Lazy loading (below-fold content)

**Expected Performance**:
- **Load Time**: <3 seconds
- **Lighthouse Score**: >90
- **First Contentful Paint**: <1.5s

## 🔒 Security

- ✅ HTTPS enforced (via Vercel)
- ✅ No API keys in frontend code
- ✅ XSS protection (React's built-in escaping)
- ✅ Content Security Policy headers (Next.js defaults)

## 📧 Support

Questions or issues?
- **Email**: sulaymanyusuf.a@gmail.com
- **GitHub**: [@xyro-coder](https://github.com/xyro-coder)
- **LinkedIn**: [Sulayman Yusuf](https://www.linkedin.com/in/sulayman-yusuf-a84940214/)

## 📄 License

This portfolio is for personal use. Feel free to use it as inspiration for your own portfolio, but please don't directly copy the content or design.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Three.js** - 3D graphics
- **Tailwind CSS** - Styling
- **Vercel** - Hosting and deployment

---

**Built with geometric precision and mathematical elegance** ✨

Made by Sulayman Yusuf | [Portfolio](/) | [GitHub](https://github.com/xyro-coder)
