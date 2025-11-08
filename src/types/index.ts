export type WidgetType =
  | "clock"
  | "weather"
  | "todo"
  | "notes"
  | "calendar"
  | "timer"
  | "quote"
  | "rss"
  | "links"
  | "progress";

export interface WidgetConfig {
  [key: string]: any;
}

export interface Widget {
  id: string;
  type: WidgetType;
  config: WidgetConfig;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
  layout: LayoutItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  defaultConfig: WidgetConfig;
}
