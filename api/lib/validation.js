const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const OTP_PATTERN = /^\d{7}$/;

const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
};

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function validateContactPayload(body) {
  if (!isRecord(body) || !body.name || !body.email || !body.message) {
    return { valid: false, error: 'All fields are required.' };
  }

  const { name, email, message } = body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return { valid: false, error: 'Invalid field types.' };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return { valid: false, error: 'All fields are required.' };
  }

  if (
    name.length > CONTACT_LIMITS.name ||
    email.length > CONTACT_LIMITS.email ||
    message.length > CONTACT_LIMITS.message
  ) {
    return { valid: false, error: 'Field exceeds maximum length.' };
  }

  if (email !== trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email address.' };
  }

  return {
    valid: true,
    value: {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    },
  };
}

export function validateOtpPayload(body) {
  if (!isRecord(body) || !body.email || !body.otp) {
    return { valid: false, error: 'Email and verification code are required.' };
  }

  const { email, otp } = body;

  if (typeof email !== 'string' || typeof otp !== 'string') {
    return { valid: false, error: 'Invalid field types.' };
  }

  const trimmedEmail = email.trim();
  const trimmedOtp = otp.trim();

  if (!trimmedEmail || !trimmedOtp) {
    return { valid: false, error: 'Email and verification code are required.' };
  }

  if (email !== trimmedEmail || trimmedEmail.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email address.' };
  }

  if (!OTP_PATTERN.test(trimmedOtp)) {
    return { valid: false, error: 'Invalid verification code format.' };
  }

  return {
    valid: true,
    value: {
      email: trimmedEmail,
      otp: trimmedOtp,
    },
  };
}

export function validateStoredContactData(formData, email) {
  return validateContactPayload({
    name: formData?.name,
    email,
    message: formData?.message,
  });
}

export function validateQueueItem(item) {
  if (!isRecord(item) || typeof item.id !== 'string' || !item.id.trim()) {
    return { valid: false, error: 'Invalid queue item.' };
  }

  const contact = validateContactPayload({
    name: item.name,
    email: item.email,
    message: item.message,
  });

  if (!contact.valid) {
    return { valid: false, error: contact.error, id: item.id };
  }

  return {
    valid: true,
    value: {
      ...item,
      id: item.id,
      name: contact.value.name,
      email: contact.value.email,
      message: contact.value.message,
      attempts: Number.isFinite(item.attempts) ? item.attempts : 0,
    },
  };
}
