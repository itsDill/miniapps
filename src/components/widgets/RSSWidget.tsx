import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
}

interface RSSWidgetProps {
  config: {
    url?: string;
    maxItems?: number;
  };
  onUpdate: (config: any) => void;
}

const SAMPLE_FEED: RSSItem[] = [
  {
    title: "Sample Article 1: Getting Started",
    link: "#",
    pubDate: "2024-01-01",
  },
  {
    title: "Sample Article 2: Advanced Techniques",
    link: "#",
    pubDate: "2024-01-02",
  },
  {
    title: "Sample Article 3: Best Practices",
    link: "#",
    pubDate: "2024-01-03",
  },
  {
    title: "Sample Article 4: Tips and Tricks",
    link: "#",
    pubDate: "2024-01-04",
  },
  {
    title: "Sample Article 5: Latest Updates",
    link: "#",
    pubDate: "2024-01-05",
  },
];

export const RSSWidget = ({ config }: RSSWidgetProps) => {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { url = "", maxItems = 5 } = config;

  useEffect(() => {
    if (!url) {
      setItems([]);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setItems(SAMPLE_FEED.slice(0, maxItems));
      setLoading(false);
    }, 500);
  }, [url, maxItems]);

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
        Configure RSS feed URL in settings
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-2">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.pubDate).toLocaleDateString()}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 flex-shrink-0 text-gray-400" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export const RSSSettings = ({ config, onUpdate }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">RSS Feed URL</label>
        <input
          type="url"
          className="input"
          value={config.url || ""}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="https://example.com/feed.xml"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Max Items</label>
        <input
          type="number"
          className="input"
          min="1"
          max="20"
          value={config.maxItems || 5}
          onChange={(e) =>
            onUpdate({ maxItems: parseInt(e.target.value) || 5 })
          }
        />
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Note: This demo uses sample data. Implement RSS parser for real feeds.
      </div>
    </div>
  );
};
