import { PasswordEntry, PasswordGeneratorOptions, PasswordStrength } from '@/types/password';

const STORAGE_KEY = 'vault_passwords';

export function generatePassword(options: PasswordGeneratorOptions): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  let password = '';

  if (options.includeUppercase) chars += uppercase;
  if (options.includeLowercase) chars += lowercase;
  if (options.includeNumbers) chars += numbers;
  if (options.includeSymbols) chars += symbols;

  if (chars === '') chars = lowercase + numbers;

  // Ensure at least one of each selected type
  if (options.includeUppercase) password += uppercase[Math.floor(Math.random() * uppercase.length)];
  if (options.includeLowercase) password += lowercase[Math.floor(Math.random() * lowercase.length)];
  if (options.includeNumbers) password += numbers[Math.floor(Math.random() * numbers.length)];
  if (options.includeSymbols) password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest
  for (let i = password.length; i < options.length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  return 'strong';
}

export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak': return 'bg-destructive';
    case 'medium': return 'bg-warning';
    case 'strong': return 'bg-success';
  }
}

export function getStrengthText(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak': return 'Weak';
    case 'medium': return 'Medium';
    case 'strong': return 'Strong';
  }
}

export function savePasswords(passwords: PasswordEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
}

export function loadPasswords(): PasswordEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((p: PasswordEntry) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch {
    return [];
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getFaviconUrl(website?: string): string | undefined {
  if (!website) return undefined;
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch {
    return undefined;
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    social: '👥',
    finance: '💳',
    work: '💼',
    entertainment: '🎮',
    shopping: '🛒',
    other: '📁',
  };
  return icons[category] || '📁';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    social: 'Social',
    finance: 'Finance',
    work: 'Work',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    other: 'Other',
  };
  return labels[category] || 'Other';
}
