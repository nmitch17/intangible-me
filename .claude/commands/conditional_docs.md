# Conditional Documentation Guide

This prompt helps you determine what documentation you should read based on the specific changes you need to make in the codebase. Review the conditions below and read the relevant documentation before proceeding with your task.

## Instructions
- Review the task you've been asked to perform
- Check each documentation path in the Conditional Documentation section
- For each path, evaluate if any of the listed conditions apply to your task
  - IMPORTANT: Only read the documentation if any one of the conditions match your task
- IMPORTANT: You don't want to excessively read documentation. Only read the documentation if it's relevant to your task.

## Conditional Documentation

- app_docs/feature-initial-human-design-chart-calculator.md
  - Conditions:
    - When working with Human Design chart calculations
    - When modifying the chart calculation engine in src/lib/calculation/
    - When working with chart display components in src/components/chart/
    - When implementing new chart features (transit, composite, etc.)
    - When working with the /api/chart endpoint
    - When troubleshooting type, authority, or definition calculations
    - When extending reference data (channels, crosses, gates)

- app_docs/chore-auto-timezone-from-location.md
  - Conditions:
    - When working with timezone detection or selection
    - When modifying the geocoding API route (/api/geocode)
    - When working with the BirthDataForm or LocationSearch components
    - When troubleshooting timezone-related issues in chart calculations
    - When working with the geo-tz library or src/lib/timezone.ts

- app_docs/chore-switch-to-nominatim-geocoding.md
  - Conditions:
    - When working with the geocoding API route (/api/geocode)
    - When modifying location search functionality
    - When working with the LocationSearch component
    - When troubleshooting Nominatim API issues or rate limits
    - When working with OpenStreetMap data or location results

- app_docs/feature-solar-haze-ui-redesign.md
  - Conditions:
    - When working with the Solar Haze Portal design system
    - When modifying claymorphic or neumorphic component styles
    - When working with the warm color palette (solar-glow, haze-pink)
    - When adding new animated background elements or sparkles
    - When troubleshooting hydration mismatches in SSR components
    - When modifying src/app/globals.css design tokens or theme colors
    - When working with Outfit, DM Serif Display, or JetBrains Mono fonts
    - When working with the CosmicBirthForm component
    - When implementing new UI components or animations
    - When working with the page layout or visual effects

- app_docs/bug-wasm-fetch-failed-vercel-production.md
  - Conditions:
    - When working with the sweph-wasm library or ephemeris calculations
    - When troubleshooting WASM loading issues in production
    - When modifying src/lib/calculation/ephemeris.ts
    - When deploying to Vercel or other serverless platforms
    - When working with the /api/chart endpoint and seeing 500 errors

- app_docs/feature-cosmic-ui-redesign-sprint1.md
  - Conditions:
    - When working with the Sprint 1 API endpoints (composite, transit, reference)
    - When modifying CopilotKit or Google Gemini adapter configuration
    - When working with the CosmicBirthForm component or timezone handling
    - When implementing rate limiting or response caching
    - When running or extending the Vitest test suite
    - When troubleshooting WASM loading in serverless environments
    - When understanding the overall API architecture

- app_docs/chore-documentation-cleanup.md
  - Conditions:
    - When reviewing documentation accuracy or consistency
    - When unsure which documentation is current for a feature
    - When adding new documentation files
    - When understanding the current tech stack (agent framework, geocoding, design system)