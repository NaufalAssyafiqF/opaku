// src/js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  // Referensi elemen-elemen di HTML
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartEmptyMessage = document.getElementById("cart-empty-message");

  // Pastikan container dan pesan kosong ada di HTML
  if (!cartItemsContainer || !cartEmptyMessage) {
    console.error(
      "Elemen container keranjang atau pesan kosong tidak ditemukan di HTML!"
    );
    return; // Hentikan eksekusi jika elemen penting tidak ada
  }

  // --- Langkah 1: Ambil data keranjang dari localStorage dengan kunci "cart" ---
  const cartItemsString = localStorage.getItem("cart");
  let cartItems = []; // Default keranjang kosong

  if (cartItemsString) {
    try {
      // Langkah 2: Parse string JSON menjadi array
      const parsedItems = JSON.parse(cartItemsString);

      // Langkah 3: Pastikan hasilnya adalah array
      if (Array.isArray(parsedItems)) {
        cartItems = parsedItems;
      } else {
        console.error("Data di localStorage dengan kunci 'cart' bukan array.");
        // Opsional: Hapus data yang rusak jika bukan array
        // localStorage.removeItem('cart');
      }
    } catch (error) {
      // Tangani error jika data di localStorage rusak (bukan JSON valid)
      console.error("Error parsing cart data from localStorage:", error);
      // Opsional: Hapus data yang rusak
      // localStorage.removeItem('cart');
    }
  }

  // --- Langkah 4: Tampilkan daftar item di HTML ---

  if (cartItems.length === 0) {
    // Jika keranjang kosong, tampilkan pesan kosong
    cartEmptyMessage.style.display = "block";
    cartItemsContainer.innerHTML = "<h1 class='text-center'>your cart is empty</h1>"; // Pastikan container item kosong
  } else {
    // Jika keranjang tidak kosong, sembunyikan pesan kosong
    cartEmptyMessage.style.display = "none";

    // Gunakan .map() untuk membuat array string HTML untuk setiap item
    const cartItemsHtml = cartItems.map((item) => {
      // Pastikan item memiliki properti yang Anda butuhkan, gunakan fallback jika tidak ada
      const itemId = item.item_id || "unknown-id";
      const itemName = item.item_name || "Nama Produk Tidak Diketahui";
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 0;
      const itemImageUrl = item.image || "/images/placeholder.jpg"; // Ganti dengan placeholder default Anda
      const itemCategory = item.item_category;

      // Format harga untuk tampilan
      const formattedPrice = itemPrice.toLocaleString("id-ID");
      const itemTotal = itemPrice * itemQuantity; // Hitung total per item (meskipun total global diabaikan)
      const formattedItemTotal = itemTotal.toLocaleString("id-ID");

      // Struktur HTML untuk satu item di keranjang (sesuai komentar di HTML Anda sebelumnya)
      return `
                <div class="flex items-center border-b border-gray-200 py-4">
                    <img src="${itemImageUrl}" alt="${itemName}" class="h-16 w-16 object-cover rounded mr-4">
                    <div class="flex-grow">
                        <h2 class="text-lg font-semibold">${itemName}</h2>
                        <p class="text-gray-600 text-sm">${itemCategory}</p>
                        <p class="text-gray-800">Rp. ${formattedPrice} x ${itemQuantity}</p>
                        <p class="text-gray-800 font-semibold">Total Item: Rp. ${formattedItemTotal}</p>
                    </div>
                    <div class="flex items-center">
                         </div>
                </div>
            `;
    });

    // Gabungkan array string HTML menjadi satu string besar dan masukkan ke dalam container
    cartItemsContainer.innerHTML = cartItemsHtml.join("");

    const subTotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const tax = subTotal * 0.11;
    const total = subTotal + tax;

    document.getElementById("cart-subtotal").textContent = `Rp. ${subTotal.toLocaleString("id-ID")}`;
    document.getElementById("cart-tax").textContent = `Rp. ${tax.toLocaleString("id-ID")}`;
    document.getElementById("cart-total").textContent = `Rp. ${total.toLocaleString("id-ID")}`;

    const itemsForDataLayer = cartItems.map((product, index) => ({
      item_id: product.item_id,
      item_name: product.item_name,
      price: product.price,
      item_category: product.item_category,
      index: index + 1,
      item_brand: product.item_brand,
      item_variant: product.item_variant,
      affiliation: product.affiliation,
      quantity: product.quantity
    })); 

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "IDR",
        value: total,
        tax: tax,
        items: itemsForDataLayer
      },
    });
  }

  // TODO: Nanti, tambahkan kode di sini untuk:
  //       - Menghitung dan menampilkan total harga
  //       - Menambah event listeners untuk tombol Hapus
  //       - Menambah event listeners untuk input quantity
  //       - Mengirim event GA4 begin_checkout saat halaman ini dimuat (jika keranjang tidak kosong)
  //       - Menambah event listener pada tombol Proses Checkout
});
