import { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PasswordGeneratorOptions, PasswordStrength } from '@/types/password';
import { generatePassword, calculatePasswordStrength, getStrengthColor, getStrengthText } from '@/lib/password-utils';
import { toast } from '@/hooks/use-toast';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
  initialPassword?: string;
}

export function PasswordGenerator({ onPasswordGenerated, initialPassword }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const [password, setPassword] = useState(initialPassword || '');
  const [strength, setStrength] = useState<PasswordStrength>('weak');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!initialPassword) {
      handleGenerate();
    } else {
      setStrength(calculatePasswordStrength(initialPassword));
    }
  }, []);

  useEffect(() => {
    setStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleGenerate = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    onPasswordGenerated(newPassword);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: 'Password copied!',
      description: 'Your generated password has been copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const updateOption = <K extends keyof PasswordGeneratorOptions>(
    key: K,
    value: PasswordGeneratorOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Generated Password Display */}
      <div className="p-4 bg-input rounded-lg">
        <div className="flex items-center gap-2">
          <code className="font-mono text-lg flex-1 break-all text-foreground">
            {password}
          </code>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleGenerate}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Strength Indicator */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Password Strength</span>
            <span className={`font-medium ${
              strength === 'weak' ? 'text-destructive' :
              strength === 'medium' ? 'text-warning' : 'text-success'
            }`}>
              {getStrengthText(strength)}
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
              style={{
                width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Length</Label>
            <span className="text-sm font-mono text-primary">{options.length}</span>
          </div>
          <Slider
            value={[options.length]}
            onValueChange={([value]) => updateOption('length', value)}
            min={8}
            max={32}
            step={1}
            className="w-full"
          />
        </div>

        {/* Toggle Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-input/50 rounded-lg">
            <Label htmlFor="uppercase" className="text-sm cursor-pointer">
              Uppercase (A-Z)
            </Label>
            <Switch
              id="uppercase"
              checked={options.includeUppercase}
              onCheckedChange={(checked) => updateOption('includeUppercase', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-input/50 rounded-lg">
            <Label htmlFor="lowercase" className="text-sm cursor-pointer">
              Lowercase (a-z)
            </Label>
            <Switch
              id="lowercase"
              checked={options.includeLowercase}
              onCheckedChange={(checked) => updateOption('includeLowercase', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-input/50 rounded-lg">
            <Label htmlFor="numbers" className="text-sm cursor-pointer">
              Numbers (0-9)
            </Label>
            <Switch
              id="numbers"
              checked={options.includeNumbers}
              onCheckedChange={(checked) => updateOption('includeNumbers', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-input/50 rounded-lg">
            <Label htmlFor="symbols" className="text-sm cursor-pointer">
              Symbols (!@#$)
            </Label>
            <Switch
              id="symbols"
              checked={options.includeSymbols}
              onCheckedChange={(checked) => updateOption('includeSymbols', checked)}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleGenerate} className="w-full" variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Generate New Password
      </Button>
    </div>
  );
}
