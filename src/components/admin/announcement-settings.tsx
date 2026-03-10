"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAnnouncements } from "@/lib/actions/admin";
import { toast } from "sonner";

interface AnnouncementSettingsProps {
  initialMessages: string[];
}

export function AnnouncementSettings({
  initialMessages,
}: AnnouncementSettingsProps) {
  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const updated = [...messages, trimmed];
    setSaving(true);
    try {
      await updateAnnouncements(updated);
      setMessages(updated);
      setNewMessage("");
      toast.success("Announcement added");
    } catch {
      toast.error("Failed to add announcement");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(index: number) {
    const updated = messages.filter((_, i) => i !== index);
    setSaving(true);
    try {
      await updateAnnouncements(updated);
      setMessages(updated);
      toast.success("Announcement removed");
    } catch {
      toast.error("Failed to remove announcement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="gap-0 p-0">
      <div className="p-5">
        <h3 className="text-sm font-semibold">Announcement Bar</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Messages scroll across the top of the site above the navigation.
          Leave empty to hide the bar.
        </p>

        {/* Current messages */}
        {messages.length > 0 && (
          <div className="mt-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
              >
                <span className="min-w-0 flex-1 text-sm">{msg}</span>
                <button
                  onClick={() => handleRemove(i)}
                  disabled={saving}
                  className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove announcement: ${msg}`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new */}
        <div className="mt-3 flex gap-2">
          <Input
            type="text"
            placeholder="Type a new announcement..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            className="h-9 text-sm"
            disabled={saving}
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={saving || !newMessage.trim()}
          >
            Add
          </Button>
        </div>

        {messages.length === 0 && (
          <div className="mt-3 rounded-md bg-muted/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              No announcements — the bar is hidden on the site.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
