import { useState, useEffect } from 'react';
import { X, Wand2 } from 'lucide-react';
import { PasswordEntry, PasswordCategory } from '@/types/password';
import { generateId, calculatePasswordStrength, getStrengthColor, getStrengthText } from '@/lib/password-utils';
import { PasswordGenerator } from '@/components/PasswordGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: PasswordEntry) => void;
  editEntry?: PasswordEntry | null;
}

const categories: { value: PasswordCategory; label: string; icon: string }[] = [
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'finance', label: 'Finance', icon: '💳' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { value: 'shopping', label: 'Shopping', icon: '🛒' },
  { value: 'other', label: 'Other', icon: '📁' },
];

export function PasswordDialog({ open, onOpenChange, onSave, editEntry }: PasswordDialogProps) {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<PasswordCategory>('other');
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (editEntry) {
      setTitle(editEntry.title);
      setUsername(editEntry.username);
      setPassword(editEntry.password);
      setWebsite(editEntry.website || '');
      setNotes(editEntry.notes || '');
      setCategory(editEntry.category);
    } else {
      resetForm();
    }
  }, [editEntry, open]);

  const resetForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setWebsite('');
    setNotes('');
    setCategory('other');
    setShowGenerator(false);
  };

  const handleSave = () => {
    if (!title || !username || !password) return;

    const entry: PasswordEntry = {
      id: editEntry?.id || generateId(),
      title,
      username,
      password,
      website: website || undefined,
      notes: notes || undefined,
      category,
      createdAt: editEntry?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(entry);
    onOpenChange(false);
    resetForm();
  };

  const strength = calculatePasswordStrength(password);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editEntry ? 'Edit Password' : 'Add New Password'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-input">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="generator">Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Google Account"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username / Email *</Label>
              <Input
                id="username"
                placeholder="e.g., john@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  placeholder="Enter or generate password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowGenerator(!showGenerator)}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              {password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                      style={{
                        width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
                      }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    strength === 'weak' ? 'text-destructive' :
                    strength === 'medium' ? 'text-warning' : 'text-success'
                  }`}>
                    {getStrengthText(strength)}
                  </span>
                </div>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="e.g., google.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as PasswordCategory)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-input border-border resize-none h-20"
              />
            </div>
          </TabsContent>

          <TabsContent value="generator" className="mt-4">
            <PasswordGenerator
              onPasswordGenerated={setPassword}
              initialPassword={password}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || !username || !password}
            className="bg-gradient-primary hover:opacity-90"
          >
            {editEntry ? 'Save Changes' : 'Add Password'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
