// src/js/product-detail.js
import products from "./product-datas.js";

console.log("test test");

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Baca URL dan ambil query parameter 'item_id'
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("item_id"); // Mengambil nilai dari parameter 'item_id'

  // Dapatkan referensi ke elemen-elemen tempat konten akan ditampilkan menggunakan ID
  const productDetailContainer = document.getElementById(
    "product-detail-container"
  );
  const productNameElement = document.getElementById("product-name");
  const productCategoryElement = document.getElementById("product-category");
  const productPriceElement = document.getElementById("product-price");
  const productImageElement = document.getElementById("product-image");

  const addToCartButton = document.getElementById("add-to-cart-btn");
  const quantityInput = document.getElementById("product-quantity");
  const pageTitleElement = document.querySelector("title"); // Juga update judul halaman

  // Pastikan elemen-elemen penting ditemukan sebelum melanjutkan
  if (
    !productDetailContainer ||
    !productNameElement ||
    !productPriceElement ||
    !productImageElement ||
    !addToCartButton ||
    !pageTitleElement
  ) {
    console.error(
      "Pastikan semua elemen dengan ID yang diperlukan ada di HTML!"
    );
    // Opsional: Tampilkan pesan error di halaman
    if (productDetailContainer)
      productDetailContainer.innerHTML =
        '<p class="text-red-500 text-center">Terjadi kesalahan memuat detail produk. Mohon coba lagi nanti.</p>';
    return; // Hentikan eksekusi script
  }

  // 2. Ambil data produk berdasarkan ID yang didapat dari data products
  if (productId) {
    // const product = await getProductDataById(productId);
    const product = products.find((p) => p.item_id === productId); // Panggil fungsi Anda

    // 3. Tampilkan data produk di halaman
    if (product) {
      pageTitleElement.innerText = "Opaku Store - " + product.item_name; // Update judul halaman

      productNameElement.innerText = product.item_name;
      productCategoryElement.innerText = product.item_category; // Tampilkan kategori, default 'Umum' jika kosong
      productPriceElement.innerText = `Rp. ${product.price.toLocaleString(
        "id-ID"
      )}`; // Format harga
      productImageElement.src = product.image || ""; // Set src gambar

      productImageElement.alt = product.item_name; // Set alt gambar

      // Simpan ID produk di tombol add to cart (untuk memudahkan saat event click)
      addToCartButton.dataset.productId = product.id;

      // 4. Kirim event 'view_item' ke dataLayer untuk GA4
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: "view_item",
        ecommerce: {
          currency: "IDR",
          value: product.price,
          items: [
            {
              item_id: product.item_id,
              item_name: product.item_name,
              price: product.price,
              item_category: product.category, 
              quantity: 1,
              affiliation: product.affiliation,
              item_brand: product.item_brand,
              item_variant: product.item_variant,
              index: 1
            },
          ],
        },
      });

      // 5. Tambahkan event listener untuk tombol Add to Cart
      addToCartButton.addEventListener("click", () => {
        console.log("test add to cart");
        
        // TODO: Implementasikan logika sebenarnya untuk menambah produk ke keranjang (misal: pakai localStorage)
        let getCart = localStorage.getItem("cart");
        if (getCart) {
          getCart = JSON.parse(getCart);
          getCart.push({
            item_id: product.item_id,
            item_name: product.item_name,
            price: product.price,
            image: product.image,
            quantity: parseInt(quantityInput.value),
            affiliation: product.affiliation,
            item_brand: product.item_brand,
            item_variant: product.item_variant,
            item_category: product.item_category,
          });
          localStorage.setItem("cart", JSON.stringify(getCart));
        } else {
          localStorage.setItem(
            "cart",
            JSON.stringify([
              {
                item_id: product.item_id,
                item_name: product.item_name,
                price: product.price,
                image: product.image,
                quantity: parseInt(quantityInput.value),
                affiliation: product.affiliation,
                item_brand: product.item_brand,
                item_variant: product.item_variant,
                item_category: product.item_category,
              },
            ])
          );
        }

        // TODO: Kirim event 'add_to_cart' ke dataLayer
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          event: "add_to_cart",
          ecommerce: {
            currency: "IDR",
            value: product.price * parseInt(quantityInput.value),
            items: [
              {
                item_id: product.item_id,
                item_name: product.item_name,
                price: product.price,
                item_category: product.item_category,
                quantity: parseInt(quantityInput.value),
                affiliation: product.affiliation,
                item_brand: product.item_brand,
                item_variant: product.item_variant,
                index: 1
              },
            ],
          },
        });
        // console.log("dataLayer push (add_to_cart):", dataLayer.slice(-1)[0]);

        alert(
          `Produk ${product.item_name} dengan quantity ${quantityInput.value} berhasil ditambahkan ke keranjang!`
        );

      });

      

    } else {
      // 6. Tangani kasus produk tidak ditemukan berdasarkan ID
      pageTitleElement.innerText = "Produk Tidak Ditemukan";
      if (productDetailContainer)
        productDetailContainer.innerHTML =
          '<p class="text-red-500 text-center text-xl mt-20">Produk yang Anda cari tidak ditemukan.</p>';
      console.warn(`Produk dengan ID '${productId}' tidak ditemukan.`);
    }
  } else {
    // 7. Tangani kasus parameter 'item_id' tidak ada di URL
    pageTitleElement.innerText = "ID Produk Hilang";
    if (productDetailContainer)
      productDetailContainer.innerHTML =
        '<p class="text-red-500 text-center text-xl mt-20">ID produk tidak diberikan di URL. Tidak dapat menampilkan detail.</p>';
    console.warn("Parameter 'item_id' tidak ditemukan di URL.");
    // Opsional: Redirect pengguna kembali ke halaman daftar produk setelah beberapa detik
    // setTimeout(() => {
    //     window.location.href = '/products.html';
    // }, 3000); // Redirect setelah 3 detik
  }
});
