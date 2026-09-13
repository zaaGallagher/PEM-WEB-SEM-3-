// ===== Helper: Update Counter Jumlah Baris Tersisa (Poin 4) =====
function updateRowCounter() {
    const table = document.querySelector(".table-responsive table");
    if (!table) return;

    let counterEl = document.getElementById("row-counter");
    if (!counterEl) {
        counterEl = document.createElement("p");
        counterEl.id = "row-counter";
        counterEl.style.marginBottom = "0.75rem";
        counterEl.style.fontSize = "0.9rem";
        counterEl.style.fontWeight = "600";
        counterEl.style.color = "#55677a";
        table.parentNode.insertBefore(counterEl, table);
    }

    const rows = table.querySelectorAll("tbody tr");
    let total = rows.length;
    let visible = 0;

    rows.forEach(function (row) {
        if (row.style.display !== "none") {
            visible++;
        }
    });

    counterEl.textContent = "Menampilkan " + visible + " dari " + total + " data";
}

// ===== Hamburger menu (JS-driven, dengan kelas transisi CSS) =====
function initNavToggle() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const nav = document.querySelector("header nav");
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        nav.classList.toggle("nav-open");
    });
}

// ===== Konfirmasi hapus & update counter baris (Poin 4) =====
function initHapusConfirm() {
    document.querySelectorAll(".btn-hapus").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const row = btn.closest("tr");
            const nama = row ? row.querySelector("td")?.textContent : "data ini";
            const yakin = confirm("Yakin ingin menghapus \"" + nama + "\"?");
            if (yakin && row) {
                row.remove();
                updateRowCounter(); // Memperbarui counter setelah baris dihapus
            }
        });
    });
}

// ===== Filter/pencarian tabel real-time dibatasi ke 1 kolom saja (Poin 3) =====
function initTableFilter() {
    const input = document.getElementById("search-input");
    const table = document.querySelector(".table-responsive table");
    if (!input || !table) return;

    input.addEventListener("keyup", function () {
        const keyword = input.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            // Dibatasi hanya membaca kolom pertama saja (td pertama)
            const firstCell = row.querySelector("td");
            const teks = firstCell ? firstCell.textContent.toLowerCase() : "";
            row.style.display = teks.includes(keyword) ? "" : "none";
        });
        updateRowCounter(); // Memperbarui counter setiap kali filter dijalankan
    });
}

// ===== Validasi form (client-side) =====
function tampilkanError(input, pesan) {
    hapusError(input);
    const span = document.createElement("span");
    span.className = "error";
    span.textContent = pesan;
    input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error")) {
        next.remove();
    }
}

function initValidasiForm() {
    const form = document.getElementById("form-tambah");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        let valid = true;

        // ===== Refactor Validasi Field Wajib menggunakan Array & forEach (Poin 5) =====
        const fieldWajib = [
            { selector: "[name='judul'], [name='nama']", pesan: "Field ini wajib diisi." },
            { selector: "[name='pengarang']", pesan: "Pengarang wajib diisi." }
        ];

        fieldWajib.forEach(function (item) {
            const field = form.querySelector(item.selector);
            if (field) {
                if (field.value.trim() === "") {
                    tampilkanError(field, item.pesan);
                    valid = false;
                } else {
                    hapusError(field);
                }
            }
        });

        // Validasi Tahun Terbit
        const tahun = form.querySelector("[name='tahun']");
        if (tahun) {
            const nilai = parseInt(tahun.value, 10);
            if (isNaN(nilai) || nilai < 1900 || nilai > 2026) {
                tampilkanError(tahun, "Tahun harus di antara 1900-2026.");
                valid = false;
            } else {
                hapusError(tahun);
            }
        }

        // Validasi Stok
        const stok = form.querySelector("[name='stok']");
        if (stok) {
            const nilai = parseInt(stok.value, 10);
            if (isNaN(nilai) || nilai < 0) {
                tampilkanError(stok, "Stok tidak boleh negatif.");
                valid = false;
            } else {
                hapusError(stok);
            }
        }

        // ===== Validasi Field Baru: ISBN (Poin 1) =====
        // Tidak wajib diisi, tetapi jika diisi hanya menerima angka dan tanda hubung (-)
        const isbn = form.querySelector("[name='isbn']");
        if (isbn && isbn.value.trim() !== "") {
            const regexIsbn = /^[0-9-]+$/;
            if (!regexIsbn.test(isbn.value.trim())) {
                tampilkanError(isbn, "ISBN hanya boleh menerima angka dan tanda hubung (-).");
                valid = false;
            } else {
                hapusError(isbn);
            }
        } else if (isbn) {
            hapusError(isbn);
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
    updateRowCounter(); // Menginisialisasi counter pertama kali saat halaman dimuat
});