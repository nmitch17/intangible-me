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

- app_docs/chore-location-search-maptiler.md
  - Conditions:
    - When working with the LocationSearch component
    - When modifying the geocoding API route (/api/geocode)
    - When working with MapTiler integration or location-related features
    - When updating the BirthDataForm component
    - When troubleshooting location search or coordinate issues

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
    - When troubleshooting Nominatim API issues or rate limits
    - When working with OpenStreetMap data or location results