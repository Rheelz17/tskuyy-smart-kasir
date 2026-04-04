  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const uploadContent = document.getElementById('upload-content');
  const previewContainer = document.getElementById('preview-container');
  const imagePreview = document.getElementById('image-preview');

  // Tombol Ganti & Hapus
  const btnEditFoto = document.getElementById('btn-edit-foto');
  const btnHapusFoto = document.getElementById('btn-hapus-foto');

  // Klik area kosong untuk pilih file
  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('.image-actions')) return; 
    
    if (previewContainer.style.display === 'none' || previewContainer.style.display === '') {
      fileInput.click();
    }
  });

  // Tombol Edit
  btnEditFoto.addEventListener('click', (e) => {
    e.stopPropagation(); 
    fileInput.click();
  });

  // Tombol Hapus
  btnHapusFoto.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = ''; 
    previewContainer.style.display = 'none'; 
    uploadContent.style.display = 'block'; 
  });

  // Proses gambar
  function handleFiles(file) {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        imagePreview.src = e.target.result; 
        previewContainer.style.display = 'block'; 
        uploadContent.style.display = 'none'; 
      }
      
      reader.readAsDataURL(file);
    } else {
      alert("Format gambar kurang pas cuy! Pastikan file berformat JPG atau PNG.");
    }
  }

  fileInput.addEventListener('change', function() {
    handleFiles(this.files[0]);
  });

  // Drag and Drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', function(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files[0]);
  });