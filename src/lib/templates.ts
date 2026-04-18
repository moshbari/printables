// The 6 big-button template tiles the user can pick on the generator page.
// Click-only UX: no dropdowns. Each tile is one big button.
export const TEMPLATES = [
  { id: "planner",   label: "Planner",       emoji: "📆", blurb: "Daily / weekly planner" },
  { id: "journal",   label: "Journal",       emoji: "📓", blurb: "Guided prompt journal" },
  { id: "checklist", label: "Checklist",     emoji: "✅", blurb: "Step-by-step checklist" },
  { id: "workbook",  label: "Workbook",      emoji: "📘", blurb: "Fill-in workbook" },
  { id: "wallart",   label: "Wall Art",      emoji: "🖼️", blurb: "Printable wall quote" },
  { id: "kids",      label: "Kids Activity", emoji: "🎨", blurb: "Fun sheets for kids" },
] as const;

export type TemplateId = typeof TEMPLATES[number]["id"];
