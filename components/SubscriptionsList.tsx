"use client";
import React, { useState } from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import SubscriptionEditor from "./SubscriptionEditor";
import SubscribeModal from "./SubscribeModal";

export default function SubscriptionsList({ botId, role }: { botId: string; role: string }) {
  const { data: plans, isLoading, error, refetch } = useSubscriptions(botId);
  const [editing, setEditing] = useState<any | null>(null);
  const [subscribePlan, setSubscribePlan] = useState<any | null>(null);

  if (isLoading) return <div className="rounded-3xl border border-white/10 bg-[rgba(8,13,22,0.72)] p-6 text-sm text-muted">Loading plans...</div>;
  if (error) return <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">Error loading plans</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[rgba(8,13,22,0.72)] p-4 backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Plans</p>
          <p className="text-sm text-white/90">{plans?.length ?? 0} configured plan{(plans?.length ?? 0) === 1 ? '' : 's'}</p>
        </div>
        {role === "DEVELOPER" && (
          <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#04120d] transition-all hover:brightness-105" onClick={() => setEditing({})}>Create plan</button>
        )}
      </div>

      <div className="grid gap-4">
        {plans?.map((p: any) => (
          <div key={p.id} className="rounded-3xl border border-white/10 bg-[rgba(8,13,22,0.78)] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{p.name || p.id}</h3>
                <p className="mt-1 text-sm text-muted">Model: {p.paymentModel}</p>
                <p className="text-sm text-muted">Trial days: {p.trialDays ?? "-"}</p>
                <div className="mt-4">
                  <strong className="text-sm text-white">Tiers</strong>
                  <ul className="mt-2 space-y-2">
                    {(p.tiers || JSON.parse(p.tiersJson || '[]')).map((t:any,i:number)=> (
                      <li key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90">
                        <span>{t.name}</span>
                        <span className="text-muted">{t.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {role !== "DEVELOPER" && (
                  <button className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-[#04111a] transition-all hover:brightness-105" onClick={() => setSubscribePlan(p)}>Subscribe</button>
                )}
                {role === "DEVELOPER" && (
                  <button className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/5" onClick={() => setEditing(p)}>Edit</button>
                )}
                <button className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/5" onClick={() => refetch()}>Refresh</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <SubscriptionEditor botId={botId} plan={editing} onClose={() => { setEditing(null); refetch(); }} />
      )}

      {subscribePlan && (
        <SubscribeModal botId={botId} plan={subscribePlan} onClose={() => setSubscribePlan(null)} onSubscribed={() => { setSubscribePlan(null); }} />
      )}
    </div>
  );
}
