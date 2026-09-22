<?php
// migrasi_buku.php
require __DIR__ . '/includes/koneksi.php';

$jsonPath = __DIR__ . '/data/buku.json';

if (!file_exists($jsonPath)) {
    die("File JSON tidak ditemukan di: " . $jsonPath);
}

// 1. Baca data dari file JSON[cite: 2]
$jsonData = file_get_contents($jsonPath);
$bukuArray = json_decode($jsonData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die("Gagal membaca format JSON: " . json_last_error_msg());
}

// 2. Siapkan Query INSERT
$sql = "INSERT INTO buku (judul, pengarang, tahun, stok) VALUES (:judul, :pengarang, :tahun, :stok)";
$stmt = $pdo->prepare($sql);

$sukses = 0;
$gagal = 0;

echo "<h2>Memulai Proses Migrasi Data...</h2>";

// 3. Eksekusi query INSERT untuk tiap baris data[cite: 2]
foreach ($bukuArray as $buku) {
    try {
        $stmt->execute([
            'judul'     => $buku['judul'],
            'pengarang' => $buku['pengarang'],
            'tahun'     => $buku['tahun'],
            'stok'      => $buku['stok']
        ]);
        
        echo "<p style='color: green;'>Sukses: " . htmlspecialchars($buku['judul']) . "</p>";
        $sukses++;
        
    } catch (PDOException $e) {
        echo "<p style='color: red;'>Gagal: " . htmlspecialchars($buku['judul']) . " | Error: " . $e->getMessage() . "</p>";
        $gagal++;
    }
}

echo "<hr>";
echo "<h3>Migrasi Selesai!</h3>";
echo "Total Sukses: $sukses <br>";
echo "Total Gagal: $gagal <br>";
?>