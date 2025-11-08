# ioWidgets - Dashboard Builder

A modern, customizable dashboard builder built with React, TypeScript, and Vite. Create personalized workspaces with drag-and-drop widgets for productivity, time tracking, notes, and more.

![ioWidgets](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## ✨ Features

- **🎯 Drag & Drop Interface** - Intuitive grid-based layout system
- **📱 Responsive Design** - Works on desktop and tablet devices
- **🌓 Dark Mode** - Built-in theme switcher
- **💾 Auto-Save** - Dashboards persist automatically in localStorage
- **🎨 10+ Widgets** - Clock, Weather, To-Do, Notes, Calendar, Timer, and more
- **⚙️ Customizable** - Each widget has configurable settings
- **📊 Multiple Dashboards** - Create and switch between different layouts

## 🎨 Available Widgets

1. **Clock** - Digital and analog display with timezone support
2. **Weather** - Current conditions and forecast (demo data included)
3. **To-Do List** - Task management with checkboxes
4. **Notes** - Sticky notes in multiple colors
5. **Calendar** - Month view with date navigation
6. **Timer** - Pomodoro timer and custom countdowns
7. **Quote** - Inspirational quotes rotation
8. **RSS Feed** - Read your favorite feeds (demo data)
9. **Quick Links** - Bookmark shortcuts
10. **Progress Tracker** - Goal and habit tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 How to Use

### Getting Started

1. **Welcome Screen** - On first visit, you'll see a tutorial modal
2. **Create Dashboard** - Click "New Dashboard" in the header
3. **Add Widgets** - Click any widget in the sidebar to add it
4. **Arrange** - Drag widgets by their header to reposition
5. **Resize** - Drag from the bottom-right corner to resize
6. **Configure** - Click the gear icon to access widget settings
7. **Remove** - Click the X icon to delete a widget

### Managing Dashboards

- **Create** - Click "New Dashboard" button in header
- **Switch** - Use the dropdown selector in header
- **Auto-Save** - All changes save automatically to localStorage

### Dark Mode

Toggle dark mode using the moon/sun icon in the header.

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **TypeScript 5.2** - Type safety
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS 3.3** - Utility-first styling
- **Zustand 4.4** - State management
- **react-grid-layout 1.4** - Drag-and-drop grid system
- **lucide-react** - Icon library
- **date-fns** - Date utilities

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Top navigation bar
│   │   ├── Sidebar.tsx          # Widget library panel
│   │   ├── DashboardCanvas.tsx  # Main grid container
│   │   ├── WidgetWrapper.tsx    # Widget container with controls
│   │   ├── EmptyState.tsx       # Empty canvas placeholder
│   │   └── WelcomeModal.tsx     # First-visit tutorial
│   └── widgets/
│       ├── ClockWidget.tsx      # Time display widget
│       ├── WeatherWidget.tsx    # Weather info widget
│       ├── TodoWidget.tsx       # Task list widget
│       ├── NotesWidget.tsx      # Sticky notes widget
│       ├── CalendarWidget.tsx   # Calendar widget
│       ├── TimerWidget.tsx      # Pomodoro/timer widget
│       ├── QuoteWidget.tsx      # Quotes widget
│       ├── RSSWidget.tsx        # RSS feed reader
│       ├── LinksWidget.tsx      # Quick links widget
│       ├── ProgressWidget.tsx   # Goal tracker widget
│       └── index.ts             # Widget exports
├── store/
│   └── dashboardStore.ts        # Zustand state management
├── types/
│   └── index.ts                 # TypeScript definitions
├── utils/
│   └── widgetDefinitions.ts    # Widget metadata
├── App.tsx                      # Main app component
├── main.tsx                     # App entry point
└── index.css                    # Global styles
```

## 🎨 Customization

### Adding New Widgets

1. **Create widget component** in `src/components/widgets/`:

   ```tsx
   export const MyWidget = ({ config, onUpdate }: WidgetProps) => {
     return <div>My Widget Content</div>;
   };

   export const MyWidgetSettings = ({ config, onUpdate }: any) => {
     return <div>Settings form</div>;
   };
   ```

2. **Add to widget definitions** in `src/utils/widgetDefinitions.ts`:

   ```tsx
   {
     type: 'mywidget',
     name: 'My Widget',
     description: 'Widget description',
     icon: '🎉',
     defaultSize: { w: 2, h: 2 },
     minSize: { w: 2, h: 2 },
     defaultConfig: {},
   }
   ```

3. **Register in WidgetWrapper** (`src/components/layout/WidgetWrapper.tsx`)

### Styling

- Modify `tailwind.config.js` for theme customization
- Edit `src/index.css` for global styles
- Use Tailwind utility classes throughout components

### API Integration

Widgets like Weather and RSS use mock data. To integrate real APIs:

1. Add API keys to environment variables
2. Update widget components to fetch from APIs
3. Handle loading states and errors

## 🔒 Data Privacy

All data is stored locally in your browser using localStorage. No data is sent to external servers. Clear your browser data to reset all dashboards.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Ideas for new widgets:

- Stock ticker
- World clock with multiple timezones
- Cryptocurrency prices
- GitHub activity
- Email inbox preview
- Music player controls
- And more...

## 🐛 Known Limitations

- Weather and RSS widgets use mock data (add your API keys for real data)
- Responsive design optimized for desktop and tablet (mobile support limited)
- No backend - all data stored in browser localStorage
- Grid layout width is fixed (can be made responsive)

## 💡 Future Enhancements

- [ ] Backend integration for cross-device sync
- [ ] Widget marketplace/sharing
- [ ] Export/import dashboards
- [ ] More widget types
- [ ] Mobile-responsive layouts
- [ ] Keyboard shortcuts
- [ ] Widget themes/styles
- [ ] Collaborative dashboards

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using modern web technologies
