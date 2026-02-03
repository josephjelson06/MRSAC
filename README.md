# 🛰️ MRSAC - Automated Farm Boundary Detection

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-orange.svg)](https://ultralytics.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Digital Object Detection from High-Resolution Satellite Data using Advanced Deep Learning Methods

A web-based application that uses deep learning to automatically detect and delineate farm boundaries from satellite imagery. Developed for **Maharashtra Remote Sensing Applications Centre (MRSAC)**, VNIT Campus, Nagpur.

![Farm Detection Demo](https://4kwallpapers.com/images/wallpapers/agriculture-farm-land-countryside-aerial-view-green-2880x1800-3985.jpg)

## ✨ Features

- 🔍 **Automatic Farm Detection** - Detect farm boundaries from satellite/aerial images
- 🗺️ **Vector Output** - Get polygon coordinates for detected farm boundaries
- 📊 **Farm Count** - Automatic counting of detected farm plots
- 🖨️ **Report Generation** - Print detection reports with place name and coordinates
- 📥 **Export Options** - Download results as SHP and KML formats
- 🎨 **Modern UI** - Glassmorphism design with responsive layout

## 🏗️ Project Structure

```
MRSAC/
├── app/
│   ├── backend/
│   │   ├── main.py          # Flask API server
│   │   └── .env             # Environment variables (create this)
│   └── frontend/
│       ├── index.html       # Landing page
│       ├── home.html        # Detection page
│       ├── history.html     # MRSAC history
│       ├── vision.html      # Vision & Mission
│       ├── contact.html     # Contact information
│       ├── script.js        # Frontend JavaScript
│       └── css/
│           └── styles.css   # Styling
├── notebooks/
│   ├── pipeline.ipynb       # Training pipeline
│   ├── yoloseg.ipynb        # YOLO segmentation
│   ├── boundary.ipynb       # U-Net training
│   └── SAM.ipynb            # Segment Anything Model
├── training/
│   └── main.py              # Production training script
├── DATASET/
│   ├── train/               # Training images & labels
│   ├── valid/               # Validation data
│   └── data.yaml            # Dataset configuration
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Roboflow account with API key
- Access to the "farmboundary" project on Roboflow

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/josephjelson06/MRSAC.git
   cd MRSAC
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cd app/backend
   echo "ROBOFLOW_API_KEY=your_api_key_here" > .env
   ```

5. **Start the backend server**
   ```bash
   python main.py
   ```
   Server runs at `http://127.0.0.1:5000`

6. **Open the frontend**
   
   Open `app/frontend/home.html` in your browser

## 📖 Usage

1. **Navigate to the Detection page** (`home.html`)

2. **Fill in the form:**
   - **Place Name**: Location identifier (for reports)
   - **Coordinates**: GPS coordinates (for reference)
   - **Image**: Upload a satellite/aerial image

3. **Click "Upload & Detect"**

4. **View Results:**
   - Annotated image with green farm boundaries
   - Total farm count
   - Options to print report or download data

## 🔧 API Reference

### POST `/predict`

Detect farm boundaries in an image.

**Request Body:**
```json
{
  "image": "base64_encoded_image_string",
  "place_name": "optional_place_name",
  "coordinates": "optional_coordinates"
}
```

**Response:**
```json
{
  "total_farms": 12,
  "vector_data": [
    [area, [[x1, y1], [x2, y2], ...]],
    ...
  ],
  "output_image": "base64_encoded_annotated_image"
}
```

## 🧠 Model Training

The project supports multiple model architectures:

### YOLOv8 (Recommended)
```bash
cd training
python main.py
```

### Using Notebooks
- `notebooks/pipeline.ipynb` - Complete training pipeline
- `notebooks/yoloseg.ipynb` - YOLO segmentation model
- `notebooks/boundary.ipynb` - U-Net segmentation
- `notebooks/SAM.ipynb` - Segment Anything Model

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | ≥2.0.0 | Web server |
| flask-cors | ≥3.0.0 | CORS handling |
| roboflow | ≥1.0.0 | Model inference |
| opencv-python | ≥4.5.0 | Image processing |
| numpy | ≥1.20.0 | Array operations |
| torch | ≥2.0.0 | Deep learning |
| ultralytics | ≥8.0.0 | YOLOv8 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed for Maharashtra Remote Sensing Applications Centre (MRSAC).

## 📞 Contact

**Maharashtra Remote Sensing Applications Centre**

| Branch | Address | Contact |
|--------|---------|---------|
| **Nagpur (HQ)** | VNIT Campus, S.A. Road, Nagpur – 440 010 | 0712-2220086 |
| **Mumbai** | 8th Floor, G.T. Hospital Complex, Mumbai – 400 001 | 022-22620540 |
| **Pune** | 4th Floor, New Admin Building, Camp, Pune – 411 001 | 020-26136132 |

**Website:** [mrsac.gov.in](https://mrsac.gov.in)

---

<p align="center">
  Made with ❤️ for MRSAC | Powered by Deep Learning
</p>
