"use client";

import { useState } from "react";

type Reminder = {
  topicType: "visiting_session";
  topicId: string;
  label: string;
  visitDate: string;
  consentedAt: string;
};

export function ReminderButton({ sessionId, label, visitDate }: { sessionId: string; label: string; visitDate: string }) {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    const reminders = JSON.parse(localStorage.getItem("arogya_reminders") ?? "[]") as Reminder[];
    return reminders.some((reminder) => reminder.topicId === sessionId);
  });

  function toggleReminder() {
    const reminders = JSON.parse(localStorage.getItem("arogya_reminders") ?? "[]") as Reminder[];
    if (saved) {
      localStorage.setItem("arogya_reminders", JSON.stringify(reminders.filter((reminder) => reminder.topicId !== sessionId)));
      setSaved(false);
      return;
    }
    localStorage.setItem(
      "arogya_reminders",
      JSON.stringify([
        ...reminders,
        {
          topicType: "visiting_session",
          topicId: sessionId,
          label,
          visitDate,
          consentedAt: new Date().toISOString()
        }
      ])
    );
    setSaved(true);
  }

  return <button onClick={toggleReminder}>{saved ? "Reminder saved" : "Save reminder"}</button>;
}
