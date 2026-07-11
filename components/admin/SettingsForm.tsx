"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Phone,
  Mail,
  Clock3,
  Megaphone,
  Settings2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { ISettings } from "@/models/Settings";

export function SettingsForm({
  initial,
}: {
  initial: Partial<ISettings>;
}) {
  const router = useRouter();

  const [values, setValues] =
    useState<Partial<ISettings>>(initial);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ISettings>(
    key: K,
    value: ISettings[K]
  ) {
    setValues((v) => ({
      ...v,
      [key]: value,
    }));

    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSaved(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-5xl space-y-6"
    >
      {/* Contact */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-indigo-600" />
            Contact Information
          </CardTitle>

          <CardDescription>
            These details are shown across your website.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Contact Phone</Label>

              <Input
                placeholder="+91 9876543210"
                value={values.contactPhone || ""}
                onChange={(e) =>
                  update("contactPhone", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>WhatsApp Number</Label>

              <Input
                placeholder="+91 9876543210"
                value={values.whatsappNumber || ""}
                onChange={(e) =>
                  update("whatsappNumber", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Email
            </Label>

            <Input
              type="email"
              value={values.contactEmail || ""}
              onChange={(e) =>
                update("contactEmail", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              Office Hours
            </Label>

            <Input
              placeholder="Mon - Sat | 9:00 AM - 6:00 PM"
              value={values.officeHours || ""}
              onChange={(e) =>
                update("officeHours", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Announcement */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-orange-500" />
            Announcement Banner
          </CardTitle>

          <CardDescription>
            Display an announcement below the website header.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Admissions Open for 2026..."
            value={values.announcementText || ""}
            onChange={(e) =>
              update("announcementText", e.target.value)
            }
          />
        </CardContent>
      </Card>

      {/* Widgets */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-emerald-600" />
            Website Widgets
          </CardTitle>

          <CardDescription>
            Enable or disable sections on your website.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Floating Contact Bar
              </p>

              <p className="text-sm text-muted-foreground">
                Show Call & WhatsApp buttons across the website.
              </p>
            </div>

            <Switch
              checked={
                values.showFloatingContactBar ?? true
              }
              onCheckedChange={(checked) =>
                update("showFloatingContactBar", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Counselling Widget
              </p>

              <p className="text-sm text-muted-foreground">
                Display counselling enquiry section on home page.
              </p>
            </div>

            <Switch
              checked={
                values.showCounsellingWidgetOnHome ?? true
              }
              onCheckedChange={(checked) =>
                update(
                  "showCounsellingWidgetOnHome",
                  checked
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saved && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Settings saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-4 flex justify-end rounded-xl border bg-background/80 p-4 shadow-lg backdrop-blur">
        <Button
          size="lg"
          disabled={saving}
          className="min-w-[180px]"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
