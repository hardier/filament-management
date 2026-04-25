'use client';

import { useState } from 'react';
import { X, Copy, Check, AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  syncId: string;
  onChangeSyncId: (newId: string) => void;
  onClose: () => void;
}

export default function SyncModal({ syncId, onChangeSyncId, onClose }: Props) {
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function copyId() {
    await navigator.clipboard.writeText(syncId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function submitSwitch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || trimmed === syncId) return;
    setConfirming(true);
  }

  function confirmSwitch() {
    onChangeSyncId(draft.trim());
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md border border-gray-700 pb-safe">
        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-base flex items-center gap-2">
            <RefreshCw size={16} className="text-blue-400" />
            Sync across devices
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">
          {/* Current code */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Your sync code — use this on any device to access your inventory:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-900 text-green-400 rounded-lg px-3 py-2.5 text-xs font-mono break-all border border-gray-700 select-all">
                {syncId}
              </code>
              <button
                onClick={copyId}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700" />

          {/* Switch to a different code */}
          {!confirming ? (
            <form onSubmit={submitSwitch} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Switch to a different sync code (paste code from another device):
                </label>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Paste sync code…"
                  className="w-full bg-gray-900 text-white rounded-lg px-3 py-2.5 text-sm font-mono outline-none border border-gray-700 focus:border-blue-500 transition-colors"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!draft.trim() || draft.trim() === syncId}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors"
              >
                Switch sync code
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm items-start">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>This will load the inventory from the new sync code. Your current local data will be replaced. Continue?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSwitch}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors"
                >
                  Yes, switch
                </button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-gray-600 leading-relaxed">
            The sync code is your data identifier. Anyone with this code can read or overwrite your inventory, so keep it private.
          </p>
        </div>
      </div>
    </div>
  );
}
