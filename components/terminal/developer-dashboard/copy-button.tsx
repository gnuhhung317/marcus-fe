'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className = '' }: CopyButtonProps) {
  const t = useTranslations('Common.actions');
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={cn('h-8 w-8 rounded-lg border border-transparent text-muted transition-colors duration-150 hover:border-border hover:bg-surface hover:text-main focus:outline-none', className)}
      title={t('copy')}
    >
      {copied ? (
        <Check className="h-4 w-4 text-positive" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
