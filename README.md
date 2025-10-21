# iowidgets Collection

A beautiful, customizable collection of web widgets with a modern glassmorphism design.

## Features

### 🎨 **Beautiful Design**

- Modern glassmorphism UI with smooth animations
- Responsive design that works on all devices
- Customizable backgrounds with PNG/image support
- Category-based color coding and organization

### 🛠️ **Built-in Widgets**

- **Calculator** - Full-featured calculator with keyboard support
- **Timer** - Countdown timer with presets and visual progress
- **Notes** - Note-taking widget with search and local storage
- **Color Picker** - Advanced color selection with multiple formats
- **Todo List** - Task management with priorities and filtering
- **Stopwatch** - Precision timing with lap tracking
- **Password Generator** - Secure password creation with customization

### ⚙️ **Customization**

- **Create Custom Widgets** - Add your own web widgets to the collection
- **Custom Icons** - Choose from 60+ emoji icons
- **Background Images** - Upload PNG/JPG backgrounds for your widgets
- **Categories** - Organize widgets by Productivity, Creative, Utility, Fun, or Custom
- **Import/Export** - Share your custom widget collections

### 🔍 **Organization**

- **Search** - Quickly find widgets by name
- **Filters** - Filter by category (All, Productivity, Creative, Utility, Fun, Custom)
- **Sorting** - Automatic organization by category and name

## Quick Start

1. Open `index.html` in your web browser
2. Browse the built-in widgets or create your own
3. Click "Create Widget" to add custom widgets
4. Use search and filters to organize your collection

## Creating Custom Widgets

1. Click the **"➕ Create Widget"** button
2. Fill in the details:
   - **Name**: Display name for your widget
   - **Category**: Choose from available categories
   - **URL**: Web address of your widget/website
   - **Icon**: Select an emoji from the grid
   - **Background**: Optionally upload an image (PNG, JPG, GIF up to 2MB)
3. Click **"Create Widget"** to save

## Managing Widgets

- **Edit**: Hover over custom widgets and click the edit (✏️) button
- **Delete**: Hover over custom widgets and click the delete (🗑️) button
- **Export**: Save your custom widgets to a JSON file
- **Import**: Load custom widgets from a JSON file

## Keyboard Shortcuts

- **Ctrl/Cmd + N**: Create new app
- **Escape**: Close modal
- **Space**: Start/pause timers and stopwatch
- **Enter**: Submit forms

## File Structure

```
miniapps/
├── index.html              # Main widget launcher
├── assets/
│   └── shared.css         # Shared styles
└── apps/
    ├── calculator.html     # Calculator widget
    ├── timer.html         # Timer widget
    ├── notes.html         # Notes widget
    ├── color-picker.html  # Color picker widget
    ├── todo-list.html     # Todo list widget
    ├── stopwatch.html     # Stopwatch widget
    └── password-generator.html # Password generator
```

## Customization Tips

### Creating Good Custom Widgets

- Use descriptive names (max ~15 characters work best)
- Choose appropriate categories for organization
- Test URLs before adding them
- Use high-contrast background images for better readability

### Background Images

- **Recommended size**: 400x400 pixels or larger
- **Format**: PNG, JPG, or GIF
- **File size**: Under 2MB for best performance
- **Style**: Use images with darker areas for better text readability

### Organization

- Use consistent naming conventions
- Group related apps in the same category
- Utilize search functionality for large collections
- Export your configuration as backup

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Responsive design works on all mobile browsers

## Local Storage

The widget uses browser local storage to save:

- Custom widgets and their configurations
- Notes content
- Todo items
- Widget preferences

Data persists between browser sessions but is device-specific.

## Tips & Tricks

1. **Backup Your Data**: Use Export feature to save custom widgets
2. **Mobile Use**: All widgets are touch-friendly and responsive
3. **Keyboard Navigation**: Most widgets support keyboard shortcuts
4. **Performance**: Large background images may affect load times
5. **Sharing**: Export custom widgets to share with others

## Contributing

This is a self-contained collection of widgets. To add new built-in widgets:

1. Create a new HTML file in the `apps/` directory
2. Follow the existing widget structure and styling
3. Add the widget to the default widgets list in `index.html`
4. Update this README with new features

## License

Open source - feel free to modify and distribute.

---

**Enjoy your personalized iowidgets collection! 🚀**
