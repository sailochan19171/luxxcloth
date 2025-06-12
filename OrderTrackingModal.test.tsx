import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import OrderTrackingModal from './OrderTrackingModal'; // Assuming it's in the same directory
import { getFunctions, httpsCallable } from 'firebase/functions'; // Only to access the mocked version

// Mock firebase/functions
// The actual mockHttpsCallable function that will be returned by the httpsCallable mock
const mockHttpsCallableImpl = jest.fn();

jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(() => ({})), // Mock getFunctions to return a dummy object
  httpsCallable: jest.fn(() => mockHttpsCallableImpl), // httpsCallable itself returns our main mock function
}));

describe('OrderTrackingModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockHttpsCallableImpl.mockReset();
    mockOnClose.mockClear();
    // Clear any previous results from httpsCallable (the outer mock) if needed, though typically
    // resetting the implementation (mockHttpsCallableImpl) is sufficient.
    (httpsCallable as jest.Mock).mockClear();
  });

  test('renders correctly when open', () => {
    render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Track Your Order')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Order ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Track Order/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close modal/i })).toBeInTheDocument(); // For the 'X' button
  });

  test('does not render when closed', () => {
    const { container } = render(<OrderTrackingModal isOpen={false} onClose={mockOnClose} />);
    // When null is returned, the container should be empty or only contain comment nodes
    expect(container.firstChild).toBeNull();
  });

  test('input field updates correctly', async () => {
    render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('Enter your Order ID');
    await userEvent.type(input, 'TestOrder123');
    expect(input).toHaveValue('TestOrder123');
  });

  test('calls onClose when close button is clicked', async () => {
    render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: /Close modal/i }); // aria-label for 'X'
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('handles successful order tracking', async () => {
    const mockTrackingData = {
      orderId: 'TestOrder123',
      status: 'Delivered',
      shipmentStatus: 'Completed',
      liveLocation: 'At doorstep',
      orderDate: '2023-01-01T12:00:00Z',
      estimatedDelivery: '2023-01-02T12:00:00Z',
      trackingNumber: 'TN98765',
      carrier: 'FastShip',
    };
    mockHttpsCallableImpl.mockResolvedValue({ data: mockTrackingData });

    render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);

    await userEvent.type(screen.getByPlaceholderText('Enter your Order ID'), 'TestOrder123');
    await userEvent.click(screen.getByRole('button', { name: /Track Order/i }));

    // Check for loading state (button text change or a specific loading message)
    // Use findByRole to wait for the button text to change
    expect(await screen.findByRole('button', { name: /Tracking.../i })).toBeInTheDocument();

    // Wait for data to be displayed
    expect(await screen.findByText(/Order ID: TestOrder123/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: Delivered/i)).toBeInTheDocument();
    expect(screen.getByText(/Shipment Status: Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Location Details: At doorstep/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Date: 2023-01-01/i)).toBeInTheDocument(); // Check date part
    expect(screen.getByText(/Est. Delivery: 2023-01-02/i)).toBeInTheDocument();
    expect(screen.getByText(/Tracking #: TN98765/i)).toBeInTheDocument();
    expect(screen.getByText(/Carrier: FastShip/i)).toBeInTheDocument();

    // Ensure loading is gone and error is not shown
    expect(screen.queryByText(/Loading tracking information.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
  });

  test('handles tracking failure (Order Not Found)', async () => {
    mockHttpsCallableImpl.mockRejectedValue({ message: 'Order not found' });

    render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);
    await userEvent.type(screen.getByPlaceholderText('Enter your Order ID'), 'UnknownOrder');
    await userEvent.click(screen.getByRole('button', { name: /Track Order/i }));

    expect(await screen.findByRole('button', { name: /Tracking.../i })).toBeInTheDocument();

    expect(await screen.findByText(/Error: Order not found/i)).toBeInTheDocument();
    // Ensure data is not shown
    expect(screen.queryByText(/Order ID:/i)).not.toBeInTheDocument();
  });

  test('handles tracking failure (Generic Error)', async () => {
    mockHttpsCallableImpl.mockRejectedValue(new Error('Network error')); // Generic error

    render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);
    await userEvent.type(screen.getByPlaceholderText('Enter your Order ID'), 'AnyOrder');
    await userEvent.click(screen.getByRole('button', { name: /Track Order/i }));

    expect(await screen.findByRole('button', { name: /Tracking.../i })).toBeInTheDocument();

    // Check for a generic error message if 'err.message' is used, or the specific one.
    // The component uses `err.message || 'Failed to retrieve tracking information.'`
    expect(await screen.findByText(/Error: Network error/i)).toBeInTheDocument();
    expect(screen.queryByText(/Order ID:/i)).not.toBeInTheDocument();
  });

  test('displays error for empty order ID submission attempt', async () => {
    render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);
    // Directly click track without typing
    await userEvent.click(screen.getByRole('button', { name: /Track Order/i }));

    // Expect client-side validation message
    expect(await screen.findByText(/Error: Please enter an Order ID./i)).toBeInTheDocument();
    // Ensure httpsCallable was not called
    expect(mockHttpsCallableImpl).not.toHaveBeenCalled();
  });

  test('state resets when modal is closed and reopened', async () => {
    // Initial render and successful track
    const initialTrackingData = { orderId: 'Order1', status: 'Processing', shipmentStatus: 'Preparing', liveLocation: 'Warehouse A' };
    mockHttpsCallableImpl.mockResolvedValue({ data: initialTrackingData });

    const { rerender } = render(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);
    await userEvent.type(screen.getByPlaceholderText('Enter your Order ID'), 'Order1');
    await userEvent.click(screen.getByRole('button', { name: /Track Order/i }));
    expect(await screen.findByText(/Order ID: Order1/i)).toBeInTheDocument();

    // Close the modal (which triggers useEffect to reset state)
    rerender(<OrderTrackingModal isOpen={false} onClose={mockOnClose} />);

    // Reopen the modal
    // Prepare a different response for the next call to ensure we aren't seeing stale data
    const newTrackingData = { orderId: 'Order2', status: 'Shipped', shipmentStatus: 'In Transit', liveLocation: 'City B' };
    mockHttpsCallableImpl.mockResolvedValue({ data: newTrackingData });
    rerender(<OrderTrackingModal isOpen={true} onClose={mockOnClose} />);

    // Assert initial state: input is empty, no previous data or error displayed
    expect(screen.getByPlaceholderText('Enter your Order ID')).toHaveValue('');
    expect(screen.queryByText(/Order ID: Order1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(screen.getByText('Tracking information will appear here...')).toBeInTheDocument();

    // Optional: Test a new tracking call to ensure it works after reopening
    await userEvent.type(screen.getByPlaceholderText('Enter your Order ID'), 'Order2');
    await userEvent.click(screen.getByRole('button', { name: /Track Order/i }));
    expect(await screen.findByText(/Order ID: Order2/i)).toBeInTheDocument();
  });
});
