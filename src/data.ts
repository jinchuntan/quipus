export type Meeting = {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
  duration: string;
  people: string[];
  topic: string;
  summary: string;
  decisions: string[];
  transcript: { speaker: string; time: string; text: string }[];
  related: string[];
};
export type FollowUp = {
  id: string;
  title: string;
  owner: string;
  due: string;
  meetingId: string;
  kind: "task" | "calendar";
};

// Fictional content for a clearly labelled, self-contained product demo.
export const people = [
  {
    name: "Maya Chen",
    initials: "MC",
    role: "Product lead",
    company: "Northstar",
    color: "peach",
  },
  {
    name: "Alex Morgan",
    initials: "AM",
    role: "Founder",
    company: "Northstar",
    color: "sage",
  },
  {
    name: "Sam Rivera",
    initials: "SR",
    role: "Design partner",
    company: "Fieldwork",
    color: "lavender",
  },
  {
    name: "Jordan Lee",
    initials: "JL",
    role: "Operations lead",
    company: "Fieldwork",
    color: "blue",
  },
];

export const meetings: Meeting[] = [
  {
    id: "northstar-review",
    title: "The next chapter for Northstar",
    company: "Northstar",
    date: "2026-10-16",
    time: "10:30 AM",
    duration: "32 min",
    people: ["Maya Chen", "Alex Morgan"],
    topic: "Product",
    summary:
      "A smaller pilot. A clearer first week. The team agreed to start with three customers and learn before expanding.",
    decisions: [
      "Begin with three pilot customers.",
      "Make onboarding one step shorter.",
      "Review feedback together next week.",
    ],
    transcript: [
      {
        speaker: "Maya Chen",
        time: "02:14",
        text: "The first week is where people need the most help. Let’s make that feel effortless.",
      },
      {
        speaker: "Alex Morgan",
        time: "08:42",
        text: "Three customers is enough to start. We can learn with them before opening the pilot further.",
      },
      {
        speaker: "You",
        time: "18:09",
        text: "I’ll send the revised pilot outline on Monday, then we can review the first round of feedback together.",
      },
    ],
    related: ["northstar-intro"],
  },
  {
    id: "fieldwork-design",
    title: "Making room for better conversations",
    company: "Fieldwork",
    date: "2026-10-15",
    time: "2:00 PM",
    duration: "24 min",
    people: ["Sam Rivera", "Jordan Lee"],
    topic: "Design",
    summary:
      "Keep the experience quiet: fewer controls, an obvious recording state, and a short recap after every meeting.",
    decisions: [
      "Use a single primary recording control.",
      "Keep the recording indicator visible.",
      "Show three key takeaways first.",
    ],
    transcript: [
      {
        speaker: "Sam Rivera",
        time: "01:26",
        text: "It should feel like something that belongs on a meeting table, without asking for attention.",
      },
      {
        speaker: "Jordan Lee",
        time: "09:31",
        text: "Everyone needs to know when it is recording. That should be clear from across the table.",
      },
      {
        speaker: "You",
        time: "20:05",
        text: "I’ll share a simpler screen layout and an updated enclosure concept.",
      },
    ],
    related: ["fieldwork-discovery"],
  },
  {
    id: "northstar-intro",
    title: "A first conversation with Northstar",
    company: "Northstar",
    date: "2026-10-13",
    time: "11:00 AM",
    duration: "41 min",
    people: ["Alex Morgan", "Maya Chen"],
    topic: "Discovery",
    summary:
      "Northstar wants a clearer picture of customer conversations. A small pilot will test whether shared context helps the team follow through.",
    decisions: [
      "Start with the customer success team.",
      "Keep original recordings available.",
      "Agree on a pilot scope before adding integrations.",
    ],
    transcript: [
      {
        speaker: "Alex Morgan",
        time: "04:12",
        text: "We have good conversations, but the context often stays with the person who was there.",
      },
      {
        speaker: "Maya Chen",
        time: "16:03",
        text: "Let’s start small and see whether the team actually comes back to the notes.",
      },
    ],
    related: ["northstar-review"],
  },
  {
    id: "fieldwork-discovery",
    title: "What a meeting leaves behind",
    company: "Fieldwork",
    date: "2026-10-12",
    time: "9:30 AM",
    duration: "28 min",
    people: ["Sam Rivera"],
    topic: "Discovery",
    summary:
      "The useful part is what happens next: a decision remembered, a promise kept, or a conversation picked up with context.",
    decisions: [
      "Prioritise useful follow-ups over long summaries.",
      "Let people review actions before anything is sent.",
    ],
    transcript: [
      {
        speaker: "Sam Rivera",
        time: "06:18",
        text: "I don’t want another inbox. I want to know what we agreed and what I need to do.",
      },
    ],
    related: ["fieldwork-design"],
  },
];

export const followUps: FollowUp[] = [
  {
    id: "outline",
    title: "Share the revised pilot outline",
    owner: "You",
    due: "Oct 19",
    meetingId: "northstar-review",
    kind: "task",
  },
  {
    id: "review",
    title: "Review the first pilot feedback",
    owner: "You + Maya",
    due: "Oct 20",
    meetingId: "northstar-review",
    kind: "calendar",
  },
  {
    id: "screens",
    title: "Send the simpler screen layout",
    owner: "You",
    due: "Oct 19",
    meetingId: "fieldwork-design",
    kind: "task",
  },
  {
    id: "customers",
    title: "Shortlist three pilot customers",
    owner: "Alex",
    due: "Oct 20",
    meetingId: "northstar-intro",
    kind: "task",
  },
];

export function searchMeetings(query: string, list = meetings) {
  const q = query.trim().toLocaleLowerCase();
  return list.filter((m) =>
    [m.title, m.company, m.summary, m.topic, ...m.people, ...m.decisions]
      .join(" ")
      .toLocaleLowerCase()
      .includes(q),
  );
}

export function meetingMarkdown(meeting: Meeting) {
  return `# ${meeting.title}\n\nQuipus · Fictional sample conversation\n${meeting.date} · ${meeting.duration}\n${meeting.people.join(", ")}\n\n## Recap\n${meeting.summary}\n\n## Decisions\n${meeting.decisions.map((x) => `- ${x}`).join("\n")}\n\n## Follow-ups\n${
    followUps
      .filter((x) => x.meetingId === meeting.id)
      .map((x) => `- ${x.title} — ${x.owner}, ${x.due}`)
      .join("\n") || "None"
  }\n\n## Transcript excerpt (sample)\n${meeting.transcript.map((x) => `${x.time} · ${x.speaker}\n${x.text}`).join("\n\n")}\n`;
}

const escapeICS = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
const stamp = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
export function calendarFile(title: string, date: string, time: string) {
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime()))
    throw new Error("Choose a valid date and time.");
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Quipus//Sample workspace//EN",
    "BEGIN:VEVENT",
    `UID:${globalThis.crypto.randomUUID()}@quipus.local`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeICS(title)}`,
    "DESCRIPTION:Fictional Quipus demo. No attendees invited.",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
