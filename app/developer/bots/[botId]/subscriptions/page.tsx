"use client";
import React from "react";
import SubscriptionsList from '@/components/SubscriptionsList';

export default function SubscriptionsPage({ params }: { params: { botId: string } }) {
  const { botId } = params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-positive">Developer Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Subscriptions</h1>
        <p className="max-w-2xl text-sm text-muted">
          Manage plan tiers, publish updates, and review active subscriber access for this bot.
        </p>
      </header>

      <SubscriptionsList botId={botId} role="DEVELOPER" />
    </main>
  );
}
