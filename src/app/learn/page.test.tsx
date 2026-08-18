import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LearnPage from "./page";

const mocks = vi.hoisted(() => ({ configured: vi.fn(), getUser: vi.fn(), songs: vi.fn(), redirect: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    <a href={String(href)} {...props}>{children}</a>,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/env", () => ({ isSupabaseConfigured: mocks.configured }));
vi.mock("@/components/JamUnavailable", () => ({ JamUnavailable: () => <div>Supabase unavailable</div> }));
vi.mock("@/components/ui/AppNav", () => ({
  AppShell: ({ children, initials }: { children: React.ReactNode; initials: string }) =>
    <div data-testid="app-shell" data-initials={initials}>{children}</div>,
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: { getUser: mocks.getUser },
    from: () => ({ select: () => ({ order: () => ({ limit: mocks.songs }) }) }),
  }),
}));

describe("LearnPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.configured.mockReturnValue(true);
    mocks.redirect.mockImplementation(() => { throw new Error("NEXT_REDIRECT"); });
  });

  it("renders the unavailable state without querying Supabase", async () => {
    mocks.configured.mockReturnValue(false);
    render(await LearnPage());
    expect(screen.getByText("Supabase unavailable")).toBeInTheDocument();
    expect(mocks.getUser).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated visitors", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    await expect(LearnPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });

  it("renders an empty state with a keyboard-accessible link", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { email: "alex@example.com", user_metadata: {} } } });
    mocks.songs.mockResolvedValue({ data: [] });
    render(await LearnPage());
    expect(screen.getByRole("heading", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByText("Songs learned").parentElement).toHaveTextContent("0");
    const emptyLink = screen.getByRole("link", { name: /Add songs/ });
    const activated = vi.fn((event: Event) => event.preventDefault());
    emptyLink.addEventListener("click", activated);
    emptyLink.focus();
    await userEvent.keyboard("{Enter}");
    expect(activated).toHaveBeenCalledOnce();
    expect(emptyLink).toHaveAttribute("href", "/library");
  });

  it("renders recent songs and coach destinations", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { email: "alex@example.com", user_metadata: { display_name: "Alex Rivera" } } } });
    mocks.songs.mockResolvedValue({ data: [{ id: "one", title: "First Song" }, { id: "two", title: "Second Song" }] });
    render(await LearnPage());
    expect(screen.getByTestId("app-shell")).toHaveAttribute("data-initials", "AR");
    expect(screen.getByText("Songs learned").parentElement).toHaveTextContent("2");
    expect(screen.getAllByRole("link", { name: /First Song/ })[0]).toHaveAttribute("href", "/songs/one/coach");
    expect(screen.getByRole("link", { name: /Second Song/ })).toHaveAttribute("href", "/songs/two/coach");
  });
});
