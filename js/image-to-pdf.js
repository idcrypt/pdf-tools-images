let cropper;
const photos = [];

const photoInput = document.getElementById("photoInput");
const photoList = document.getElementById("photoList");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const downloadPDFBtn = document.getElementById("downloadPDFBtn");
const pdfSizeSelect = document.getElementById("pdfSize");

// Pilih foto dari kamera / gallery
addPhotoBtn.addEventListener("click", () => {
  photoInput.click();
});

// Load image & tampilkan cropper
photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const imgURL = URL.createObjectURL(file);

  // Buat elemen image sementara untuk cropper
  const tempImg = document.createElement("img");
  tempImg.src = imgURL;
  tempImg.style.maxWidth = "100%";
  tempImg.style.display = "block";

  // Modal sederhana (atau container) untuk cropper
  const cropContainer = document.createElement("div");
  cropContainer.style.position = "fixed";
  cropContainer.style.top = "0";
  cropContainer.style.left = "0";
  cropContainer.style.width = "100%";
  cropContainer.style.height = "100%";
  cropContainer.style.background = "rgba(0,0,0,0.85)";
  cropContainer.style.display = "flex";
  cropContainer.style.alignItems = "center";
  cropContainer.style.justifyContent = "center";
  cropContainer.style.zIndex = "9999";
  cropContainer.appendChild(tempImg);

  const confirmBtn = document.createElement("button");
  confirmBtn.innerText = "✅ Crop & Add";
  confirmBtn.style.position = "absolute";
  confirmBtn.style.bottom = "30px";
  confirmBtn.style.left = "50%";
  confirmBtn.style.transform = "translateX(-50%)";
  confirmBtn.style.padding = "12px 24px";
  confirmBtn.style.fontSize = "1rem";
  confirmBtn.style.cursor = "pointer";
  cropContainer.appendChild(confirmBtn);

  document.body.appendChild(cropContainer);

  // Init Cropper.js dengan A4 aspect ratio
  cropper = new Cropper(tempImg, {
    aspectRatio: 210 / 297, // A4
    viewMode: 1,
    movable: true,
    zoomable: true,
    rotatable: true
  });

  // Saat user klik "Crop & Add"
  confirmBtn.addEventListener("click", () => {
    const canvas = cropper.getCroppedCanvas({
      width: 1240,  // A4 150 DPI
      height: 1754
    });
    const croppedURL = canvas.toDataURL("image/jpeg");

    // Tambahkan ke array photos
    photos.push(croppedURL);

    // Preview photo
    const div = document.createElement("div");
    div.className = "photo-item";

    const img = document.createElement("img");
    img.src = croppedURL;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerText = "×";
    removeBtn.onclick = () => {
      photoList.removeChild(div);
      const idx = photos.indexOf(croppedURL);
      if (idx > -1) photos.splice(idx, 1);
    };

    div.appendChild(img);
    div.appendChild(removeBtn);
    photoList.appendChild(div);

    // Hapus cropper modal
    cropper.destroy();
    document.body.removeChild(cropContainer);
  });
});

// Generate PDF multi-page
downloadPDFBtn.addEventListener("click", async () => {
  if (photos.length === 0) return alert("Add at least one photo");

  const size = pdfSizeSelect.value;
  const format = size === "F4" ? [210, 330] : "a4";
  const pdf = new jspdf.jsPDF({ unit: "mm", format });

  for (let i = 0; i < photos.length; i++) {
    await new Promise((resolve) => {
      const img = new Image();
      img.src = photos[i];
      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Scale image to fit page
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(img, "JPEG", x, y, width, height);

        if (i < photos.length - 1) pdf.addPage();
        resolve();
      };
    });
  }

  pdf.save("document.pdf");
});
