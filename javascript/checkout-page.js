// src/js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  // Referensi elemen-elemen di HTML
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartEmptyMessage = document.getElementById("cart-empty-message");

  const purchaseButton = document.getElementById("checkout-button");
  const username = document.getElementById("name");
  const address = document.getElementById("address");

  const purchase_Button = document.getElementById("purchase-button");

  const couponDropdown = document.getElementById("coupon-select");
  

  const textNama = document.getElementById("text-nama");
  const textCoupon = document.getElementById("text-coupon");
  const textAddress = document.getElementById("text-address");
  const textTotal = document.getElementById("text-total");

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
    cartItemsContainer.innerHTML =
      "<h1 class='text-center'>your cart is empty</h1>"; // Pastikan container item kosong

    purchaseButton.addEventListener("click", () => {
      alert("cart anda kosong, silahkan belanja terlebih dahulu");
    });
  } else {
    // Jika keranjang tidak kosong, sembunyikan pesan kosong
    cartEmptyMessage.style.display = "none";

    // Gunakan .map() untuk membuat array string HTML untuk setiap item
    const cartItemsHtml = cartItems.map((item, index) => {
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
                    <div class="mr-4"><h1 class="text-lg font-semibold">${index + 1}.</h1></div>
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

    const deleteDropdown = document.getElementById("item-to-delete-select");
    const deleteSelectedButton = document.getElementById(
      "delete-selected-item-btn"
    );

    // Membuat option untuk dropdown
    const makeOption = cartItems.map((item, index) => {
      return `<option value="${index}">${index + 1}. ${item.item_name}</option>`;
    });

    deleteDropdown.innerHTML = makeOption.join("");

    // handler untuk delete item cart sesuai value dropdown
    deleteSelectedButton.addEventListener("click", () => {
      const cartItemsDelete = JSON.parse(localStorage.getItem("cart"));
      const selectedValue = parseInt(deleteDropdown.value);

      // cari item yang akan dikirimkan ke data layer
      const findItem = cartItems[selectedValue];

      // melakukan pust data layer untuk event remove_from_cart
      const itemDatalayerDelete = [{
        item_id: findItem.item_id,
        item_name: findItem.item_name,
        price: findItem.price,
        item_category: findItem.item_category,
        index: 1,
        item_brand: findItem.item_brand,
        item_variant: findItem.item_variant,
        affiliation: findItem.affiliation,
        quantity: findItem.quantity,
      }];

      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: "remove_from_cart",
        ecommerce: {
          currency: "IDR",
          value: findItem.price * findItem.quantity,
          items: itemDatalayerDelete,
        },
      });

      // filter item yang tidak sesuai
      const filteredItems = cartItemsDelete.filter((item, index) => {
        return index !== selectedValue;
      });

      // jadikan filter item yang didapat dan disimpan ke localStorage
      localStorage.setItem("cart", JSON.stringify(filteredItems));
      location.reload();
    });

    // menghitung subtotal dan total
    const subTotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const tax = subTotal * 0.11;
    const total = subTotal + tax;

    document.getElementById(
      "cart-subtotal"
    ).textContent = `Rp. ${subTotal.toLocaleString("id-ID")}`;
    document.getElementById("cart-tax").textContent = `Rp. ${tax.toLocaleString(
      "id-ID"
    )}`;
    document.getElementById(
      "cart-total"
    ).textContent = `Rp. ${total.toLocaleString("id-ID")}`;

    let newTotal = 0;

    // menambahkan event listener checkout
    purchaseButton.addEventListener("click", () => {
      document.getElementById("myModal").classList.remove("hidden");

      const couponText = couponDropdown.value;
      console.log({couponText});
      

      if (couponText === "promo-20%") {
        const discount = (total * 20) / 100;
        newTotal = total - discount;
        textTotal.textContent = `Rp. ${newTotal.toLocaleString("id-ID")}`;
      } else if (couponText === "promo-50%") {
        const discount = (total * 50) / 100;
        newTotal = total - discount;
        textTotal.textContent = `Rp. ${newTotal.toLocaleString("id-ID")}`;
      } else if (couponText === "promo-10%") {
        const discount = (total * 10) / 100;
        newTotal = total - discount;
        textTotal.textContent = `Rp. ${newTotal.toLocaleString("id-ID")}`;
      }


      textNama.textContent = username.value;
      textAddress.textContent = address.value;
      textCoupon.textContent = couponText;

      const itemsForDataLayer = cartItems.map((product, index) => ({
        item_id: product.item_id,
        item_name: product.item_name,
        price: product.price,
        item_category: product.item_category,
        index: index + 1,
        item_brand: product.item_brand,
        item_variant: product.item_variant,
        affiliation: product.affiliation,
        quantity: product.quantity,
      }));

      // kirim event begin_checkout ke data layer
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "IDR",
          value: subTotal,
          items: itemsForDataLayer,
        },
      });

    });

    // event listener untuk purchase  
    purchase_Button.addEventListener("click", () => {
      document.getElementById("myModal").classList.add("hidden");

      const transactionId = new Date().getTime();

      const couponText = couponDropdown.value;

      if (couponText === "promo-20%") {
        const discount = (total * 20) / 100;
        newTotal = total - discount;
        textTotal.textContent = `Rp. ${newTotal.toLocaleString("id-ID")}`;
      } else if (couponText === "promo-50%") {
        const discount = (total * 50) / 100;
        newTotal = total - discount;
        textTotal.textContent = `Rp. ${newTotal.toLocaleString("id-ID")}`;
      } else {
        const discount = (total * 10) / 100;
        newTotal = total - discount;
        textTotal.textContent = `Rp. ${newTotal.toLocaleString("id-ID")}`;
      }


      const itemsForDataLayer = cartItems.map((product, index) => ({
        item_id: product.item_id,
        item_name: product.item_name,
        price: product.price,
        item_category: product.item_category,
        index: index + 1,
        item_brand: product.item_brand,
        item_variant: product.item_variant,
        affiliation: product.affiliation,
        quantity: product.quantity,
      }));

      // kirim event purchase ke data layer
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: `tid-${transactionId}`,
          currency: "IDR",
          value: newTotal,
          coupon: couponText,
          tax: tax,
          username: username.value,
          address: address.value,
          items: itemsForDataLayer,
        },
      });

      alert("Terimakasih sudah belanja di Toko Online Kami!");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    });
    
  }
});
