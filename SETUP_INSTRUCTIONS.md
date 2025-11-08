# ioWidgets Setup Guide

Since Node.js is not currently installed on your system, follow these steps to get ioWidgets running:

## Option 1: Install Node.js (Recommended)

1. **Install Node.js:**

   - Visit https://nodejs.org/
   - Download and install the LTS version (v20.x or later)
   - Verify installation: `node --version` and `npm --version`

2. **Install project dependencies:**

   ```bash
   cd /Users/dillchalisas/miniapps
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to http://localhost:3000

## Option 2: Use a Package Manager (macOS)

### Using Homebrew:

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Navigate to project and install
cd /Users/dillchalisas/miniapps
npm install
npm run dev
```

### Using nvm (Node Version Manager):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then install Node
nvm install --lts
nvm use --lts

# Install project dependencies
cd /Users/dillchalisas/miniapps
npm install
npm run dev
```

## What Gets Installed

The following packages will be installed:

### Core Dependencies:

- `react` & `react-dom` - UI framework
- `react-grid-layout` - Drag-and-drop grid
- `zustand` - State management
- `lucide-react` - Icons
- `date-fns` - Date utilities

### Dev Dependencies:

- `vite` - Build tool
- `typescript` - Type checking
- `tailwindcss` - CSS framework
- `@vitejs/plugin-react` - React support
- `eslint` - Code linting

Total size: ~250MB (node_modules)

## File Structure Created

All source files have been created in:

```
/Users/dillchalisas/miniapps/
├── src/                    # Application source
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
├── iowidgets.html          # HTML entry point
└── README_IOWIDGETS.md     # Documentation
```

## Available Scripts

After installation:

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Port 3000 already in use:

Edit `vite.config.ts` and change the port:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Change to different port
  },
});
```

### Permission errors:

```bash
sudo chown -R $USER /Users/dillchalisas/miniapps
```

### TypeScript errors:

These are expected until dependencies are installed. They will resolve after `npm install`.

## Next Steps

Once the app is running:

1. Create your first dashboard
2. Add widgets from the sidebar
3. Customize layouts and settings
4. Enable dark mode
5. Create multiple dashboards for different workflows

Enjoy building your perfect dashboard! 🚀
