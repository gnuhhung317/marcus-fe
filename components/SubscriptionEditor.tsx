"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestJson } from "../lib/api/http";

async function createPlan(botId: string, plan: any) {
  return requestJson(`/bots/${botId}/subscriptions`, {
    method: "POST",
    body: JSON.stringify(plan),
  });
}

export default function SubscriptionEditor({ botId, plan, onClose }: { botId: string; plan?: any; onClose: () => void }) {
  const initial = { ...(plan || {}), tiers: plan?.tiers || (plan?.tiersJson ? JSON.parse(plan.tiersJson) : []) };
  const [state, setState] = useState<any>(initial);
  const qc = useQueryClient();
  const m = useMutation((p: any) => createPlan(botId, p), {
    onSuccess: () => qc.invalidateQueries(["subscriptions", botId]),
  });

  function addTier(){
    const t = { name: `tier-${state.tiers.length+1}`, price: 0, features: [] };
    setState({ ...state, tiers: [...(state.tiers || []), t] });
  }

  function updateTier(i:number, val:any){
    const tiers = [...state.tiers]; tiers[i] = val; setState({ ...state, tiers });
  }

  function removeTier(i:number){
    const tiers = [...state.tiers]; tiers.splice(i,1); setState({ ...state, tiers });
  }

  function save(){
    // basic validation
    if(!state.name || (state.tiers || []).length === 0){
      alert('Name and at least one tier required');
      return;
    }
    const payload = { ...state, tiersJson: JSON.stringify(state.tiers) };
    m.mutate(payload, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[rgba(8,13,22,0.96)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <h2 className="mb-4 text-lg font-semibold text-white">{plan?.id ? "Edit plan" : "Create plan"}</h2>

        <div className="grid gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-muted">Name</span>
            <input className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-emerald-500" value={state.name || ""} onChange={(e) => setState({ ...state, name: e.target.value })} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-muted">Trial days</span>
            <input className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-emerald-500" type="number" value={state.trialDays || 0} onChange={(e) => setState({ ...state, trialDays: Number(e.target.value) })} />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">Tiers</h3>
              <button className="text-sm text-emerald-400 transition-colors hover:text-emerald-300" onClick={addTier}>+ Add tier</button>
            </div>
            <div className="mt-2 space-y-2">
              {(state.tiers || []).map((t:any, i:number) => (
                <div key={i} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <input className="w-32 rounded-lg border border-white/10 bg-black/20 p-2 text-sm text-white outline-none focus:border-emerald-500" value={t.name} onChange={e => updateTier(i,{...t, name:e.target.value})} />
                  <input className="w-24 rounded-lg border border-white/10 bg-black/20 p-2 text-sm text-white outline-none focus:border-emerald-500" type="number" value={t.price} onChange={e => updateTier(i,{...t, price: Number(e.target.value)})} />
                  <input className="flex-1 rounded-lg border border-white/10 bg-black/20 p-2 text-sm text-white outline-none focus:border-emerald-500" value={(t.features||[]).join(', ')} onChange={e => updateTier(i,{...t, features: e.target.value.split(',').map(s=>s.trim())})} />
                  <button className="rounded-lg px-2 py-1 text-sm text-red-300 transition-colors hover:text-red-200" onClick={() => removeTier(i)}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#04120d] transition-all hover:brightness-105" onClick={save}>Save</button>
            <button className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/5" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
