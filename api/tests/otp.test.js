import { describe, it, expect, beforeEach } from 'vitest';
import { generateOtp, storeOtp, verifyOtp, storeFormData, getFormData, checkResendCooldown } from '../lib/otp.js';

// These tests use the in-memory fallback (no Redis) which is the default
// when REDIS_URL / DEV_REDIS_URL are not set.

describe('OTP Library (in-memory fallback)', () => {
  describe('generateOtp', () => {
    it('should generate a 7-digit string by default', () => {
      const otp = generateOtp();
      expect(otp).toMatch(/^\d{7}$/);
    });

    it('should generate different OTPs', () => {
      const otps = new Set(Array.from({ length: 20 }, () => generateOtp()));
      // At least a few unique values (extremely unlikely to get all same)
      expect(otps.size).toBeGreaterThan(1);
    });

    it('should respect custom length', () => {
      expect(generateOtp(4)).toMatch(/^\d{4}$/);
      expect(generateOtp(10)).toMatch(/^\d{10}$/);
    });
  });

  describe('storeOtp + verifyOtp', () => {
    const email = 'test-otp@example.com';

    beforeEach(async () => {
      // Clean up by verifying with wrong code until deleted, or just store fresh
    });

    it('should verify a correct OTP', async () => {
      const otp = '9876543';
      await storeOtp(email, otp);
      const result = await verifyOtp(email, otp);
      expect(result.valid).toBe(true);
    });

    it('should reject a wrong OTP', async () => {
      await storeOtp(email, '1111111');
      const result = await verifyOtp(email, '0000000');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid code');
    });

    it('should delete OTP after successful verification', async () => {
      await storeOtp(email, '1234567');
      await verifyOtp(email, '1234567'); // correct → deleted
      const result = await verifyOtp(email, '1234567');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('not found');
    });

    it('should lock out after 3 failed attempts', async () => {
      await storeOtp(email, '1234567');
      await verifyOtp(email, '0000000'); // attempt 1
      await verifyOtp(email, '0000000'); // attempt 2
      const result = await verifyOtp(email, '0000000'); // attempt 3 → locked
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Too many');
    });

    it('should still accept correct OTP before lockout', async () => {
      await storeOtp(email, '1234567');
      await verifyOtp(email, '0000000'); // attempt 1 — wrong
      const result = await verifyOtp(email, '1234567'); // attempt 2 — correct
      expect(result.valid).toBe(true);
    });

    it('should return not found for non-existent email', async () => {
      const result = await verifyOtp('nobody@nowhere.com', '1234567');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('not found');
    });
  });

  describe('storeFormData + getFormData', () => {
    const email = 'test-form@example.com';
    const data = { name: 'Alice', email, message: 'Hello' };

    it('should store and retrieve form data', async () => {
      await storeFormData(email, data);
      const result = await getFormData(email);
      expect(result).toEqual(data);
    });

    it('should be one-time use (deleted after retrieval)', async () => {
      await storeFormData(email, data);
      await getFormData(email); // first retrieval
      const result = await getFormData(email); // second should be null
      expect(result).toBeNull();
    });
  });

  describe('checkResendCooldown', () => {
    it('should allow first request', async () => {
      const result = await checkResendCooldown('cooldown-test-1@example.com');
      expect(result.allowed).toBe(true);
    });

    it('should block rapid second request', async () => {
      const email = 'cooldown-test-2@example.com';
      await checkResendCooldown(email); // first — sets cooldown
      const result = await checkResendCooldown(email); // second — blocked
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });
  });
});
