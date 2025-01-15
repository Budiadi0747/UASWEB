$(document).ready(function() {
    let items = JSON.parse(localStorage.getItem('items')) || [];
    const itemsTable = $('#itemsTable').DataTable();

    // Fungsi untuk memperbarui tabel
    function updateTable() {
        itemsTable.clear();
        items.forEach((item, index) => {
            itemsTable.row.add([
                index + 1,
                item.name,
                item.price,
                `<button class="btn btn-success" onclick="viewItem(${index})">Lihat</button>
                 <button class="btn btn-warning btn-sm" onclick="editItem(${index})">Edit</button>
                 <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">Hapus</button>`
            ]).draw();
        });
    }

    // Menyimpan barang baru
    $('#addItemForm').on('submit', function(e) {
        e.preventDefault();

        const fileInput = $('#itemImage')[0].files[0];
        const reader = new FileReader();

        reader.onloadend = function() {
            const newItem = {
                name: $('#itemName').val(),
                price: $('#itemPrice').val(),
                image: reader.result, // Menggunakan hasil pembacaan file
                description: $('#itemDescription').val()
            };
            items.push(newItem);
            localStorage.setItem('items', JSON.stringify(items));
            updateTable();
            $('#addItemModal').modal('hide');
            $('#addItemForm')[0].reset(); // Reset form
        };

        if (fileInput) {
            reader.readAsDataURL(fileInput); // Membaca file sebagai URL data
        }
    });

    // Fungsi untuk mengedit item
    window.editItem = function(index) {
        const item = items[index];
        $('#itemName').val(item.name);
        $('#itemPrice').val(item.price);
        $('#itemDescription').val(item.description);
        $('#itemImage').val(''); // Reset input file
        $('#addItemModal').modal('show');

        // Menangani penyimpanan perubahan
        $('#addItemForm').off('submit').on('submit', function(e) {
            e.preventDefault();

            const fileInput = $('#itemImage')[0].files[0];
            const reader = new FileReader();

            reader.onloadend = function() {
                items[index] = {
                    name: $('#itemName').val(),
                    price: $('#itemPrice').val(),
                    image: fileInput ? reader.result : item.image, // Jika ada gambar baru, gunakan yang baru, jika tidak gunakan yang lama
                    description: $('#itemDescription').val()
                };
                localStorage.setItem('items', JSON.stringify(items));
                updateTable();
                $('#addItemModal').modal('hide');
                $('#addItemForm')[0].reset(); // Reset form
            };

            if (fileInput) {
                reader.readAsDataURL(fileInput); // Membaca file sebagai URL data
            } else {
                // Jika tidak ada file baru, langsung simpan
                items[index].image = item.image; // Pertahankan gambar lama
                localStorage.setItem('items', JSON.stringify(items));
                updateTable();
                $('#addItemModal').modal('hide');
                $('#addItemForm')[0].reset(); // Reset form
            }
        });
    };

    // Fungsi untuk menghapus item
    window.deleteItem = function(index) {
        if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
            items.splice(index, 1); // Hapus item dari array
            localStorage.setItem('items', JSON.stringify(items));
            updateTable(); // Tampilkan data terbaru
        }
    };

    updateTable();
});

// Fungsi untuk melihat detail barang
function viewItem(index) {
    window.location.href = `items.html?index=${index}`;
}
