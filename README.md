# taskly

A minimal, elegant task manager that runs entirely in your browser — no sign-up, no server, no fuss.

![Taskly screenshot](screenshot.png)

## Features

- **Categories** — organise tasks into custom categories (default: *Inbox*); add or delete them on the fly
- **Hashtag filtering** — tag tasks with `#hashtags` and filter your board instantly by clicking any tag
- **Deadlines** — set a date and time for each task; overdue tasks are automatically flagged with an *Overdue!* badge
- **Desktop notifications** — get notified when a task deadline arrives (browser permission required)
- **Completed tasks** — mark tasks done and they move to a separate *Completed Tasks* section
- **Persistent storage** — everything is saved to `localStorage`; your tasks survive page refreshes and browser restarts
- **Responsive design** — works on desktop and mobile; sidebar collapses gracefully on small screens

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 · [Bootstrap Icons](https://icons.getbootstrap.com/) · [Animate.css](https://animate.style/) · [Manrope](https://fonts.google.com/specimen/Manrope) (Google Fonts) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | `localStorage` |

No build step, no frameworks, no dependencies to install.

## Getting Started

```bash
git clone https://github.com/shnkr-ishan/taskly.git
cd taskly
```

Then open `index.html` in any modern browser — that's it.

> **Tip:** For the best experience (notifications, etc.), serve the files over a local server rather than opening as a `file://` URL:
> ```bash
> npx serve .
> # or
> python -m http.server 8080
> ```

## Usage

| Action | How |
|---|---|
| Add a task | Click **+** in the top-right corner |
| Switch category | Click **☰** to open the sidebar, then pick a category |
| Add a category | Open the sidebar → *Add Category* |
| Delete a category | Click the **🗑 Category** button (bottom-right) |
| Filter by hashtag | Click any `#tag` pill in the filter strip |
| Mark complete | Click the ✔ button on a task card |
| Delete a task | Click the 🗑 button on a task card |
| Refresh view | Click **↻** in the filter strip |

### Adding a task

Fill in the modal that appears after clicking **+**:

- **Description** — the task body
- **Deadline** — date and time (defaults to now)
- **Tag** — one or more hashtags, e.g. `#work #urgent`
- **Category** — auto-filled from the currently selected category

## Project Structure

```
taskly/
├── index.html   # App shell & markup
├── style.css    # All styling
├── index.js     # All logic (no framework)
├── logo.svg     # Wordmark shown in the navbar
└── icon.svg     # Favicon
```

## Browser Support

Any modern browser that supports `localStorage` and the [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) (Chrome, Firefox, Edge, Safari 16+).

## License

MIT
