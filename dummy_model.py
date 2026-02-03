import pickle
import os

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

# A pure data structure — no classes, no imports, no __main__ issues
dummy_model = {
    "type": "dummy",
    "predict_proba": [0.6, 0.2, 0.2]  # BUY, SELL, HOLD
}

model_path = os.path.join("models", "model_v1.pkl")

with open(model_path, "wb") as f:
    pickle.dump(dummy_model, f)

print(f"Dummy model saved to {model_path}")


