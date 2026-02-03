"use client";

export default function ModelSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border rounded"
    >
      <option value="baseline">Baseline Model</option>
      <option value="lstm">LSTM Neural Network</option>
      <option value="xgboost">XGBoost</option>
      <option value="transformer">Transformer</option>
      <option value="ensemble">Ensemble Model</option>
    </select>
  );
}
