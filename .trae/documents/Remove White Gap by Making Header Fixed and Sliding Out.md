## Goal
Use the `introback` image from `public` as the background for the INTRODUCING SINGITRONIC section on the home page.

## Changes
- Update `components/IntroducingSection.tsx`:
  - Apply background using `style={{ backgroundImage: "url('/introback')" }}` and Tailwind classes `bg-cover bg-center`.
  - Add a subtle dark overlay for text readability.

## Verification
- Open home page: section shows the background image, text remains readable, layout unchanged otherwise.