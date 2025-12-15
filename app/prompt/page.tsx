

"use client";
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
export default function PromptPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/prompt')
      .then(res => res.json())
      .then(data => {
        setPrompt(data.prompt || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load prompt');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setSuccess('Prompt saved!');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto min-h-screen bg-background">
      <div className="w-full flex flex-col gap-4">
        <label htmlFor="prompt-input" className="font-semibold text-lg">Enter your prompt</label>
        <textarea
          id="prompt-input"
          className="border rounded-md p-3 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={loading || saving}
        />
        <button
          className="mt-2 px-4 py-2 rounded bg-primary text-white font-semibold disabled:opacity-60"
          onClick={handleSave}
          disabled={loading || saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      </div>
      <div className="w-full flex flex-col gap-4">
        <span className="font-semibold text-lg">Preview</span>
        <div className="border rounded-md p-3 min-h-[120px] max-h-72 overflow-auto bg-muted text-muted-foreground whitespace-pre-wrap">
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : prompt ? (
            <ReactMarkdown>{prompt}</ReactMarkdown>
          ) : (
            <span className="text-gray-400">Your prompt preview will appear here.</span>
          )}
        </div>
      </div>
    </div>
  );
}
