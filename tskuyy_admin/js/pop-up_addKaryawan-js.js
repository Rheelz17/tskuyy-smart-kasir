const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const uploadContent = document.getElementById('upload-content');
  const previewContainer = document.getElementById('preview-container');
  const imagePreview = document.getElementById('image-preview');
  
  // Ambil tombol Ganti & Hapus
  const btnEditFoto = document.getElementById('btn-edit-foto');
  const btnHapusFoto = document.getElementById('btn-hapus-foto');

  // 1. Klik area kosong untuk memicu pilih file
  dropZone.addEventListener('click', (e) => {
    // Kalau yang diklik adalah area di dalam image-actions, jangan jalanin klik upload
    if (e.target.closest('.image-actions')) return; 
    
    // Buka input file cuma kalau foto belum ada
    if (previewContainer.style.display === 'none' || previewContainer.style.display === '') {
      fileInput.click();
    }
  });

  // 2. Tombol Edit (Pensil)
  btnEditFoto.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah event nembus ke div bawahnya
    fileInput.click();
  });

  // 3. Tombol Hapus (Tempat Sampah)
  btnHapusFoto.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = ''; // Kosongin file input
    previewContainer.style.display = 'none'; // Sembunyiin gambar & tombol
    uploadContent.style.display = 'block'; // Tampilkan ikon + teks awal
  });

  // 4. Fungsi memproses dan menampilkan gambar
  function handleFiles(file) {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        imagePreview.src = e.target.result; 
        previewContainer.style.display = 'block'; // Munculkan wrapper (gambar + tombol melayang)
        uploadContent.style.display = 'none'; // Sembunyikan konten awal
      }
      
      reader.readAsDataURL(file);
    } else {
      alert("Format fotonya kurang pas cuy! Upload file JPG atau PNG ya.");
    }
  }

  // 5. Saat file dipilih lewat pop-up
  fileInput.addEventListener('change', function() {
    handleFiles(this.files[0]);
  });

  // 6. Logika Drag and Drop
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