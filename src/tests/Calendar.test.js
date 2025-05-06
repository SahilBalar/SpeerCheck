// src/tests/Calendar.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Calendar from '../Calendar';
import { engineers, candidates } from '../../data';
import { getEngineers, getCandidates } from '../../services/api';

jest.mock('../../services/api', () => ({
  getEngineers: jest.fn(),
  getCandidates: jest.fn(),
  scheduleInterview: jest.fn(),
}));

describe('Calendar Component', () => {
  beforeEach(() => {
    getEngineers.mockResolvedValue(engineers);
    getCandidates.mockResolvedValue(candidates);
    scheduleInterview.mockResolvedValue(true);
  });

  test('renders candidate selection dropdown', async () => {
    render(<Calendar />);
    const selectElement = screen.getByLabelText(/select candidate/i);
    expect(selectElement).toBeInTheDocument();
  });

  test('displays correct time slots', async () => {
    render(<Calendar />);
    const timeSlots = await screen.findAllByText(/:\d{2}/);
    expect(timeSlots).toHaveLength(35); // 7 hours * 5 days
  });

  test('shows confirmation modal when time slot is clicked', async () => {
    render(<Calendar />);
    fireEvent.click(screen.getByText('9:00'));
    const modal = await screen.findByText(/confirm interview/i);
    expect(modal).toBeInTheDocument();
  });

  test('schedules interview successfully', async () => {
    render(<Calendar />);
    fireEvent.click(screen.getByText('Schedule Interview'));
    await waitFor(() => {
      expect(scheduleInterview).toHaveBeenCalled();
    });
  });
});