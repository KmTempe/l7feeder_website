# Portfolio - Kosmas Temperekidis

![Deploy Status](https://github.com/KmTempe/portfolio-react/actions/workflows/deploy.yml/badge.svg)

Modern portfolio website showcasing my IT Applications & Technical Support experience, built with React and Material-UI.

🌐 **Live Site:** [https://kmtempe.github.io/portfolio-react/](https://kmtempe.github.io/portfolio-react/)

## 🎨 Features

- **Modern Design** - Dark theme with cyan and green accents
- **Responsive Layout** - Optimized for all devices
- **Material-UI Components** - Professional UI components
- **Automated Deployment** - GitHub Actions workflow for continuous deployment

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **Emotion** - CSS-in-JS styling
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD pipeline

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/KmTempe/portfolio-react.git
cd portfolio-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Run dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

The dev server will start at `http://localhost:5173`

## 📦 Build & Deploy

### Manual Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Automatic Deployment

The site automatically deploys to GitHub Pages when you push to the `master` branch:

```bash
git add .
git commit -S -m "Your commit message"
git push origin master
```

The GitHub Actions workflow will:
1. Install dependencies
2. Build the project
3. Deploy to GitHub Pages

## 🎯 Project Structure

```
portfolio-react/
├── public/
│   ├── favicon.svg          
│   └── vite.svg
├── src/
│   ├── components/          
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   ├── FeaturedWorkflows.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Skills.jsx
│   │   └── icons/
│   ├── data/
│   │   └── portfolioData.js # Portfolio content
│   ├── theme/
│   │   └── theme.js         # MUI theme configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml       
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Customization

### Update Content

Edit `src/data/portfolioData.js` to update your personal information, experience, skills, and projects.

**⚠️ IMPORTANT:** The personal data in `src/data/portfolioData.js` is NOT open source and must NOT be used. Replace it with your own information.

### Modify Theme

Customize colors and typography in `src/theme/theme.js`:

```javascript
primary: { main: '#00d9ff' }    // Cyan accent
secondary: { main: '#00ff88' }  // Green accent
background: { default: '#0a1628' } // Dark background
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Personal Data Notice:** While the code is open source, all personal information in `src/data/portfolioData.js` remains the exclusive property of Kosmas Temperekidis and may NOT be copied or used. You must replace this data with your own.

## 👤 Contact

**Kosmas Temperekidis**
- Email: kosmas.temperekidis@live.com
- Portfolio: [https://kmtempe.github.io/portfolio-react/](https://kmtempe.github.io/portfolio-react/)

---

Built with ❤️ using React & Vite
