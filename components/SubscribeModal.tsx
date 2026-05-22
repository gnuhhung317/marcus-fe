"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestJson } from "@/lib/api/http";

async function callSubscribe(botId:string, planId:string, tierName:string){
  return requestJson(`/bots/${botId}/subscribe`, {
    method: "POST",
    body: JSON.stringify({ planId, tierName }),
  });
}

export default function SubscribeModal({ botId, plan, onClose, onSubscribed }: any) {
  const [tier, setTier] = useState(plan.tiers?.[0]?.name || (plan.tiersJson ? JSON.parse(plan.tiersJson || '[]')[0]?.name : "default"));
  const [revealed, setRevealed] = useState(false);
  const qc = useQueryClient();

  const mutationFn = async ({ planId, tierName }: { planId: string; tierName: string }) =>
    callSubscribe(botId, planId, tierName);

  const m = useMutation({
    mutationFn,
    onSuccess(data: unknown) {
      qc.invalidateQueries({ queryKey: ["subscriptions", botId] });
      onSubscribed(data);
    },
  });

  function onSubmit(){ m.mutate({planId:plan.id, tierName: tier}); }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[rgba(8,13,22,0.96)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <h3 className="text-lg font-semibold text-white">Subscribe to {plan.name || plan.id}</h3>
        <div className="mt-3">
          <label className="block text-sm text-muted">Tier</label>
          <select className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-emerald-500" value={tier} onChange={e => setTier(e.target.value)}>
            {(plan.tiers || JSON.parse(plan.tiersJson || '[]') || [{name:"default"}]).map((t: any) => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#04120d] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70" onClick={onSubmit} disabled={(m as any).isLoading}>{(m as any).isLoading ? 'Subscribing...' : 'Subscribe'}</button>
          <button className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/5" onClick={onClose}>Close</button>
        </div>

        {(m as any).data && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-muted">Subscription created</div>
                <div className="mt-1 font-mono text-sm text-white">{revealed ? (m as any).data.wsToken : ((m as any).data.wsToken ? `${(m as any).data.wsToken.slice(0, 6)}•••` : '—')}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-emerald-400 transition-colors hover:text-emerald-300" onClick={() => setRevealed((s)=>!s)}>{revealed? 'Hide' : 'Reveal'}</button>
                <button className="text-sm text-white/80 transition-colors hover:text-white" onClick={() => navigator.clipboard.writeText((m as any).data.wsToken || '')}>Copy</button>
              </div>
            </div>
          </div>
        )}

        {(m as any).isError && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">Error: {((m as any).error as Error).message}</div>
        )}
      </div>
    </div>
  );
}
