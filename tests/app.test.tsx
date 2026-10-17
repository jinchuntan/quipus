import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import {
  calendarFile,
  meetingMarkdown,
  meetings,
  searchMeetings,
} from "../src/data";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/?mode=sample");
});

describe("sample workspace", () => {
  it("opens the demo from the product page and updates its shareable URL", async () => {
    window.history.replaceState({}, "", "/");
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Every conversation.Connected.",
    );
    await user.click(screen.getByRole("button", { name: /Meet Quipus/i }));
    expect(window.location.search).toBe("?mode=sample");
    expect(screen.getByText("Sample data")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Recent conversations" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Exit demo/i }));
    expect(window.location.search).toBe("");
  });

  it("searches meetings, handles no results, and clears filters", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole("textbox", { name: "Search workspace" });
    await user.type(input, "Northstar");
    expect(screen.getByText("2 conversations")).toBeVisible();
    expect(
      screen.queryByRole("button", {
        name: /Making room for better conversations/,
      }),
    ).not.toBeInTheDocument();
    await user.clear(input);
    await user.type(input, "unmatched search");
    expect(screen.getByText("No conversations found.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Clear filters/ }));
    expect(screen.getByText("4 conversations")).toBeVisible();
  });

  it("opens a person’s conversation history and follows connected meetings", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: "People" }),
    );
    await user.click(
      screen.getByRole("button", { name: /Maya Chen Product lead/ }),
    );
    expect(
      screen.getByRole("textbox", { name: "Search workspace" }),
    ).toHaveValue("Maya Chen");
    await user.click(
      screen.getByRole("button", { name: /The next chapter for Northstar/ }),
    );
    let dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByText("Begin with three pilot customers."),
    ).toBeVisible();
    await user.click(within(dialog).getByRole("tab", { name: "Transcript" }));
    expect(
      within(dialog).getByText("Sample excerpt · No audio attached"),
    ).toBeVisible();
    await user.click(within(dialog).getByRole("tab", { name: "Recap" }));
    await user.click(
      within(dialog).getByRole("button", {
        name: /A first conversation with Northstar/,
      }),
    );
    dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { level: 2 })).toHaveTextContent(
      "A first conversation with Northstar",
    );
  });

  it("persists completed tasks and requires review before calendar export", async () => {
    const user = userEvent.setup();
    const app = render(<App />);
    await user.click(
      screen.getByRole("checkbox", {
        name: "Complete: Share the revised pilot outline",
      }),
    );
    expect(
      JSON.parse(localStorage.getItem("quipus:sample:completed:v1")!),
    ).toContain("outline");
    app.unmount();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: "Follow-ups" }),
    );
    expect(
      screen.getByRole("checkbox", {
        name: "Complete: Share the revised pilot outline",
      }),
    ).toBeChecked();
    const reviews = screen.getAllByRole("button", {
      name: /Review calendar draft:/,
    });
    await user.click(reviews[0]);
    const dialog = screen.getByRole("dialog", {
      name: "Review calendar draft",
    });
    expect(
      within(dialog).getByText(
        "Download a calendar file. No invitation is sent.",
      ),
    ).toBeVisible();
    expect(within(dialog).getByLabelText("Title")).toHaveValue(
      "Review the first pilot feedback",
    );
    expect(
      within(dialog).getByRole("button", { name: /Download calendar file/ }),
    ).toBeVisible();
  });

  it("exports a labelled sample note only when requested", async () => {
    const create = vi.fn().mockReturnValue("blob:sample-notes");
    vi.stubGlobal(
      "URL",
      Object.assign(URL, { createObjectURL: create, revokeObjectURL: vi.fn() }),
    );
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: /The next chapter for Northstar/ }),
    );
    expect(create).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /Export notes/ }));
    expect(create).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Conversation notes downloaded.",
    );
    click.mockRestore();
    vi.unstubAllGlobals();
  });

  it("recovers from malformed persisted state", () => {
    localStorage.setItem("quipus:sample:completed:v1", "{broken json");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Recent conversations" }),
    ).toBeVisible();
    expect(
      screen.getByRole("checkbox", {
        name: "Complete: Share the revised pilot outline",
      }),
    ).not.toBeChecked();
  });
});

describe("portable exports", () => {
  it("searches people and context without case sensitivity", () => {
    expect(searchMeetings(" MAYA ").length).toBe(2);
    expect(searchMeetings("short recap")[0].id).toBe("fieldwork-design");
    expect(meetingMarkdown(meetings[0])).toContain(
      "Fictional sample conversation",
    );
  });
  it("creates a 30 minute calendar event without invitations and escapes fields", () => {
    const result = calendarFile(
      "Review, scope; next\nstep",
      "2026-10-20",
      "10:00",
    );
    expect(result).toContain("SUMMARY:Review\\, scope\\; next\\nstep");
    expect(result).not.toContain("ATTENDEE");
    expect(result).not.toContain("METHOD:REQUEST");
    const start = result.match(/DTSTART:(.+)/)![1],
      end = result.match(/DTEND:(.+)/)![1];
    expect(start).not.toBe(end);
    expect(result.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(() => calendarFile("Invalid", "no-date", "10:00")).toThrow(
      "Choose a valid date and time.",
    );
  });
});
