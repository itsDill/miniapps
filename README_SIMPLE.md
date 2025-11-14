# DashCraft - Dashboard Builder Website

A beautiful, pure HTML/CSS/JavaScript dashboard builder with no frameworks or build tools required!

## 🎯 What It Is

**DashCraft** is a complete dashboard builder website built with vanilla web technologies:

- ✅ Pure HTML, CSS & JavaScript
- ✅ No React, no build tools, no npm
- ✅ Just open `index.html` in a browser!

## 🚀 Quick Start

1. **Open the website:**

   - Double-click `index.html` to open in your browser
   - OR use a local server: `python -m http.server 8000`

2. **Browse templates** on the landing page

3. **Click "Use This Template"** or **"Start from Blank"**

4. **Build your dashboard!**
   - Click widgets in the sidebar to add them
   - Drag widgets to move them around
   - Click × to remove widgets
   - Create multiple dashboards
   - Everything auto-saves to localStorage

## 📁 File Structure

```
miniapps/
├── index.html          # Landing page with templates
├── builder.html        # Dashboard builder interface
├── styles.css          # All styles (no frameworks!)
├── dashboard.js        # Main dashboard logic
├── widgets.js          # Widget components
└── README_SIMPLE.md    # This file
```

## 🎨 Features

### Landing Page (`index.html`)

- Beautiful hero section
- Feature highlights
- 6 pre-made templates:
  - Productivity Pro
  - Personal Hub
  - Developer Workspace
  - Minimalist
  - Content Creator
  - News & Information

### Dashboard Builder (`builder.html`)

- **8 Widget Types:**

  - 🕐 Clock - Live time display
  - ☁️ Weather - Weather widget
  - ✅ Todo List - Task management
  - 📝 Notes - Note-taking
  - 📅 Calendar - Month view
  - ⏱️ Timer - Countdown timer
  - 💬 Quote - Inspirational quotes
  - 🔗 Quick Links - Favorite sites

- **Features:**
  - Drag and drop widgets
  - Multiple dashboards
  - Dark mode
  - Auto-save to browser
  - No installation needed

## 🎯 How It Works

### Landing Page

1. User sees templates
2. Clicks "Use This Template" or "Start from Blank"
3. Redirects to `builder.html` (with template parameter if chosen)

### Builder

1. Loads from localStorage or template
2. User clicks widgets to add them
3. Drag widgets to reposition
4. All changes auto-save to localStorage
5. Can create multiple dashboards

## 💻 No Build Tools!

This is pure HTML/CSS/JS:

- ❌ No npm install
- ❌ No webpack/vite
- ❌ No React/frameworks
- ❌ No TypeScript compilation
- ✅ Just open and use!

## 🔧 Customization

### Add New Widgets

Edit `widgets.js` and add to `widgetTemplates`:

```javascript
widgetTemplates.mywidget = {
  title: "🎯 My Widget",
  create: (id) => `<div class="widget" id="${id}">...</div>`,
  init: (id) => {
    /* initialization code */
  },
};
```

Then add button in `builder.html`:

```html
<button class="widget-btn" data-widget="mywidget">
  <span class="widget-icon">🎯</span>
  <span>My Widget</span>
</button>
```

### Change Styles

Edit `styles.css`:

- Change colors in `:root` CSS variables
- Modify gradients
- Adjust spacing

### Add Templates

Edit `dashboard.js` and add to `templates` object:

```javascript
templates.mytemplate = {
  name: "My Template",
  widgets: ["clock", "notes", "todo"],
};
```

## 📱 Browser Compatibility

Works in all modern browsers:

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 💾 Data Storage

All data is stored in browser's `localStorage`:

- Dashboard configurations
- Widget content (todos, notes, etc.)
- Dark mode preference
- No server needed!

## 🎨 Screenshots

**Landing Page:**

- Hero with gradients
- Template cards
- Feature highlights

**Dashboard Builder:**

- Sidebar with widgets
- Canvas area
- Draggable widgets
- Dark mode support

## 🚀 Deployment

### Option 1: File System

Just open `index.html` in a browser!

### Option 2: Web Server

Any static hosting works:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Or run locally: `python -m http.server`

## 📝 License

Open source - modify and use as you wish!

## ✨ Summary

A complete dashboard builder website with:

- 📄 Pure HTML/CSS/JS (no frameworks)
- 🎨 Beautiful landing page
- 🛠️ Drag-and-drop builder
- 📊 8 widget types
- 💾 Auto-save functionality
- 🌙 Dark mode
- 📱 Responsive design
- 🚀 Zero dependencies

**Just open `index.html` and start building!** 🎉
