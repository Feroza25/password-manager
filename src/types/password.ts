export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  category: PasswordCategory;
  createdAt: Date;
  updatedAt: Date;
  favicon?: string;
}

export type PasswordCategory = 
  | 'social' 
  | 'finance' 
  | 'work' 
  | 'entertainment' 
  | 'shopping' 
  | 'other';

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';
