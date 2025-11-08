import { WidgetDefinition } from "../types";

export const WIDGET_DEFINITIONS: WidgetDefinition[] = [
  {
    type: "clock",
    name: "Clock",
    description: "Display current time",
    icon: "🕐",
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
    defaultConfig: { format: "24h", showSeconds: true, type: "digital" },
  },
  {
    type: "weather",
    name: "Weather",
    description: "Current weather conditions",
    icon: "🌤️",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    defaultConfig: { city: "London", unit: "metric" },
  },
  {
    type: "todo",
    name: "To-Do List",
    description: "Manage your tasks",
    icon: "✓",
    defaultSize: { w: 3, h: 4 },
    minSize: { w: 2, h: 3 },
    defaultConfig: { items: [] },
  },
  {
    type: "notes",
    name: "Notes",
    description: "Quick sticky notes",
    icon: "📝",
    defaultSize: { w: 3, h: 3 },
    minSize: { w: 2, h: 2 },
    defaultConfig: { content: "", color: "yellow" },
  },
  {
    type: "calendar",
    name: "Calendar",
    description: "View calendar",
    icon: "📅",
    defaultSize: { w: 3, h: 3 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {},
  },
  {
    type: "timer",
    name: "Timer",
    description: "Pomodoro & countdown timer",
    icon: "⏱️",
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
    defaultConfig: { duration: 25, type: "pomodoro" },
  },
  {
    type: "quote",
    name: "Quote",
    description: "Inspirational quotes",
    icon: "💬",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    defaultConfig: { category: "random" },
  },
  {
    type: "rss",
    name: "RSS Feed",
    description: "Read RSS feeds",
    icon: "📰",
    defaultSize: { w: 3, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: { url: "", maxItems: 5 },
  },
  {
    type: "links",
    name: "Quick Links",
    description: "Favorite links shortcuts",
    icon: "🔗",
    defaultSize: { w: 2, h: 3 },
    minSize: { w: 2, h: 2 },
    defaultConfig: { links: [] },
  },
  {
    type: "progress",
    name: "Progress Tracker",
    description: "Track goals & habits",
    icon: "📊",
    defaultSize: { w: 3, h: 3 },
    minSize: { w: 2, h: 2 },
    defaultConfig: { goals: [] },
  },
];

export const getWidgetDefinition = (
  type: string
): WidgetDefinition | undefined => {
  return WIDGET_DEFINITIONS.find((def) => def.type === type);
};
