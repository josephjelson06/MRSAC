document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".btn-upload").addEventListener("click", async function () {
    const placeNameInput = document.getElementById("placeName");
    const coordinatesInput = document.getElementById("coordinates");
    const fileInput = document.querySelector('input[type="file"]');

    if (!placeNameInput || !coordinatesInput || !fileInput) {
      alert("Required input fields are missing.");
      return;
    }

    const placeName = placeNameInput.value.trim();
    const coordinates = coordinatesInput.value.trim();

    if (!placeName || !coordinates || !fileInput.files.length) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    showLoading();

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = async function () {
      const base64Image = reader.result.split(",")[1];

      const requestData = {
        place_name: placeName,
        coordinates: coordinates,
        image: base64Image,
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        const result = await response.json();
        hideLoading();

        if (response.ok) {
          if (result.output_image) {
            showPopup(
              result.output_image,
              result.total_farms,
              placeName,
              coordinates,
              result.vector_data
            );
          }
        } else {
          alert("Prediction failed: " + result.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please check the console.");
        hideLoading();
      }
    };

    reader.readAsDataURL(file);
  });

  function showLoading() {
    let loadingOverlay = document.createElement("div");
    loadingOverlay.id = "loading-overlay";
    loadingOverlay.style.position = "fixed";
    loadingOverlay.style.top = "0";
    loadingOverlay.style.left = "0";
    loadingOverlay.style.width = "100%";
    loadingOverlay.style.height = "100%";
    loadingOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    loadingOverlay.style.display = "flex";
    loadingOverlay.style.justifyContent = "center";
    loadingOverlay.style.alignItems = "center";
    loadingOverlay.style.zIndex = "999";

    let spinner = document.createElement("div");
    spinner.className = "spinner";
    loadingOverlay.appendChild(spinner);

    document.body.appendChild(loadingOverlay);
  }

  function hideLoading() {
    let loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }

  function showPopup(base64Image, totalFarms, placeName, coordinates, vectorData) {
    let existingPopup = document.getElementById("image-popup");
    if (existingPopup) {
      existingPopup.remove();
    }

    let overlay = document.createElement("div");
    overlay.id = "popup-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";

    let popup = document.createElement("div");
    popup.id = "image-popup";
    popup.style.background = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.3)";
    popup.style.textAlign = "center";
    popup.style.maxWidth = "90%";
    popup.style.maxHeight = "90%";
    popup.style.overflow = "auto";

    let imgElement = document.createElement("img");
    imgElement.src = `data:image/jpeg;base64,${base64Image}`;
    imgElement.style.maxWidth = "100%";
    imgElement.style.borderRadius = "5px";
    imgElement.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.2)";

    let closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.margin = "10px";
    closeButton.style.padding = "10px 20px";
    closeButton.style.backgroundColor = "#f8c202";
    closeButton.style.color = "#002a5c";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "8px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      overlay.remove();
    };

    let printButton = document.createElement("button");
    printButton.innerText = "Print Report";
    printButton.style.margin = "10px";
    printButton.style.padding = "10px 20px";
    printButton.style.backgroundColor = "#28a745";
    printButton.style.color = "white";
    printButton.style.border = "none";
    printButton.style.borderRadius = "8px";
    printButton.style.cursor = "pointer";
    printButton.onclick = function () {
      printReport(placeName, coordinates, base64Image);
    };

    let downloadShpButton = document.createElement("button");
    downloadShpButton.innerText = "Download SHP";
    downloadShpButton.style.margin = "10px";
    downloadShpButton.style.padding = "10px 20px";
    downloadShpButton.style.backgroundColor = "#007bff";
    downloadShpButton.style.color = "white";
    downloadShpButton.style.border = "none";
    downloadShpButton.style.borderRadius = "8px";
    downloadShpButton.style.cursor = "pointer";
    downloadShpButton.onclick = function () {
      downloadFile(vectorData, "farm_data.shp", "application/octet-stream");
    };

    let downloadKmlButton = document.createElement("button");
    downloadKmlButton.innerText = "Download KML";
    downloadKmlButton.style.margin = "10px";
    downloadKmlButton.style.padding = "10px 20px";
    downloadKmlButton.style.backgroundColor = "#ff5722";
    downloadKmlButton.style.color = "white";
    downloadKmlButton.style.border = "none";
    downloadKmlButton.style.borderRadius = "8px";
    downloadKmlButton.style.cursor = "pointer";
    downloadKmlButton.onclick = function () {
      downloadFile(vectorData, "farm_data.kml", "application/vnd.google-earth.kml+xml");
    };

    popup.appendChild(imgElement);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(printButton);
    popup.appendChild(downloadShpButton);
    popup.appendChild(downloadKmlButton);
    popup.appendChild(closeButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

  function downloadFile(data, filename, mimeType) {
    const blob = new Blob([data], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function printReport(placeName, coordinates, base64Image) {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Farm Detection Report</title>
        </head>
        <body>
          <h2>Farm Detection Report</h2>
          <p><strong>Place Name:</strong> ${placeName}</p>
          <p><strong>Coordinates:</strong> ${coordinates}</p>
          <img src="data:image/jpeg;base64,${base64Image}" alt="Detected Farm">
          <script>window.print();<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
});
