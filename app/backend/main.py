from flask import Flask, request, jsonify
from flask_cors import CORS
from roboflow import Roboflow
import cv2
import numpy as np
import base64
import tempfile
import os
import webbrowser
from threading import Timer
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

CORS(app, resources={r"/predict": {"origins": "*"}})

# Load API key from environment variable
api_key = os.getenv("ROBOFLOW_API_KEY")
if not api_key:
    raise ValueError(
        "ROBOFLOW_API_KEY environment variable is not set. Copy .env.example to .env and add your key."
    )

rf = Roboflow(api_key=api_key)
model = rf.workspace().project("farmboundary").version(1).model


@app.route("/")
def index():
    return app.send_static_file("index.html")


def base64_to_image(base64_str):
    img_data = base64.b64decode(base64_str)
    image = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)
    return image


def image_to_base64(image):
    _, buffer = cv2.imencode(".jpg", image)
    img_str = base64.b64encode(buffer).decode("utf-8")
    return img_str


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.json:
        return jsonify({"error": "No image provided"}), 400

    base64_image = request.json["image"]
    image = base64_to_image(base64_image)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        temp_file_path = temp_file.name
        cv2.imwrite(temp_file_path, image)

    try:
        result = model.predict(temp_file_path, confidence=0).json()
        total_farms = len(result["predictions"])

        areas_and_points = [
            (
                cv2.contourArea(
                    np.array(
                        [(point["x"], point["y"]) for point in prediction["points"]],
                        dtype=np.int32,
                    )
                ),
                np.array(
                    [(point["x"], point["y"]) for point in prediction["points"]],
                    dtype=np.int32,
                ).tolist(),
            )
            for prediction in result["predictions"]
        ]

        areas_and_points.sort(key=lambda x: x[0])

        green_color = (0, 255, 0)
        for _, (_, points) in enumerate(areas_and_points):
            cv2.polylines(
                image,
                [np.array(points, dtype=np.int32)],
                isClosed=True,
                color=green_color,
                thickness=3,
            )

        output_base64 = image_to_base64(image)

        return jsonify(
            {
                "total_farms": total_farms,
                "vector_data": areas_and_points,
                "output_image": output_base64,
            }
        )

    finally:
        os.remove(temp_file_path)


def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")


if __name__ == "__main__":
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        Timer(1, open_browser).start()
    app.run(debug=True)
