let cropper;
const photos = [];

const photoInput = document.getElementById("photoInput");
const photoList = document.getElementById("photoList");

document.getElementById("addPhotoBtn").addEventListener("click", () => {
  photoInput.click();
});

photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const imgURL = URL.createObjectURL(file);

  const div = document.createElement("div");
  div.className = "photo-item";

  const img = document.createElement("img");
  img.src = imgURL;

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerText = "×";
  removeBtn.onclick = () => {
    photoList.removeChild(div);
    const idx = photos.indexOf(imgURL);
    if (idx > -1) photos.splice(idx, 1);
  };

  div.appendChild(img);
  div.appendChild(removeBtn);
  photoList.appendChild(div);

  photos.push(imgURL);
});

// Generate PDF
document.getElementById("downloadPDFBtn").addEventListener("click", () => {
  const size = document.getElementById("pdfSize").value;
  if (photos.length === 0) return alert("Add at least one photo");

  const format = size === "F4" ? [210, 330] : "a4";
  const pdf = new jspdf.jsPDF({ unit: "mm", format });

  photos.forEach((photo, index) => {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Scale image to fit page (maintain aspect ratio)
      let ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      pdf.addImage(img, "JPEG", x, y, width, height);

      if (index < photos.length - 1) pdf.addPage();
      if (index === photos.length - 1) pdf.save("output.pdf");
    };
  });
});
