// src/tests/availability.test.js
import { isTimeInRange, getAvailableSlots } from '../../utils/availability';
import { engineers, candidates } from '../../data';

describe('Availability Utils', () => {
  test('isTimeInRange should return correct results', () => {
    expect(isTimeInRange('10:00', '9:00-11:00')).toBe(true);
    expect(isTimeInRange('11:30', '9:00-11:00')).toBe(false);
    expect(isTimeInRange('8:30', '9:00-11:00')).toBe(false);
  });

  test('getAvailableSlots should return correct slots', async () => {
    const candidate = candidates[0];
    const engineer = engineers[0];
    const slots = await getAvailableSlots(engineer, candidate);

    expect(slots).toEqual(['14:00', '14:30', '15:00', '15:30']);
  });
});