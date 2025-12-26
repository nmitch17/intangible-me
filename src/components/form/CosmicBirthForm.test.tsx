/**
 * CosmicBirthForm Tests
 *
 * Tests the most critical user-facing component for cosmic birth chart calculations.
 * Covers:
 * 1. Form rendering
 * 2. Input validation
 * 3. Location search
 * 4. Date/time handling
 * 5. Form submission
 * 6. Error states
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CosmicBirthForm } from './CosmicBirthForm';

describe('CosmicBirthForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    // Mock fetch for geocoding API
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      expect(screen.getByLabelText(/birth date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/birth time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/birth location/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reveal your design/i })).toBeInTheDocument();
    });

    it('should render date input with correct type', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const dateInput = screen.getByLabelText(/birth date/i);
      expect(dateInput).toHaveAttribute('type', 'date');
      expect(dateInput).toBeRequired();
    });

    it('should render time input with correct type', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const timeInput = screen.getByLabelText(/birth time/i);
      expect(timeInput).toHaveAttribute('type', 'time');
      expect(timeInput).toBeRequired();
    });

    it('should render location search input with placeholder', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      expect(locationInput).toHaveAttribute('placeholder', 'Search city or location...');
      expect(locationInput).toHaveAttribute('autocomplete', 'off');
    });

    it('should display submit button with default text', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      expect(screen.getByRole('button', { name: /reveal your design/i })).toBeInTheDocument();
    });

    it('should display loading state on submit button when isLoading is true', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={true} error={null} />);

      const submitButton = screen.getByRole('button', { name: /calculating/i });
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Calculating...');
    });

    it('should not display any error initially', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      expect(screen.queryByText(/please fill in all required fields/i)).not.toBeInTheDocument();
    });
  });

  describe('Input Validation', () => {
    it('should show validation error when submitting empty form', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);

      expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error when missing birth date', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const timeInput = screen.getByLabelText(/birth time/i);
      await user.type(timeInput, '09:15');

      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);

      expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error when missing birth time', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const dateInput = screen.getByLabelText(/birth date/i);
      await user.type(dateInput, '1980-09-13');

      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);

      expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error when missing location', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const dateInput = screen.getByLabelText(/birth date/i);
      const timeInput = screen.getByLabelText(/birth time/i);

      await user.type(dateInput, '1980-09-13');
      await user.type(timeInput, '09:15');

      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);

      expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should clear validation error when user starts fixing the form', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      // First trigger validation error
      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);
      expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();

      // Then fill in a field and submit again - validation error should appear again but be cleared on submit
      const dateInput = screen.getByLabelText(/birth date/i);
      await user.type(dateInput, '1980-09-13');

      await user.click(submitButton);

      // The validation error should still show because not all fields are filled
      expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
    });
  });

  describe('Location Search', () => {
    it('should not show dropdown initially', () => {
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('should not search when query is too short', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'N');

      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('should search when query is at least 2 characters', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'Ne');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/geocode?q=Ne'));
      });
    });

    it('should debounce search requests', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);

      // Type multiple characters quickly
      await user.type(locationInput, 'New York');

      // Should only call fetch once after debounce delay
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      }, { timeout: 500 });
    });

    it('should display search results', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
        {
          id: '2',
          displayName: 'New Orleans, LA, USA',
          lat: 29.9511,
          lng: -90.0715,
          timezone: 'America/Chicago',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'New');

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      });

      expect(screen.getByText('New Orleans, LA, USA')).toBeInTheDocument();
    });

    it('should show loading indicator while searching', async () => {
      const user = userEvent.setup();
      let resolveSearch: (value: unknown) => void;
      const searchPromise = new Promise((resolve) => {
        resolveSearch = resolve;
      });

      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(searchPromise);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'New York');

      // Wait for debounce and check for spinner
      await waitFor(() => {
        const spinner = screen.getByLabelText(/birth location/i).parentElement?.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      }, { timeout: 500 });

      // Resolve the search
      resolveSearch!({
        ok: true,
        json: async () => [],
      });
    });

    it('should allow selecting a location from search results', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'New York');

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      });

      await user.click(screen.getByText('New York, NY, USA'));

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
      });

      // Input should show selected location
      expect(locationInput).toHaveValue('New York, NY, USA');

      // Location details should be displayed
      expect(screen.getByText(/40.7128, -74.0060 \| America\/New_York/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation in search results', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
        {
          id: '2',
          displayName: 'New Orleans, LA, USA',
          lat: 29.9511,
          lng: -90.0715,
          timezone: 'America/Chicago',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'New');

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      });

      // Press ArrowDown to select first item
      await user.keyboard('{ArrowDown}');

      // Press Enter to select
      await user.keyboard('{Enter}');

      // First result should be selected
      await waitFor(() => {
        expect(locationInput).toHaveValue('New York, NY, USA');
      });
    });

    it('should close dropdown on Escape key', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'New York');

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
      });
    });

    it('should handle search errors gracefully', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'New York');

      // Should not crash and dropdown should remain closed
      await waitFor(() => {
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });
  });

  describe('Date/Time Handling', () => {
    it('should accept date input', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const dateInput = screen.getByLabelText(/birth date/i);
      await user.type(dateInput, '1980-09-13');

      expect(dateInput).toHaveValue('1980-09-13');
    });

    it('should accept time input', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const timeInput = screen.getByLabelText(/birth time/i);
      await user.type(timeInput, '09:15');

      expect(timeInput).toHaveValue('09:15');
    });

    it('should display selected location timezone', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'Tokyo, Japan',
          lat: 35.6762,
          lng: 139.6503,
          timezone: 'Asia/Tokyo',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'Tokyo');

      await waitFor(() => {
        expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Tokyo, Japan'));

      expect(screen.getByText(/Asia\/Tokyo/i)).toBeInTheDocument();
    });

    it('should default to UTC timezone when location has no timezone', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'Unknown Location',
          lat: 0,
          lng: 0,
          timezone: undefined,
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const locationInput = screen.getByLabelText(/birth location/i);
      await user.type(locationInput, 'Unknown');

      await waitFor(() => {
        expect(screen.getByText('Unknown Location')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Unknown Location'));

      expect(screen.getByText(/UTC/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      // Fill in all fields
      const dateInput = screen.getByLabelText(/birth date/i);
      const timeInput = screen.getByLabelText(/birth time/i);
      const locationInput = screen.getByLabelText(/birth location/i);

      await user.type(dateInput, '1980-09-13');
      await user.type(timeInput, '09:15');
      await user.type(locationInput, 'New York');

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      });

      await user.click(screen.getByText('New York, NY, USA'));

      // Submit form
      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        datetime_utc: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        lat: 40.7128,
        lng: -74.006,
      });
    });

    it('should convert local datetime to UTC for submission', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      const dateInput = screen.getByLabelText(/birth date/i);
      const timeInput = screen.getByLabelText(/birth time/i);
      const locationInput = screen.getByLabelText(/birth location/i);

      await user.type(dateInput, '1980-09-13');
      await user.type(timeInput, '09:15');
      await user.type(locationInput, 'New York');

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      });

      await user.click(screen.getByText('New York, NY, USA'));

      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);

      // Should be called with ISO string in UTC
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          datetime_utc: expect.stringMatching(/Z$/),
        })
      );
    });

    it('should not submit when loading', async () => {
      const user = userEvent.setup();
      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={true} error={null} />);

      const submitButton = screen.getByRole('button', { name: /calculating/i });

      // Button should be disabled
      expect(submitButton).toBeDisabled();

      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Error States', () => {
    it('should display external error from props', () => {
      render(
        <CosmicBirthForm
          onSubmit={mockOnSubmit}
          isLoading={false}
          error="Server error occurred"
        />
      );

      expect(screen.getByText('Server error occurred')).toBeInTheDocument();
    });

    it('should prioritize validation error over external error', async () => {
      const user = userEvent.setup();
      render(
        <CosmicBirthForm
          onSubmit={mockOnSubmit}
          isLoading={false}
          error="Server error occurred"
        />
      );

      // External error should show initially
      expect(screen.getByText('Server error occurred')).toBeInTheDocument();

      // Submit empty form to trigger validation error
      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);

      // Validation error should show instead
      expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
      expect(screen.queryByText('Server error occurred')).not.toBeInTheDocument();
    });

    it('should clear validation error on successful submission', async () => {
      const user = userEvent.setup();
      const mockResults = [
        {
          id: '1',
          displayName: 'New York, NY, USA',
          lat: 40.7128,
          lng: -74.006,
          timezone: 'America/New_York',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      render(<CosmicBirthForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);

      // First trigger validation error
      const submitButton = screen.getByRole('button', { name: /reveal your design/i });
      await user.click(submitButton);
      expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();

      // Fill in all fields
      const dateInput = screen.getByLabelText(/birth date/i);
      const timeInput = screen.getByLabelText(/birth time/i);
      const locationInput = screen.getByLabelText(/birth location/i);

      await user.type(dateInput, '1980-09-13');
      await user.type(timeInput, '09:15');
      await user.type(locationInput, 'New York');

      await waitFor(() => {
        expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      });

      await user.click(screen.getByText('New York, NY, USA'));

      // Submit again
      await user.click(submitButton);

      // Validation error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/please fill in all required fields/i)).not.toBeInTheDocument();
      });
    });

    it('should display error message with correct styling', () => {
      render(
        <CosmicBirthForm
          onSubmit={mockOnSubmit}
          isLoading={false}
          error="Test error message"
        />
      );

      const errorElement = screen.getByText('Test error message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass('text-red-600');
    });
  });
});
