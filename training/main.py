import torch
from ultralytics import YOLO
from pathlib import Path

# ✅ Check for GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# ✅ Define paths (relative to project root)
BASE_DIR = Path(__file__).parent.parent  # project_mrsac folder
DATA_YAML_PATH = BASE_DIR / "DATASET" / "data.yaml"
MODEL_PATH = BASE_DIR / "yolov8n.pt"
OUTPUT_DIR = BASE_DIR / "runs" / "detect"

# ✅ Verify paths exist
if not DATA_YAML_PATH.exists():
    raise FileNotFoundError(f"Dataset not found at: {DATA_YAML_PATH}")
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")

# ✅ Load YOLO model
model = YOLO(str(MODEL_PATH))

# ✅ Train the Model
model.train(
    data=str(DATA_YAML_PATH),
    epochs=50,
    imgsz=640,
    batch=8,
    device=device,
    project=str(OUTPUT_DIR),
    name="train",
)

print(f"Training Completed. Results saved in: {OUTPUT_DIR}")
