# 🎨 White Caves Real Estate — Official Brand Design System & Color Tokens

> **Statutory Authority:** Single source of truth from `White-Caves-Frontend/src/design-tokens/colors.ts` & `src/styles/theme.ts`.  
> **AEGIS Color Lockdown Directive:** White Caves Red (`#EF4444`) is the exclusive brand primary. Traditional real estate gold (`#C9A84C`) and obsidian black are strictly forbidden.

---

## 1. 🏛️ Core Brand Palette

| Role | Color Name | Hex Code | Preview | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | **White Caves Red** | `#EF4444` | ![#EF4444](https://via.placeholder.com/15/EF4444/000000?text=+) `rgb(239, 68, 68)` | CTAs, Primary Brand Logo, Active States, Key Highlights |
| **Primary Hover** | **Crimson Dark** | `#DC2626` | ![#DC2626](https://via.placeholder.com/15/DC2626/000000?text=+) `rgb(220, 38, 38)` | Button hover & active interaction |
| **Secondary Accent** | **Sky Blue** | `#0EA5E9` | ![#0EA5E9](https://via.placeholder.com/15/0EA5E9/000000?text=+) `rgb(14, 165, 233)` | Interactive links, badges, secondary highlights |
| **Success / Verified** | **Emerald Green** | `#10B981` | ![#10B981](https://via.placeholder.com/15/10B981/000000?text=+) `rgb(16, 185, 129)` | RERA Verified properties, online agents, approvals |
| **Warning / Escrow** | **Amber Gold** | `#F59E0B` | ![#F59E0B](https://via.placeholder.com/15/F59E0B/000000?text=+) `rgb(245, 158, 11)` | Pending contract reviews, payment reminders |
| **Error / Alert** | **Rose Error** | `#EF4444` | ![#EF4444](https://via.placeholder.com/15/EF4444/000000?text=+) `rgb(239, 68, 68)` | Form validation errors, security blocks |

---

## 2. ☀️ The Official Light Theme (`lightTheme`)

Designed for clarity, luxury typography, and clean contrast under bright conditions:

```css
:root {
  /* Surface & Canvas */
  --bg-primary: #FFFFFF;          /* Pure White Canvas */
  --bg-secondary: #F9FAFB;        /* Subtle Luxury Gray Background */
  --bg-tertiary: #F3F4F6;         /* Elevated Container Surface */
  --card-bg: #FFFFFF;             /* Crisp Card Background */

  /* Typography & Text */
  --text-primary: #1F2937;        /* Deep Charcoal / Near-Black for Body & Headers */
  --text-secondary: #6B7280;      /* Muted Slate for Subtitles & Meta */
  --text-tertiary: #9CA3AF;       /* Light Slate for Timestamps & Footers */
  --text-inverse: #FFFFFF;        /* White text for Red buttons */

  /* Borders & Dividers */
  --border-light: #F3F4F6;        /* Subtle internal dividers */
  --border-medium: #E5E7EB;       /* Standard card borders */
  --border-dark: #D1D5DB;         /* Input field active borders */

  /* Interactive States */
  --btn-primary: #EF4444;         /* White Caves Red */
  --btn-primary-hover: #DC2626;   /* Darker Red */
  --active-bg: #FCE4E6;           /* Subtle pinkish-red selected row highlight */
  --hover-bg: #F9FAFB;            /* Table row hover */
  --focus-ring: #3B82F6;          /* Keyboard accessibility focus */
}
```

---

## 3. 🌙 Dark Theme (`darkTheme`) Comparison

| UI Element | ☀️ Light Theme (`lightTheme`) | 🌙 Dark Theme (`darkTheme`) |
| :--- | :--- | :--- |
| **Page Background** | `#F9FAFB` | `#0B132B` *(Deep Night Sky)* / `#090D16` |
| **Card Surface** | `#FFFFFF` | `#1C2541` *(Midnight Slate)* |
| **Primary Text** | `#1F2937` *(Deep Charcoal)* | `#F9FAFB` *(Off-White)* |
| **Secondary Text** | `#6B7280` *(Muted Gray)* | `#94A3B8` *(Cool Gray)* |
| **Card Border** | `#E5E7EB` *(Soft Gray)* | `#334155` *(Slate Border)* |
| **Brand Primary** | `#EF4444` *(White Caves Red)* | `#EF4444` *(White Caves Red)* |
| **Selection Highlight** | `#FCE4E6` *(Soft Red Tint)* | `rgba(239, 68, 68, 0.15)` |

---

## 4. 💻 Tailwind CSS Palette Configuration

To use these in Tailwind:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgba(239, 68, 68, 0.05)',
          100: 'rgba(239, 68, 68, 0.1)',
          400: '#F87171',
          500: '#EF4444', // Canonical White Caves Red
          600: '#DC2626',
          700: '#B91C1C',
        },
        sky: {
          500: '#0EA5E9',
        },
        // Light theme surfaces
        surface: {
          light: '#FFFFFF',
          muted: '#F9FAFB',
          card: '#FFFFFF',
          border: '#E5E7EB',
        }
      }
    }
  }
}
```
