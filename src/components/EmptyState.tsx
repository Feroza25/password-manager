import { Shield, Lock, Key } from 'lucide-react';

export function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Key className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No passwords found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          No passwords match your search. Try different keywords or clear the search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-pulse-glow">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -right-2 -bottom-2 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Your vault is empty</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Start adding your passwords to keep them safe and accessible. All passwords are stored securely on your device.
      </p>
    </div>
  );
}
