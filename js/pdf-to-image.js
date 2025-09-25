const pdfInput = document.getElementById("pdfInput");
const preview = document.getElementById("imagePreview");

pdfInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    preview.innerHTML = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");

      await page.render({ canvasContext: context, viewport }).promise;

      const container = document.createElement("div");
      container.className = "page-container";

      const downloadBtn = document.createElement("button");
      downloadBtn.className = "download-btn";
      downloadBtn.innerText = "Download PNG";
      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `page-${i}.png`;
        link.click();
      };

      container.appendChild(canvas);
      container.appendChild(downloadBtn);
      preview.appendChild(container);
    }
  };
  fileReader.readAsArrayBuffer(file);
});
