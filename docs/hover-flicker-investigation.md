# Hover flicker investigation and fix plan

## Finding

There is no single hover handler shared by every element in the app. The strongest app-wide candidate is the global MUI `MuiCard` override in `src/theme/components.ts`: every MUI `Card` gets a hover border and shadow transition. Several feature components also repeat border/shadow hover rules. These styles animate visual properties only; the border remains 1px, so the current evidence does not show a layout-size feedback loop.

The strongest candidate for actual repeated enter/leave flicker is `JobsCarousel`. Its section toggles `paused` on `onMouseEnter` / `onMouseLeave`, while its card tracks animate with Framer Motion transforms and, in normal-motion mode, overlap absolutely positioned tracks. If the moving/overlapping track changes which card is under the stationary pointer, enter/leave can toggle autoplay repeatedly. This mechanism is localized to the carousel and cannot explain flicker across unrelated controls.

The public home hero also has a continuously animated canvas that responds to pointer movement (`src/components/layout/HeroSection.tsx`). It may make the background appear to shimmer while hovering there, but it does not alter hover state of other elements. This file already has a user modification; it was not changed.

## Root-cause assessment

**Current best explanation:** the report likely conflates two visible effects: card hover transitions (border/shadow) and carousel pointer-triggered autoplay pausing. There is not enough repository evidence to confirm a single root cause for flicker “over elements” generally. No event-handler loop or geometry-changing hover rule was found in the shared styles. A browser reproduction at the affected route is needed to distinguish a visual transition from repeated pointer boundary changes.

## Evidence inspected

- `src/theme/components.ts`: global `MuiCard` hover changes border color and shadow; button and outlined-input hover rules are also present.
- `src/components/jobs/JobRow.tsx` and `src/components/jobs/JobsCarousel.tsx`: local card border/shadow transitions; no hover-time state updates in `JobRow`.
- `src/components/jobs/JobsCarousel.tsx`: section enter/leave handlers set the autoplay pause state; card items animate via transforms with overlapping tracks when reduced motion is off.
- `src/components/layout/HeroSection.tsx`: a requestAnimationFrame canvas animation responds to `mousemove`; relevant only to the hero visual.
- Existing working-tree change: `src/components/layout/HeroSection.tsx` was modified before this investigation and was left untouched.

## Fix plan

1. Reproduce on the route where flicker is observed, recording whether it happens on all cards, only the jobs carousel, only the hero, or every hoverable control. Check pointer type and `prefers-reduced-motion` as well.
2. In DevTools, inspect the hovered element and ancestors while moving the pointer slowly. Track `mouseenter` / `mouseleave`, computed bounds, and computed `border-width`, `transform`, `box-shadow`, and `background`. A repeating enter/leave sequence with stable pointer coordinates confirms a hit-testing boundary problem; a single event with a changing shadow/color is only the intended transition.
3. If isolated to `JobsCarousel`, make autoplay pause resilient to animated track hit-testing: pause based on a stable carousel viewport/pointer region (or pause on focus and explicit interaction), and ensure exiting/entering tracks do not repeatedly change the effective hover target. Preserve manual navigation and reduced-motion behavior.
4. If reproduced across static cards, inspect the computed MUI styles and remove only the offending transition or hover property. Keep border width constant in base and hover states; prefer `outline` or color-only changes if computed geometry is changing.
5. If isolated to the hero, inspect canvas resize and animation paint cost separately from interactive hover styles; avoid tying canvas redraw or layout changes to element hover state.
6. Verify the fix with the original pointer path, keyboard focus, touch behavior, and reduced-motion preference at the affected page. Confirm no horizontal/layout shift and that carousel controls remain usable.

## Confidence and limitation

Moderate confidence that the carousel is the only identified code path capable of repeated pointer enter/leave state toggling during animation. Low confidence that it is the user's observed location because no route, browser, or reproduction was supplied. The plan deliberately avoids changing behavior until reproduction identifies which path is active.
