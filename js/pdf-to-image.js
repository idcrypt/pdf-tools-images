const pdfInput = document.getElementById("pdfInput");
const preview = document.getElementById("imagePreview");

pdfInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedarray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    preview.innerHTML = ""; // reset preview

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      preview.appendChild(canvas);
    }
  };
  fileReader.readAsArrayBuffer(file);
});
