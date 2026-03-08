import { describe, it, expect } from 'vitest';
import { generateOtp, storeOtp, verifyOtp, storeFormData, getFormData, checkResendCooldown } from '../lib/otp.js';

// Extended tests for the OTP library using in-memory fallback (no Redis).
// Supplements otp.test.js with additional edge cases.

describe('OTP Library — Extended (in-memory fallback)', () => {
  // ── generateOtp ────────────────────────────────────────────────────────
  describe('generateOtp edge cases', () => {
    it('should return only digit characters', () => {
      for (let i = 0; i < 50; i++) {
        const otp = generateOtp();
        expect(otp).toMatch(/^\d+$/);
      }
    });

    it('should generate a 1-digit OTP', () => {
      const otp = generateOtp(1);
      expect(otp).toMatch(/^\d{1}$/);
    });

    it('should generate a 20-digit OTP', () => {
      const otp = generateOtp(20);
      expect(otp).toMatch(/^\d{20}$/);
    });

    it('should produce sufficient randomness (statistical check)', () => {
      // Generate 100 OTPs — all should not be the same
      const otps = Array.from({ length: 100 }, () => generateOtp());
      const unique = new Set(otps);
      expect(unique.size).toBeGreaterThan(50);
    });
  });

  // ── verifyOtp edge cases ───────────────────────────────────────────────
  describe('verifyOtp edge cases', () => {
    it('should be case-insensitive for email lookup', async () => {
      await storeOtp('Test@Example.COM', '1234567');
      const result = await verifyOtp('test@example.com', '1234567');
      expect(result.valid).toBe(true);
    });

    it('should track remaining attempts correctly', async () => {
      await storeOtp('attempts@test.com', '1234567');

      const r1 = await verifyOtp('attempts@test.com', '0000000');
      expect(r1.valid).toBe(false);
      expect(r1.message).toContain('2 attempt(s) remaining');

      const r2 = await verifyOtp('attempts@test.com', '0000000');
      expect(r2.valid).toBe(false);
      expect(r2.message).toContain('1 attempt(s) remaining');

      const r3 = await verifyOtp('attempts@test.com', '0000000');
      expect(r3.valid).toBe(false);
      expect(r3.message).toContain('Too many');
    });

    it('should not allow verification after lockout even with correct code', async () => {
      await storeOtp('locked@test.com', '1234567');
      await verifyOtp('locked@test.com', '0000000'); // 1
      await verifyOtp('locked@test.com', '0000000'); // 2
      await verifyOtp('locked@test.com', '0000000'); // 3 — locked

      const result = await verifyOtp('locked@test.com', '1234567');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('not found');
    });

    it('should allow correct OTP on the second attempt', async () => {
      await storeOtp('second@test.com', '1234567');
      const r1 = await verifyOtp('second@test.com', '0000000'); // wrong
      expect(r1.valid).toBe(false);

      const r2 = await verifyOtp('second@test.com', '1234567'); // correct
      expect(r2.valid).toBe(true);
    });

    it('should allow correct OTP on the third (last) attempt', async () => {
      await storeOtp('third@test.com', '1111111');
      await verifyOtp('third@test.com', '0000000'); // 1 wrong
      await verifyOtp('third@test.com', '0000000'); // 2 wrong

      const r3 = await verifyOtp('third@test.com', '1111111'); // 3rd try, correct
      expect(r3.valid).toBe(true);
    });

    it('should isolate OTPs between different emails', async () => {
      await storeOtp('a@test.com', '1111111');
      await storeOtp('b@test.com', '2222222');

      const rA = await verifyOtp('a@test.com', '1111111');
      expect(rA.valid).toBe(true);

      const rB = await verifyOtp('b@test.com', '2222222');
      expect(rB.valid).toBe(true);
    });

    it('should not cross-verify OTPs between emails', async () => {
      await storeOtp('x@test.com', '1111111');
      await storeOtp('y@test.com', '2222222');

      const r = await verifyOtp('x@test.com', '2222222');
      expect(r.valid).toBe(false);
    });
  });

  // ── storeOtp overwrites ────────────────────────────────────────────────
  describe('storeOtp overwrite behavior', () => {
    it('should overwrite previous OTP for same email', async () => {
      await storeOtp('overwrite@test.com', '1111111');
      await storeOtp('overwrite@test.com', '2222222'); // overwrite

      const r1 = await verifyOtp('overwrite@test.com', '1111111');
      expect(r1.valid).toBe(false);

      // Need a fresh store since the previous verify exhausted an attempt
      await storeOtp('overwrite2@test.com', '1111111');
      await storeOtp('overwrite2@test.com', '2222222');
      const r2 = await verifyOtp('overwrite2@test.com', '2222222');
      expect(r2.valid).toBe(true);
    });

    it('should reset attempt counter on new OTP', async () => {
      await storeOtp('reset@test.com', '1111111');
      await verifyOtp('reset@test.com', '0000000'); // 1 wrong attempt

      // Re-store: should reset attempts
      await storeOtp('reset@test.com', '3333333');
      const result = await verifyOtp('reset@test.com', '3333333');
      expect(result.valid).toBe(true);
    });
  });

  // ── storeFormData + getFormData ─────────────────────────────────────────
  describe('storeFormData + getFormData extended', () => {
    it('should store and retrieve complex form data', async () => {
      const complexData = {
        name: 'José García <script>',
        email: 'jose@example.com',
        message: 'Hello\nWorld\n<b>HTML</b> & "quotes"',
      };
      await storeFormData('jose@example.com', complexData);
      const result = await getFormData('jose@example.com');
      expect(result).toEqual(complexData);
    });

    it('should be case-insensitive for email key', async () => {
      await storeFormData('CaseTest@Example.COM', { name: 'Test', email: 'casetest@example.com', message: 'Hi' });
      const result = await getFormData('casetest@example.com');
      expect(result).toEqual({ name: 'Test', email: 'casetest@example.com', message: 'Hi' });
    });

    it('should return null for never-stored email', async () => {
      const result = await getFormData('never-stored@test.com');
      expect(result).toBeNull();
    });

    it('should handle overwriting form data', async () => {
      await storeFormData('ow@test.com', { name: 'V1', email: 'ow@test.com', message: 'First' });
      await storeFormData('ow@test.com', { name: 'V2', email: 'ow@test.com', message: 'Second' });
      const result = await getFormData('ow@test.com');
      expect(result.message).toBe('Second');
    });

    it('should isolate form data between emails', async () => {
      await storeFormData('fd1@test.com', { name: 'A', email: 'fd1@test.com', message: 'Msg1' });
      await storeFormData('fd2@test.com', { name: 'B', email: 'fd2@test.com', message: 'Msg2' });

      const r1 = await getFormData('fd1@test.com');
      const r2 = await getFormData('fd2@test.com');
      expect(r1.name).toBe('A');
      expect(r2.name).toBe('B');
    });
  });

  // ── checkResendCooldown ────────────────────────────────────────────────
  describe('checkResendCooldown extended', () => {
    it('should allow first request for unique emails', async () => {
      const r1 = await checkResendCooldown('cd-unique-1@test.com');
      const r2 = await checkResendCooldown('cd-unique-2@test.com');
      expect(r1.allowed).toBe(true);
      expect(r2.allowed).toBe(true);
    });

    it('should return retryAfter > 0 when blocked', async () => {
      const email = 'cd-blocked@test.com';
      await checkResendCooldown(email);
      const result = await checkResendCooldown(email);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(30);
    });

    it('should be case-insensitive', async () => {
      await checkResendCooldown('CdCase@Test.COM');
      const result = await checkResendCooldown('cdcase@test.com');
      expect(result.allowed).toBe(false);
    });
  });
});
