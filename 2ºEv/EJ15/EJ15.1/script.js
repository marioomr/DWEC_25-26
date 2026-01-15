const dropZone = document.getElementById('drop-zone');
const preview = document.getElementById('preview');
const downloads = document.getElementById('downloads');

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
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

document.getElementById('process').addEventListener('click', () => {
  downloads.innerHTML = '';

  const watermark = document.getElementById('watermark').value;
  const maxWidth = parseInt(document.getElementById('maxWidth').value);
  const format = document.getElementById('format').value;

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
        ctx.font = `${Math.floor(width / 20)}px Arial`;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(watermark, width / 2, height - 20);
      }

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const ext = format === 'image/png' ? 'png' : 'jpg';
        a.download = `editada-${file.name.split('.')[0]}.${ext}`;
        a.textContent = a.download;

        downloads.appendChild(a);
      }, format, 0.9);
    };
  });
});
