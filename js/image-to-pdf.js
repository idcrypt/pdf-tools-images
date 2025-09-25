let cropper;

// handle input kamera
document.getElementById("cameraInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const img = document.getElementById("preview");
  img.src = url;

  // destroy cropper lama kalau ada
  if (cropper) cropper.destroy();

  // init cropper baru
  img.onload = () => {
    cropper = new Cropper(img, {
      aspectRatio: NaN,
      viewMode: 1,
    });
  };
});

// fungsi simpan PDF
function savePDF(size = "A4") {
  if (!cropper) {
    alert("Please take or upload a photo first!");
    return;
  }

  let format = size === "F4" ? [210, 330] : "a4";
  const pdf = new jspdf.jsPDF({ unit: "mm", format });

  const imgData = cropper.getCroppedCanvas().toDataURL("image/jpeg");

  // ukurannya penuh sesuai A4/F4
  pdf.addImage(imgData, "JPEG", 0, 0, 210, size === "F4" ? 330 : 297);
  pdf.save("output.pdf"); // auto download
}

// tombol download
document.getElementById("downloadBtn").addEventListener("click", () => {
  const size = document.getElementById("pdfSize").value;
  savePDF(size);
});
