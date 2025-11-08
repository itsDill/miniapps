import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface Quote {
  text: string;
  author: string;
}

const SAMPLE_QUOTES: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
];

interface QuoteWidgetProps {
  config: {
    category?: string;
  };
}

export const QuoteWidget = ({ config }: QuoteWidgetProps) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = () => {
    setLoading(true);
    // Simulate API call with random quote
    setTimeout(() => {
      const randomQuote =
        SAMPLE_QUOTES[Math.floor(Math.random() * SAMPLE_QUOTES.length)];
      setQuote(randomQuote);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchQuote();
  }, [config.category]);

  if (loading || !quote) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading quote...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-lg italic mb-4">"{quote.text}"</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          — {quote.author}
        </div>
      </div>

      <button
        onClick={fetchQuote}
        className="btn-secondary w-full flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        New Quote
      </button>
    </div>
  );
};

export const QuoteSettings = ({ config, onUpdate }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          className="input"
          value={config.category || "random"}
          onChange={(e) => onUpdate({ category: e.target.value })}
        >
          <option value="random">Random</option>
          <option value="inspirational">Inspirational</option>
          <option value="motivational">Motivational</option>
          <option value="wisdom">Wisdom</option>
        </select>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Using sample quotes. Integrate with an API for more variety.
      </div>
    </div>
  );
};
