# ApexPlanet — Interactive UI & Frontend Development
**Internship Task 2 · Timeline: Days 13–24**

Responsive Login & Registration UI built with HTML, CSS, JavaScript, and Bootstrap 5.

## Live preview
Open `index.html` in any browser — no build step or server required.

## Objective
Create responsive, user-friendly, and interactive interfaces using HTML, CSS, JavaScript, and Bootstrap.

## What's included

| Step | Implemented as |
|---|---|
| **1. Bootstrap 5 Mastery** | 12-column responsive grid (split-screen layout), navbar, cards, modals-ready buttons, `d-none` / `d-md-block` responsive utilities on the illustration panel |
| **2. Custom Styling** | Custom teal/mint color palette (`css/style.css` design tokens), animated hover states, smooth scrolling, Google Fonts (Poppins + Inter) and Bootstrap Icons |
| **3. Form Handling with JS** | Live login & registration validation, password match check, show/hide password toggle, password-strength meter |
| **4. AJAX Basics** | `fetchCheckUsernameEndpoint()` in `js/script.js` simulates a `fetch()` call to a PHP endpoint (`check-username.php?u=...`) to check username availability without reloading the page |
| **5. Project Development** | Login & registration pages (single-page tab toggle), reusable Navbar + Footer components, fully mobile-first layout |

## File structure
```
apexplanet-login-registration-ui/
├── index.html          # Navbar, split-screen Login/Register UI, Footer
├── css/
│   └── style.css        # Design tokens, layout, animations, responsive rules
├── js/
│   └── script.js         # Tab switching, validation, password UX, dummy AJAX
└── README.md
```

## Design notes
- **Palette:** deep teal `#0B4F4A` → mint `#8FD9C4` gradient, cream background `#F8FBF9`, coral `#FF6B5B` reserved for error states only.
- **Type:** Poppins for headings/brand, Inter for body and form text.
- **Layout:** split-screen — left panel carries the brand story and a small animated "blob" background; right panel holds a single card with a sliding pill tab to switch between **Sign in** and **Create account** without a page reload.
- **Motion:** kept deliberate — a slow ambient blob drift on the brand panel, a sliding tab indicator, and a fade-up on form switch. Respects `prefers-reduced-motion`.

## Connecting to a real backend
`js/script.js` isolates the dummy check in `fakeCheckUsernameEndpoint()`. To wire it to a real PHP backend, replace the body of that function with:
```js
function fakeCheckUsernameEndpoint(username) {
  return fetch(`check-username.php?u=${encodeURIComponent(username)}`)
    .then(res => res.json());
}
```
The endpoint is expected to return `{ "available": true|false }`.

## Deliverables checklist
- [ ] Responsive Login & Registration UI with animations
- [ ] Mobile-first (tested down to ~360px width)
- [ ] Reusable Navbar & Footer
- [ ] GitHub repo link — add after pushing this folder
- [ ] 3–5 min demo video — record a walkthrough of sign-in, sign-up, validation, and the username check
