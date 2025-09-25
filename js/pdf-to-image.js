// Pastikan pdf.js sudah di-include di HTML atau via CDN
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.12.313/pdf.min.js"></script>

const fileInput = document.getElementById('pdf-upload');
const previewContainer = document.querySelector('.preview-container');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function() {
    const typedarray = new Uint8Array(this.result);

    pdfjsLib.getDocument(typedarray).promise.then(pdf => {
      // Clear previous previews
      previewContainer.innerHTML = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(page => {
          const scale = 1.5; // zoom scale
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page ke canvas
          page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
            // Container untuk canvas + tombol download
            const pageContainer = document.createElement('div');
            pageContainer.className = 'page-container';
            pageContainer.style.position = 'relative';

            // Tombol download
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '⬇ Download';
            downloadBtn.addEventListener('click', () => {
              const link = document.createElement('a');
              link.href = canvas.toDataURL('image/png');
              link.download = `page-${i}.png`;
              link.click();
            });

            pageContainer.appendChild(canvas);
            pageContainer.appendChild(downloadBtn);

            // Append ke container utama
            previewContainer.appendChild(pageContainer);
          });
        });
      }
    }).catch(err => {
      console.error('PDF render error:', err);
      alert('Failed to load PDF.');
    });
  };
  fileReader.readAsArrayBuffer(file);
});
