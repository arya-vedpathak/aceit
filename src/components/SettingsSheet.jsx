import { useState } from "react";
import { DEFAULT_MODEL } from "../lib/ai.js";

/** Bottom sheet where the user can optionally add their own AI key. */
export default function SettingsSheet({ settings, onSave, onClose }) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [visible, setVisible] = useState(false);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="AI coach settings" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        <h2>AI coach (optional)</h2>
        <p className="muted">
          AceIt works fully offline with its built-in scoring. Add your own Anthropic API key for deeper, personalised
          feedback and a model answer. The key stays in this browser and is sent only to Anthropic.
        </p>

        <label className="field">
          <span>API key</span>
          <div className="input-row">
            <input
              type={visible ? "text" : "password"}
              value={apiKey}
              placeholder="sk-ant-..."
              autoComplete="off"
              spellCheck="false"
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button type="button" className="btn btn-ghost small" onClick={() => setVisible((v) => !v)}>
              {visible ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label className="field">
          <span>Model (optional)</span>
          <input type="text" value={model} placeholder={DEFAULT_MODEL} spellCheck="false" onChange={(e) => setModel(e.target.value)} />
        </label>

        <div className="sheet-actions">
          <button
            className="btn btn-ghost"
            onClick={() => {
              onSave({ apiKey: "", model: "" });
              onClose();
            }}
          >
            Remove key
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onSave({ apiKey: apiKey.trim(), model: model.trim() });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
