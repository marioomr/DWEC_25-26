const dropZone = document.getElementById('drop-zone');
const preview = document.getElementById('preview');
const downloads = document.getElementById('downloads');
const processBtn = document.getElementById('process');

let images = [];

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');

  const files = [...e.dataTransfer.files];
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      images.push({ file, src: reader.result });

      const img = document.createElement('img');
      img.src = reader.result;
      img.title = file.name;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

processBtn.addEventListener('click', () => {
  if (images.length === 0) {
    alert('Por favor, carga al menos una imagen antes de procesar.');
    return;
  }

  downloads.innerHTML = '';
  processBtn.disabled = true;
  processBtn.textContent = 'Procesando...';

  const watermark = document.getElementById('watermark').value;
  const maxWidth = parseInt(document.getElementById('maxWidth').value);
  const format = document.getElementById('format').value;
  const quality = format === 'image/jpeg' ? 0.9 : 1;

  let processed = 0;

  images.forEach(({ file, src }) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const width = img.width * scale;
      const height = img.height * scale;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      if (watermark) {
        const fontSize = Math.max(16, Math.floor(width / 15));
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textY = height - fontSize - 15;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(width / 2 - 150, textY - fontSize / 2 - 5, 300, fontSize + 10);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(watermark, width / 2, textY);
      }

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const ext = format === 'image/png' ? 'png' : 'jpg';
        a.download = `editada-${file.name.split('.')[0]}.${ext}`;
        a.textContent = a.download;

        downloads.appendChild(a);

        processed++;
        if (processed === images.length) {
          processBtn.disabled = false;
          processBtn.textContent = 'Procesar';
        }
      }, format, quality);
    };
  });
});
