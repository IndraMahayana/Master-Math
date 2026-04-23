# Design System: Editorial Mathematics

## 1. Overview & Creative North Star
**Creative North Star: "The Cognitive Playground"**

This design system moves beyond the sterile, utilitarian nature of traditional educational software. We are not building a calculator; we are crafting a high-end, immersive environment where logic meets play. The "Cognitive Playground" philosophy balances the authority of academic excellence with the tactile joy of a physical game. 

To break the "template" look of standard Material Design, we utilize **Intentional Asymmetry** and **Tonal Depth**. Instead of rigid, centered grids, we allow math formulas to breathe with generous white space and offset alignments. We lean into "Modern Material"—a sophisticated evolution that replaces flat surfaces with layered, translucent plates and editorial-grade typography.

---

## 2. Colors
Our palette is rooted in `primary` (Deep Blue) for trust and `secondary` (Bright Cyan) for energy. However, the execution must remain premium.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries between content modules must be defined solely through background color shifts or tonal transitions. For instance, an equation block should sit on a `surface-container-low` section against a `surface` background.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, semi-opaque paper.
*   **Base:** `surface` (#f6f6f8) – The canvas.
*   **Nesting Level 1:** `surface-container-low` (#f0f1f3) – For secondary content zones.
*   **Nesting Level 2:** `surface-container-lowest` (#ffffff) – Reserved for the most important interactive cards or math problem containers.

### The "Glass & Gradient" Rule
Floating elements (like navigation bars or "level up" popups) must utilize **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` (e.g., 20px). To add "soul," use a subtle linear gradient on primary CTAs: `primary` (#4953ac) transitioning to `primary-container` (#929bfa) at a 135-degree angle.

---

## 3. Typography
The system uses a duo-font approach to balance editorial authority with mathematical precision.

*   **Display & Headlines (`Plus Jakarta Sans`):** Used for large-scale motivation and headers. The geometric nature of Plus Jakarta Sans mirrors mathematical shapes.
*   **Body & Labels (`Inter`):** Used for instructional text and UI labels due to its extreme legibility at small sizes.
*   **Specialized Math Styling:** Mathematical formulas should utilize `headline-lg` sizing but with increased letter-spacing (0.05em) and the `primary` color token to ensure they are the undisputed focal point of the screen.

| Level | Font Family | Size | Use Case |
| :--- | :--- | :--- | :--- |
| **Display-lg** | Plus Jakarta Sans | 3.5rem | High-impact achievement moments |
| **Headline-md** | Plus Jakarta Sans | 1.75rem | Topic headers (e.g., "Algebra I") |
| **Title-md** | Inter | 1.125rem | Card titles and subtitles |
| **Body-lg** | Inter | 1rem | Main instructional text |
| **Label-md** | Inter | 0.75rem | Progress indicators and metadata |

---

## 4. Elevation & Depth
We eschew traditional "drop shadows" in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking surface tiers. A `surface-container-lowest` card placed on a `surface-container-high` background creates a natural visual lift.
*   **Ambient Shadows:** When a floating effect is required (e.g., a modal), use a shadow with a large blur (32px) and 6% opacity. The shadow color must be a tinted version of `on-surface` (#2d2f31), not pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` (#acadaf) at **15% opacity**. Never use 100% opaque borders.
*   **Roundedness:** Adhere to the `xl` (3rem) scale for large math containers to evoke a friendly, "playful" feel, and `sm` (0.5rem) for functional elements like input fields.

---

## 5. Components

### Buttons
*   **Primary:** Uses the Primary-to-Primary-Container gradient. `lg` (2rem) corner radius. Height: 64px for touch-friendliness.
*   **Secondary:** Ghost style using `surface-container-high` background. No border.

### Math Cards
Cards must never use dividers. Separate the "Problem" from the "Solution" using a shift from `surface-container-lowest` to `surface-container-low`. Use `xl` (3rem) rounded corners to make the math feel approachable.

### Input Fields (The "Answer Box")
*   **State:** When focused, the answer box should glow with a subtle `secondary_fixed` (#54e3fc) shadow, signaling an active "play" state.
*   **Text:** Numeric input uses `display-md` to make the user's answer feel significant.

### Additional App-Specific Components
*   **Progress "Orb":** A circular progress indicator using `tertiary` (Success Green) with a glassmorphic center.
*   **Equation Scrubber:** A horizontal slider for variable manipulation, using the `secondary` color for the track and `primary` for the handle.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use white space as a structural element. If a screen feels crowded, increase the vertical spacing before adding a line.
*   **Do** use `plusJakartaSans` for numbers in a gamified context (scores, timers).
*   **Do** apply the `surface_variant` for subtle geometric background patterns (triangles, grids) at 5% opacity to add texture.

### Don't:
*   **Don't** use pure black (#000000) for text. Always use `on-surface` (#2d2f31) to maintain the premium editorial feel.
*   **Don't** use "Success Green" or "Error Red" as solid backgrounds for large areas; use their `container` tokens (`tertiary-container` or `error-container`) to keep the UI soft on the eyes.
*   **Don't** use standard Material 1px dividers. If you feel you need a line, use a 4px gap of the background color instead.