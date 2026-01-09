import { scrypt, randomBytes, createHash } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Password hashing configuration
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

/**
 * Hash a password using scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return derivedKey.toString("hex") === hash;
}

/**
 * Device fingerprint interface
 */
export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  lastUsedAt: string;
  trusted: boolean;
}

/**
 * Generate a device ID from user agent and IP address
 * Uses partial IP for privacy (first 3 octets for IPv4)
 */
export function generateDeviceId(userAgent: string, ipAddress: string): string {
  // Normalize user agent (remove version numbers for stability)
  const normalizedUA = userAgent
    .replace(/\d+\.\d+(\.\d+)?/g, "X")
    .toLowerCase();

  // Use partial IP for privacy
  const partialIP = getPartialIP(ipAddress);

  // Create hash of combined data
  const data = `${normalizedUA}:${partialIP}`;
  return createHash("sha256").update(data).digest("hex").substring(0, 32);
}

/**
 * Get partial IP address for privacy
 */
function getPartialIP(ip: string): string {
  if (ip.includes(":")) {
    // IPv6: use first 4 segments
    const segments = ip.split(":");
    return segments.slice(0, 4).join(":");
  } else {
    // IPv4: use first 3 octets
    const octets = ip.split(".");
    return octets.slice(0, 3).join(".");
  }
}

/**
 * Parse devices from JSON string
 */
export function parseDevices(devicesJson?: string | null): DeviceFingerprint[] {
  if (!devicesJson) return [];
  try {
    const parsed = JSON.parse(devicesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Stringify devices for storage
 */
export function stringifyDevices(devices: DeviceFingerprint[]): string {
  return JSON.stringify(devices);
}

/**
 * Check if a device is in the known devices list
 */
export function isKnownDevice(
  devices: DeviceFingerprint[],
  deviceId: string
): boolean {
  return devices.some((d) => d.id === deviceId && d.trusted);
}

/**
 * Add or update a device in the devices list
 */
export function addOrUpdateDevice(
  devices: DeviceFingerprint[],
  deviceId: string,
  userAgent: string,
  ipAddress: string
): DeviceFingerprint[] {
  const now = new Date().toISOString();
  const existingIndex = devices.findIndex((d) => d.id === deviceId);

  if (existingIndex >= 0) {
    // Update existing device
    devices[existingIndex] = {
      ...devices[existingIndex],
      lastUsedAt: now,
      ipAddress,
      trusted: true,
    };
  } else {
    // Add new device
    devices.push({
      id: deviceId,
      userAgent: getBrowserInfo(userAgent),
      ipAddress,
      createdAt: now,
      lastUsedAt: now,
      trusted: true,
    });
  }

  // Keep only last 10 devices
  return devices.slice(-10);
}

/**
 * Remove a device from the devices list
 */
export function removeDevice(
  devices: DeviceFingerprint[],
  deviceId: string
): DeviceFingerprint[] {
  return devices.filter((d) => d.id !== deviceId);
}

/**
 * Extract browser info from user agent for display
 */
export function getBrowserInfo(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Detect browser
  let browser = "Unknown Browser";
  if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("edg/")) {
    browser = "Edge";
  } else if (ua.includes("chrome")) {
    browser = "Chrome";
  } else if (ua.includes("safari")) {
    browser = "Safari";
  } else if (ua.includes("opera") || ua.includes("opr/")) {
    browser = "Opera";
  }

  // Detect OS
  let os = "Unknown OS";
  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("mac os")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
  }

  return `${browser} on ${os}`;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Parola trebuie să aibă cel puțin 8 caractere");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Parola trebuie să conțină cel puțin o literă mare");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Parola trebuie să conțină cel puțin o literă mică");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Parola trebuie să conțină cel puțin o cifră");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
