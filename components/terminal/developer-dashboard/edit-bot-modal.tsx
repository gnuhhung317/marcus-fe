'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { DeveloperBotDetail } from '@/lib/contracts/types';
import { registerBotSchema, type RegisterBotFormValues } from '@/lib/validations/bot.schema';
import { Form, FormField } from '@/components/ui/form-primitive';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBotMutations } from '@/lib/hooks/use-bot-mutations';

interface EditBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: DeveloperBotDetail;
}

export function EditBotModal({ isOpen, onClose, bot }: EditBotModalProps) {
  const router = useRouter();
  const { updateMetadata } = useBotMutations();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-positive">Config Management</p>
            <DialogTitle>Edit Bot Configuration</DialogTitle>
            <DialogDescription>Update the bot metadata exposed to operators and trading workflows.</DialogDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg text-muted hover:bg-surface hover:text-main">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Form<RegisterBotFormValues>
          schema={registerBotSchema}
          onSubmit={(data) => {
            updateMetadata.mutate(
              {
                botId: bot.botId,
                payload: {
                  botName: data.botName,
                  description: data.description || '',
                  exchange: data.exchange,
                  tradingPair: data.tradingPair,
                },
              },
              {
                onSuccess: () => {
                  router.refresh();
                  onClose();
                },
              }
            );
          }}
          defaultValues={{
            botName: bot.botName,
            description: bot.description || '',
            exchange: (bot.exchange as any) || 'BINANCE',
            tradingPair: bot.tradingPair || 'BTC/USDT',
          }}
          className="space-y-5 px-6 py-5"
        >
          {({ register, formState: { errors } }) => (
            <>
              <FormField label="Bot Name" error={errors.botName?.message}>
                <Input type="text" placeholder="e.g. BTC_BREAKOUT_BOT" {...register('botName')} />
              </FormField>

              <FormField label="Description" error={errors.description?.message}>
                <Textarea placeholder="e.g. Algorithmic grid bot running custom Python webhook alerts." rows={3} {...register('description')} />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Exchange Venue" error={errors.exchange?.message}>
                  <Select {...register('exchange')}>
                    <option value="BINANCE">Binance</option>
                    <option value="BYBIT">Bybit</option>
                    <option value="OKX">OKX</option>
                  </Select>
                </FormField>

                <FormField label="Trading Pair" error={errors.tradingPair?.message}>
                  <Input type="text" placeholder="BTC/USDT" className="font-mono" {...register('tradingPair')} />
                </FormField>
              </div>

              {updateMetadata.isError ? (
                <div className="rounded-xl border border-negative/20 bg-negative-soft px-3 py-3 text-xs text-negative">
                  {updateMetadata.error.message}
                </div>
              ) : null}

              <DialogFooter className="px-0 pb-0">
                <Button type="button" variant="outline" onClick={onClose} className="h-10 px-4 text-xs font-bold uppercase tracking-wider">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={updateMetadata.isPending}
                  className="h-10 px-5 text-xs font-bold uppercase tracking-wider"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
