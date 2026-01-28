import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, ExternalLink, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { PasswordEntry } from '@/types/password';
import { getFaviconUrl, getCategoryIcon } from '@/lib/password-utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface PasswordCardProps {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export function PasswordCard({ entry, onEdit, onDelete }: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<'password' | 'username' | null>(null);

  const copyToClipboard = async (text: string, type: 'password' | 'username') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: `${type === 'password' ? 'Password' : 'Username'} copied!`,
        description: 'Copied to clipboard securely.',
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const favicon = getFaviconUrl(entry.website);

  return (
    <div className="glass-card gradient-border p-4 animate-fade-in hover:bg-card/90 transition-all duration-300 group" style={{ pointerEvents: 'auto' }}>
      <div className="flex items-start gap-4">
        {/* Icon/Favicon */}
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
          {favicon ? (
            <img 
              src={favicon} 
              alt={entry.title} 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = getCategoryIcon(entry.category);
              }}
            />
          ) : (
            <span className="text-2xl">{getCategoryIcon(entry.category)}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{entry.title}</h3>
            {entry.website && (
              <a
                href={entry.website.startsWith('http') ? entry.website : `https://${entry.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Username */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground truncate">{entry.username}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 relative z-10"
              style={{ pointerEvents: 'auto' }}
              onClick={() => copyToClipboard(entry.username, 'username')}
            >
              {copied === 'username' ? (
                <Check className="h-3 w-3 text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm text-muted-foreground bg-input/50 px-2 py-1 rounded flex-1 truncate">
              {showPassword ? entry.password : '•'.repeat(Math.min(entry.password.length, 16))}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 relative z-10"
              style={{ pointerEvents: 'auto' }}
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 relative z-10"
              style={{ pointerEvents: 'auto' }}
              onClick={() => copyToClipboard(entry.password, 'password')}
            >
              {copied === 'password' ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 relative z-10" style={{ pointerEvents: 'auto' }}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(entry)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(entry.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}