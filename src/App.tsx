import { useEffect, useRef, useState, type ReactNode } from "react";
import { Brand, Icon } from "./Icons";
import {
  calendarFile,
  followUps,
  meetingMarkdown,
  meetings,
  people,
  searchMeetings,
  type FollowUp,
  type Meeting,
} from "./data";

type View = "conversations" | "people" | "follow-ups";
const storageKey = "quipus:sample:completed:v1";
const shortDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const person = people.find((p) => p.name === name);
  return (
    <span
      className={`avatar ${person?.color || "sage"} ${small ? "mini" : ""}`}
      title={name}
    >
      {person?.initials || name.slice(0, 2)}
    </span>
  );
}

function Dialog({
  title,
  children,
  onClose,
  className = "",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          aria-label="Close dialog"
          onClick={onClose}
          autoFocus
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  );
}

function Landing({ openDemo }: { openDemo: () => void }) {
  return (
    <div className="landing">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="landing-nav">
        <a href="/" aria-label="Quipus home">
          <Brand />
        </a>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="https://www.fovea.space/" target="_blank" rel="noreferrer">
            By Fovea <Icon name="diagonal" size={13} />
          </a>
        </nav>
        <button className="button dark compact" onClick={openDemo}>
          Explore demo <Icon name="arrow" size={16} />
        </button>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" /> A little more present.
            </p>
            <h1>
              Every conversation.
              <br />
              <span>Connected.</span>
            </h1>
            <p className="hero-description">
              Remember the people, the promises,
              <br className="desktop-br" /> and what comes next.
            </p>
            <button className="button dark hero-cta" onClick={openDemo}>
              Meet Quipus <Icon name="arrow" />
            </button>
            <p className="quiet-label">
              A memory for your business conversations.
            </p>
          </div>
          <figure className="hero-visual">
            <img
              src="/quipus-concept.png"
              alt="Fovea-branded Quipus recorder concept with a recording timer and small status screen"
              fetchPriority="high"
              width="1536"
              height="1024"
            />
            <figcaption>
              <span>SMALL DEVICE. SHARED MEMORY.</span>
              <span>
                Prototype concept <span className="tiny-plus">+</span>
              </span>
            </figcaption>
          </figure>
        </section>
        <section
          className="story-strip"
          id="how-it-works"
          aria-label="How Quipus works"
        >
          <div>
            <span className="step-number">01</span>
            <div>
              <h2>Be in the room.</h2>
              <p>Record intentionally, with everyone’s consent.</p>
            </div>
          </div>
          <div>
            <span className="step-number">02</span>
            <div>
              <h2>Keep the context.</h2>
              <p>People, decisions and conversations, connected.</p>
            </div>
          </div>
          <div>
            <span className="step-number">03</span>
            <div>
              <h2>Follow through.</h2>
              <p>Clear next steps. You approve every action.</p>
            </div>
          </div>
        </section>
        <section className="memory-section">
          <div className="memory-copy">
            <p className="eyebrow">AFTER THE CONVERSATION</p>
            <h2>
              The thread
              <br />
              doesn’t end here.
            </h2>
            <p>Pick up where you left off.</p>
            <button className="text-button" onClick={openDemo}>
              Explore a sample conversation <Icon name="arrow" size={18} />
            </button>
          </div>
          <button
            className="memory-preview"
            onClick={openDemo}
            aria-label="Open the Northstar sample conversation workspace"
          >
            <div className="preview-heading">
              <span className="status-label">
                <span className="live-dot" /> Conversation remembered
              </span>
              <Icon name="diagonal" size={20} />
            </div>
            <h3>The next chapter for Northstar</h3>
            <div className="preview-people">
              <span className="avatar-stack">
                <Avatar name="Maya Chen" small />
                <Avatar name="Alex Morgan" small />
              </span>
              <span>
                Maya, Alex & you <span>· 32 min</span>
              </span>
            </div>
            <div className="preview-divider" />
            <p className="preview-note">Start small. Learn together.</p>
            <div className="preview-task">
              <span className="task-checkbox" />
              <span>Share the revised pilot outline</span>
              <span>Mon</span>
            </div>
            <div className="connection-line">
              <Icon name="link" size={16} /> Connected to your first
              conversation
            </div>
            <span className="sample-caption">Illustrative sample</span>
          </button>
        </section>
        <section className="closing">
          <div>
            <p className="eyebrow">LESS TO HOLD IN YOUR HEAD.</p>
            <h2>More room to listen.</h2>
          </div>
          <a
            className="button dark"
            href="mailto:contact@fovea.space?subject=Quipus%20prototype"
          >
            Let’s talk <Icon name="diagonal" size={18} />
          </a>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand small />
        <span>A Fovea project. In development.</span>
        <a
          href="https://www.fovea.space/"
          target="_blank"
          rel="noreferrer"
          className="fovea-credit"
        >
          <img src="/fovea-logo.webp" width="38" height="17" alt="" />
          Fovea <Icon name="diagonal" size={12} />
        </a>
      </footer>
    </div>
  );
}

function TaskRow({
  task,
  completed,
  toggle,
  review,
}: {
  task: FollowUp;
  completed: boolean;
  toggle: () => void;
  review: () => void;
}) {
  return (
    <div className={`task-row ${completed ? "is-complete" : ""}`}>
      <button
        className="task-checkbox"
        role="checkbox"
        aria-checked={completed}
        aria-label={`Complete: ${task.title}`}
        onClick={toggle}
      >
        {completed && <Icon name="check" size={13} />}
      </button>
      <div className="task-content">
        <span>{task.title}</span>
        <small>
          {task.owner} <span>·</span> {task.due}
        </small>
      </div>
      {task.kind === "calendar" && !completed && (
        <button
          className="icon-button"
          aria-label={`Review calendar draft: ${task.title}`}
          title="Review calendar draft"
          onClick={review}
        >
          <Icon name="calendar" size={17} />
        </button>
      )}
    </div>
  );
}

function CalendarReview({
  task,
  close,
  notify,
}: {
  task: FollowUp;
  close: () => void;
  notify: (text: string) => void;
}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const localDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  const [title, setTitle] = useState(task.title),
    [date, setDate] = useState(localDate),
    [time, setTime] = useState("10:00");
  const [error, setError] = useState("");
  return (
    <Dialog
      title="Review calendar draft"
      onClose={close}
      className="small-dialog"
    >
      <p className="eyebrow">YOU’RE IN CONTROL</p>
      <h2>Review this next step.</h2>
      <p className="muted">Download a calendar file. No invitation is sent.</p>
      <form
        className="calendar-form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            download(
              calendarFile(title, date, time),
              "quipus-follow-up.ics",
              "text/calendar;charset=utf-8",
            );
            close();
            notify("Calendar file downloaded. No invitation sent.");
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Could not prepare the calendar file.",
            );
          }
        }}
      >
        <label>
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={180}
          />
        </label>
        <div className="form-pair">
          <label>
            Date
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Time
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>
        <small className="muted">30 minutes · Your local time zone</small>
        {error && <p role="alert">{error}</p>}
        <button className="button dark" type="submit">
          Download calendar file <Icon name="download" size={17} />
        </button>
      </form>
    </Dialog>
  );
}

function MeetingDetail({
  meeting,
  close,
  openRelated,
  completed,
  toggle,
  review,
  notify,
}: {
  meeting: Meeting;
  close: () => void;
  openRelated: (m: Meeting) => void;
  completed: string[];
  toggle: (id: string) => void;
  review: (t: FollowUp) => void;
  notify: (text: string) => void;
}) {
  const [tab, setTab] = useState<"recap" | "transcript">("recap");
  const tasks = followUps.filter((t) => t.meetingId === meeting.id);
  return (
    <Dialog title={meeting.title} onClose={close} className="meeting-dialog">
      <p className="eyebrow">
        {meeting.company} <span> / </span> {shortDate(meeting.date)}
      </p>
      <h2>{meeting.title}</h2>
      <div className="detail-meta">
        <span className="avatar-stack">
          {meeting.people.map((name) => (
            <Avatar key={name} name={name} small />
          ))}
        </span>
        <span>{meeting.people.join(", ")} & you</span>
        <span>· {meeting.duration}</span>
      </div>
      <div className="detail-toolbar">
        <div
          className="segmented"
          role="tablist"
          aria-label="Conversation details"
        >
          <button
            role="tab"
            id="recap-tab"
            aria-controls="detail-panel"
            aria-selected={tab === "recap"}
            className={tab === "recap" ? "active" : ""}
            onClick={() => setTab("recap")}
          >
            Recap
          </button>
          <button
            role="tab"
            id="transcript-tab"
            aria-controls="detail-panel"
            aria-selected={tab === "transcript"}
            className={tab === "transcript" ? "active" : ""}
            onClick={() => setTab("transcript")}
          >
            Transcript
          </button>
        </div>
        <button
          className="text-button"
          onClick={() => {
            download(
              meetingMarkdown(meeting),
              `${meeting.id}.md`,
              "text/markdown;charset=utf-8",
            );
            notify("Conversation notes downloaded.");
          }}
        >
          <Icon name="download" size={16} /> Export notes
        </button>
      </div>
      <div id="detail-panel" role="tabpanel" aria-labelledby={`${tab}-tab`}>
        {tab === "recap" ? (
          <>
            <p className="detail-summary">{meeting.summary}</p>
            <h3 className="section-label">Decisions</h3>
            <ul className="decisions">
              {meeting.decisions.map((d) => (
                <li key={d}>
                  <Icon name="check" size={16} />
                  {d}
                </li>
              ))}
            </ul>
            {tasks.length > 0 && (
              <>
                <h3 className="section-label">Next steps</h3>
                <div className="detail-tasks">
                  {tasks.map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      completed={completed.includes(t.id)}
                      toggle={() => toggle(t.id)}
                      review={() => review(t)}
                    />
                  ))}
                </div>
              </>
            )}
            <h3 className="section-label">The thread</h3>
            {meeting.related.map((id) => {
              const related = meetings.find((m) => m.id === id)!;
              return (
                <button
                  key={id}
                  className="related-meeting"
                  onClick={() => {
                    setTab("recap");
                    openRelated(related);
                  }}
                >
                  <Icon name="link" size={18} />
                  <span>
                    {related.title}
                    <small>
                      {shortDate(related.date)} · {related.company}
                    </small>
                  </span>
                  <Icon name="arrow" size={18} />
                </button>
              );
            })}
          </>
        ) : (
          <div className="transcript">
            <p className="muted transcript-notice">
              Sample excerpt · No audio attached
            </p>
            {meeting.transcript.map((line, i) => (
              <div className="transcript-line" key={i}>
                <span>{line.time}</span>
                <div>
                  <strong>{line.speaker}</strong>
                  <p>{line.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="detail-footnote">Fictional sample conversation</p>
    </Dialog>
  );
}

function Workspace({ exit }: { exit: () => void }) {
  const [view, setView] = useState<View>("conversations"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState<"all" | "follow-ups">("all");
  const [selected, setSelected] = useState<Meeting | null>(null),
    [calendar, setCalendar] = useState<FollowUp | null>(null),
    [device, setDevice] = useState(false);
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      );
      return Array.isArray(value)
        ? value.filter(
            (x): x is string =>
              typeof x === "string" && followUps.some((t) => t.id === x),
          )
        : [];
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState(""),
    [storageUnavailable, setStorageUnavailable] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed));
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }, [completed]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !selected &&
        !calendar &&
        !device &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (event.target as HTMLElement)?.tagName,
        )
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, calendar, device]);
  const toggle = (id: string) =>
    setCompleted((previous) =>
      previous.includes(id)
        ? previous.filter((x) => x !== id)
        : [...previous, id],
    );
  const openTasks = followUps.filter((t) => !completed.includes(t.id));
  const matches = searchMeetings(query).filter(
    (m) => filter === "all" || openTasks.some((t) => t.meetingId === m.id),
  );
  const navigate = (next: View) => {
    setView(next);
    setQuery("");
    setFilter("all");
  };
  const review = (task: FollowUp) => {
    setSelected(null);
    setCalendar(task);
  };
  const title =
    view === "conversations"
      ? "A little context goes a long way."
      : view === "people"
        ? "The people behind the conversation."
        : "Good conversations lead somewhere.";

  return (
    <div className="workspace">
      <a className="skip-link" href="#workspace-main">
        Skip to content
      </a>
      <aside className="sidebar">
        <button className="brand-home" onClick={exit} aria-label="Quipus home">
          <Brand />
        </button>
        <div className="workspace-switch">
          <span className="workspace-monogram">F</span>
          <div>
            My workspace<small>Sample workspace</small>
          </div>
          <span className="workspace-dots">···</span>
        </div>
        <p className="nav-label">YOUR MEMORY</p>
        <nav aria-label="Workspace navigation">
          {(
            [
              {
                id: "conversations",
                label: "Conversations",
                icon: "conversations",
              },
              { id: "people", label: "People", icon: "people" },
              { id: "follow-ups", label: "Follow-ups", icon: "tasks" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              aria-label={item.label}
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.id === "follow-ups" && openTasks.length > 0 && (
                <span className="nav-count">{openTasks.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="device-link" onClick={() => setDevice(true)}>
            <span className="device-icon">
              <Icon name="device" size={19} />
            </span>
            <span>
              Quipus device<small>Not connected</small>
            </span>
            <Icon name="chevron" size={15} />
          </button>
          <div className="sidebar-footer">
            <span className="user-avatar">Y</span>
            <span>
              Your space<small>Quipus by Fovea</small>
            </span>
            <button
              className="icon-button"
              aria-label="Return to product page"
              onClick={exit}
            >
              <Icon name="diagonal" size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-header">
          <span className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>
              {view === "follow-ups"
                ? "Follow-ups"
                : view[0].toUpperCase() + view.slice(1)}
            </strong>
          </span>
          <div className="header-right">
            <span className="demo-badge">Sample data</span>
            <button className="text-button exit-demo" onClick={exit}>
              Exit demo <Icon name="diagonal" size={14} />
            </button>
          </div>
        </header>
        <main className="workspace-main" id="workspace-main">
          <div className="workspace-title">
            <div>
              <p className="eyebrow">
                {view === "conversations"
                  ? "YOUR CONVERSATIONS, CONNECTED"
                  : view === "people"
                    ? "FAMILIAR FACES. SHARED CONTEXT."
                    : "A LITTLE FOLLOW-THROUGH"}
              </p>
              <h1>{title}</h1>
            </div>
            <span className="workspace-date">
              Oct 2026 <span>·</span> Sample
            </span>
          </div>
          <div className="workspace-columns">
            <section className="primary-column" aria-label={view}>
              <div className="list-toolbar">
                <label className="search">
                  <Icon name="search" size={18} />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      view === "people"
                        ? "Find someone…"
                        : view === "follow-ups"
                          ? "Find a follow-up…"
                          : "Search your conversations…"
                    }
                    aria-label="Search workspace"
                  />
                  <kbd>/</kbd>
                </label>
                {view === "conversations" && (
                  <div
                    className="segmented filters"
                    aria-label="Filter conversations"
                  >
                    <button
                      className={filter === "all" ? "active" : ""}
                      aria-pressed={filter === "all"}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </button>
                    <button
                      className={filter === "follow-ups" ? "active" : ""}
                      aria-pressed={filter === "follow-ups"}
                      onClick={() => setFilter("follow-ups")}
                    >
                      With follow-ups
                    </button>
                  </div>
                )}
              </div>
              {view === "conversations" && (
                <>
                  <div className="list-heading">
                    <h2>Recent conversations</h2>
                    <span>
                      {matches.length}{" "}
                      {matches.length === 1 ? "conversation" : "conversations"}
                    </span>
                  </div>
                  <div className="meeting-list">
                    {matches.map((m) => (
                      <button
                        className="meeting-row"
                        aria-label={`${m.title}. ${m.company}. ${shortDate(m.date)}. ${m.duration}`}
                        key={m.id}
                        onClick={() => setSelected(m)}
                      >
                        <span
                          className={`meeting-symbol ${m.company === "Northstar" ? "sage" : "peach"}`}
                        >
                          <Icon name="wave" size={21} />
                        </span>
                        <span className="meeting-row-main">
                          <span className="meeting-row-title">{m.title}</span>
                          <span className="meeting-row-subtitle">
                            {m.company} <span>·</span>{" "}
                            {m.people.map((p) => p.split(" ")[0]).join(", ")} &
                            you
                          </span>
                          <span className="mobile-meeting-date">
                            {shortDate(m.date)} · {m.duration}
                          </span>
                        </span>
                        <span className="meeting-row-date">
                          {shortDate(m.date)}
                          <small>{m.duration}</small>
                        </span>
                        <Icon name="chevron" size={17} />
                      </button>
                    ))}
                  </div>
                  {matches.length === 0 && (
                    <Empty
                      title="No conversations found."
                      clear={() => {
                        setQuery("");
                        setFilter("all");
                      }}
                    />
                  )}
                  <div className="memory-note">
                    <Icon name="shield" size={17} />
                    <span>
                      This demo uses fictional conversations. Nothing is
                      recorded or sent.
                    </span>
                  </div>
                </>
              )}
              {view === "people" && (
                <>
                  <div className="list-heading">
                    <h2>Your circle</h2>
                    <span>{people.length} people</span>
                  </div>
                  <div className="people-grid">
                    {people
                      .filter((p) =>
                        `${p.name} ${p.role} ${p.company}`
                          .toLowerCase()
                          .includes(query.trim().toLowerCase()),
                      )
                      .map((p) => (
                        <button
                          key={p.name}
                          className="person-card"
                          onClick={() => {
                            setView("conversations");
                            setQuery(p.name);
                          }}
                        >
                          <Avatar name={p.name} />
                          <h2>{p.name}</h2>
                          <p>
                            {p.role} · {p.company}
                          </p>
                          <span>
                            {
                              meetings.filter((m) => m.people.includes(p.name))
                                .length
                            }{" "}
                            conversations <Icon name="arrow" size={16} />
                          </span>
                        </button>
                      ))}
                  </div>
                  {!people.some((p) =>
                    `${p.name} ${p.role} ${p.company}`
                      .toLowerCase()
                      .includes(query.trim().toLowerCase()),
                  ) && (
                    <Empty
                      title="No people found."
                      clear={() => setQuery("")}
                    />
                  )}
                </>
              )}
              {view === "follow-ups" && (
                <>
                  <div className="list-heading">
                    <h2>Next steps</h2>
                    <span>{openTasks.length} open</span>
                  </div>
                  <div className="all-tasks">
                    {followUps
                      .filter((t) =>
                        `${t.title} ${t.owner}`
                          .toLowerCase()
                          .includes(query.trim().toLowerCase()),
                      )
                      .map((t) => (
                        <div className="full-task" key={t.id}>
                          <TaskRow
                            task={t}
                            completed={completed.includes(t.id)}
                            toggle={() => toggle(t.id)}
                            review={() => review(t)}
                          />
                          <button
                            className="task-source"
                            onClick={() =>
                              setSelected(
                                meetings.find((m) => m.id === t.meetingId)!,
                              )
                            }
                          >
                            <Icon name="conversations" size={13} />
                            {meetings.find((m) => m.id === t.meetingId)?.title}
                            <Icon name="diagonal" size={12} />
                          </button>
                        </div>
                      ))}
                  </div>
                  {!followUps.some((t) =>
                    `${t.title} ${t.owner}`
                      .toLowerCase()
                      .includes(query.trim().toLowerCase()),
                  ) && (
                    <Empty
                      title="No follow-ups found."
                      clear={() => setQuery("")}
                    />
                  )}
                  <div className="memory-note">
                    <Icon name="shield" size={17} />
                    <span>
                      You review every action. No invitations or messages are
                      sent.
                    </span>
                  </div>
                </>
              )}
            </section>
            <aside className="context-column">
              <section className="next-steps">
                <div className="aside-title">
                  <h2>On your mind</h2>
                  <span>{openTasks.length}</span>
                </div>
                {openTasks.slice(0, 3).map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    completed={false}
                    toggle={() => toggle(t.id)}
                    review={() => review(t)}
                  />
                ))}
                {openTasks.length === 0 && (
                  <div className="caught-up">
                    <Icon name="check" />
                    <p>
                      A little lighter.
                      <br />
                      <span>You’re all caught up.</span>
                    </p>
                  </div>
                )}
                <button
                  className="text-button all-followups"
                  onClick={() => navigate("follow-ups")}
                >
                  All follow-ups <Icon name="arrow" size={16} />
                </button>
              </section>
              <section className="thread-card">
                <span className="thread-icon">
                  <Icon name="link" size={18} />
                </span>
                <p className="eyebrow">A THREAD WORTH PICKING UP</p>
                <h2>
                  A smaller pilot.
                  <br />A clearer direction.
                </h2>
                <p>
                  Northstar’s first conversation became a three-customer pilot.
                </p>
                <button
                  className="text-button"
                  onClick={() => setSelected(meetings[0])}
                >
                  See the connection <Icon name="arrow" size={16} />
                </button>
                <span className="thread-line" aria-hidden="true">
                  <i />
                  <span />
                  <i />
                  <span />
                  <i />
                </span>
              </section>
              <p className="context-footnote">
                Less to remember.
                <br />
                More to build on.
              </p>
            </aside>
          </div>
          {storageUnavailable && (
            <p role="status" className="memory-note">
              Browser storage is unavailable. Task changes will last until you
              close this page.
            </p>
          )}
        </main>
      </div>
      {selected && (
        <MeetingDetail
          meeting={selected}
          close={() => setSelected(null)}
          openRelated={setSelected}
          completed={completed}
          toggle={toggle}
          review={review}
          notify={setNotice}
        />
      )}
      {calendar && (
        <CalendarReview
          task={calendar}
          close={() => setCalendar(null)}
          notify={setNotice}
        />
      )}
      {device && (
        <Dialog
          title="Quipus device"
          onClose={() => setDevice(false)}
          className="small-dialog"
        >
          <div className="device-modal-icon">
            <Icon name="device" size={32} />
          </div>
          <p className="eyebrow">QUIPUS DEVICE</p>
          <h2>A place for every conversation.</h2>
          <p className="muted">
            This is a website prototype. Device pairing, audio sync and
            transcription will connect here once the firmware and backend are
            ready.
          </p>
          <div className="device-state">
            <span className="offline-dot" /> Not connected
          </div>
          <button className="button dark" onClick={() => setDevice(false)}>
            Got it <Icon name="check" size={17} />
          </button>
        </Dialog>
      )}
      {notice && (
        <div className="toast" role="status">
          <Icon name="check" size={18} />
          {notice}
        </div>
      )}
    </div>
  );
}

function Empty({ title, clear }: { title: string; clear: () => void }) {
  return (
    <div className="empty-state">
      <Icon name="search" size={28} />
      <h2>{title}</h2>
      <button className="text-button" onClick={clear}>
        Clear filters <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}

export default function App() {
  const [demo, setDemo] = useState(
    () => new URLSearchParams(window.location.search).get("mode") === "sample",
  );
  useEffect(() => {
    const pop = () =>
      setDemo(
        new URLSearchParams(window.location.search).get("mode") === "sample",
      );
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    document.title = demo
      ? "Your workspace · Quipus"
      : "Quipus — Every conversation, connected.";
  }, [demo]);
  function navigate(next: boolean) {
    const url = new URL(window.location.href);
    next
      ? url.searchParams.set("mode", "sample")
      : url.searchParams.delete("mode");
    url.hash = "";
    window.history.pushState({}, "", url);
    setDemo(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  return demo ? (
    <Workspace exit={() => navigate(false)} />
  ) : (
    <Landing openDemo={() => navigate(true)} />
  );
}
