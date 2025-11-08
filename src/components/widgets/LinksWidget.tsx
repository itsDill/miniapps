import { useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
}

interface LinksWidgetProps {
  config: {
    links?: Link[];
  };
  onUpdate: (config: any) => void;
}

export const LinksWidget = ({ config, onUpdate }: LinksWidgetProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const links = config.links || [];

  const addLink = () => {
    if (newLink.title && newLink.url) {
      const updatedLinks = [...links, { ...newLink, id: `link-${Date.now()}` }];
      onUpdate({ links: updatedLinks });
      setNewLink({ title: "", url: "" });
      setIsAdding(false);
    }
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    onUpdate({ links: updatedLinks });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2">
        {links.length === 0 && !isAdding && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No links yet. Add one below!
          </div>
        )}

        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
          >
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="flex-1 truncate">{link.title}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                deleteLink(link.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </a>
        ))}

        {isAdding && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded space-y-2">
            <input
              type="text"
              className="input text-sm"
              placeholder="Link title"
              value={newLink.title}
              onChange={(e) =>
                setNewLink({ ...newLink, title: e.target.value })
              }
            />
            <input
              type="url"
              className="input text-sm"
              placeholder="https://example.com"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
            <div className="flex gap-2">
              <button onClick={addLink} className="btn-primary text-sm flex-1">
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewLink({ title: "", url: "" });
                }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      )}
    </div>
  );
};

export const LinksSettings = () => {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      No additional settings available for Links widget.
    </div>
  );
};
