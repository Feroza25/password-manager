import { useState, useEffect, useMemo } from 'react';
import { Plus, Shield, Key, Lock, Filter } from 'lucide-react';
import { PasswordEntry, PasswordCategory } from '@/types/password';
import { loadPasswords, savePasswords, getCategoryLabel, getCategoryIcon } from '@/lib/password-utils';
import { PasswordCard } from '@/components/PasswordCard';
import { PasswordDialog } from '@/components/PasswordDialog';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

const allCategories: PasswordCategory[] = ['social', 'finance', 'work', 'entertainment', 'shopping', 'other'];

export default function Index() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PasswordCategory | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load passwords on mount
  useEffect(() => {
    setPasswords(loadPasswords());
  }, []);

  // Save passwords when changed
  useEffect(() => {
    if (passwords.length > 0) {
      savePasswords(passwords);
    }
  }, [passwords]);

  // Filter passwords
  const filteredPasswords = useMemo(() => {
    return passwords.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.website?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [passwords, searchQuery, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: passwords.length };
    passwords.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [passwords]);

  const handleSave = (entry: PasswordEntry) => {
    setPasswords((prev) => {
      const existing = prev.findIndex((p) => p.id === entry.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }
      return [...prev, entry];
    });
    toast({
      title: editEntry ? 'Password updated!' : 'Password added!',
      description: `${entry.title} has been saved to your vault.`,
    });
    setEditEntry(null);
  };

  const handleEdit = (entry: PasswordEntry) => {
    setEditEntry(entry);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setPasswords((prev) => prev.filter((p) => p.id !== deleteId));
      toast({
        title: 'Password deleted',
        description: 'The password has been removed from your vault.',
      });
      setDeleteId(null);
    }
  };

  const handleAddNew = () => {
    setEditEntry(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SecureVault</h1>
                <p className="text-xs text-muted-foreground">Password Manager</p>
              </div>
            </div>

            <Button onClick={handleAddNew} className="bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{passwords.length}</p>
                <p className="text-xs text-muted-foreground">Total Passwords</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{allCategories.filter(c => categoryCounts[c]).length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">256-bit</p>
                <p className="text-xs text-muted-foreground">Encryption</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`cursor-pointer transition-all ${
              selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({categoryCounts.all || 0})
          </Badge>
          {allCategories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {getCategoryIcon(cat)} {getCategoryLabel(cat)} ({categoryCounts[cat] || 0})
            </Badge>
          ))}
        </div>

        {/* Password List */}
        {filteredPasswords.length === 0 ? (
          <EmptyState hasSearch={searchQuery !== '' || selectedCategory !== 'all'} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {filteredPasswords.map((entry) => (
              <PasswordCard
                key={entry.id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <PasswordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editEntry={editEntry}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Password</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this password? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
