"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAnnouncements } from "@/lib/actions/admin";
import type { AnnouncementConfig } from "@/lib/actions/admin";
import { toast } from "sonner";

const MAX_ANNOUNCEMENTS = 3;

interface AnnouncementSettingsProps {
  initialConfig: AnnouncementConfig;
}

export function AnnouncementSettings({
  initialConfig,
}: AnnouncementSettingsProps) {
  const [messages, setMessages] = useState<string[]>(initialConfig.messages);
  const [intervalSeconds, setIntervalSeconds] = useState(
    initialConfig.intervalSeconds
  );
  const [newMessage, setNewMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(updatedMessages: string[], updatedInterval?: number) {
    const interval = updatedInterval ?? intervalSeconds;
    setSaving(true);
    try {
      await updateAnnouncements({
        messages: updatedMessages,
        intervalSeconds: interval,
      });
      setMessages(updatedMessages);
      if (updatedInterval !== undefined) setIntervalSeconds(updatedInterval);
      return true;
    } catch {
      toast.error("Failed to update announcements");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd() {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    if (messages.length >= MAX_ANNOUNCEMENTS) {
      toast.error(`Maximum ${MAX_ANNOUNCEMENTS} announcements allowed`);
      return;
    }
    const ok = await save([...messages, trimmed]);
    if (ok) {
      setNewMessage("");
      toast.success("Announcement added");
    }
  }

  async function handleRemove(index: number) {
    const updated = messages.filter((_, i) => i !== index);
    const ok = await save(updated);
    if (ok) toast.success("Announcement removed");
  }

  async function handleIntervalBlur(value: string) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 2) return;
    const ok = await save(messages, num);
    if (ok) toast.success(`Rotation set to ${num} seconds`);
  }

  return (
    <Card className="gap-0 p-0">
      <div className="p-5">
        <h3 className="text-sm font-semibold">Announcement Bar</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Messages rotate above the navigation. Add up to {MAX_ANNOUNCEMENTS}.
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
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  {i + 1}.
                </span>
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
        {messages.length < MAX_ANNOUNCEMENTS && (
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
        )}

        {/* Rotation timer — only show when 2+ messages */}
        {messages.length > 1 && (
          <div className="mt-3 flex items-center gap-3">
            <label
              htmlFor="rotation-interval"
              className="shrink-0 text-xs font-medium text-muted-foreground"
            >
              Rotate every
            </label>
            <Input
              id="rotation-interval"
              type="number"
              min={2}
              max={60}
              value={intervalSeconds}
              onChange={(e) =>
                setIntervalSeconds(parseInt(e.target.value, 10) || 5)
              }
              onBlur={(e) => handleIntervalBlur(e.target.value)}
              className="h-8 w-20 text-center text-sm"
              disabled={saving}
            />
            <span className="text-xs text-muted-foreground">seconds</span>
          </div>
        )}

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
