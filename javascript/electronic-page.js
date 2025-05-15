import products from "./product-datas.js";

document.addEventListener("DOMContentLoaded", () => {
    
  // mengambil data products dan memfilternya
  const fashionProducts = products.filter(
    (product) => product.item_category === "electronic"
  );
  const itemsForDataLayer = fashionProducts.map((product, index) => ({
    item_id: product.item_id,
    item_name: product.item_name,
    price: product.price,
    item_category: product.item_category,
    index: index + 1,
    item_brand: product.item_brand,
    item_variant: product.item_variant,
    affiliation: product.affiliation,
  }));

  // Kirim event 'view_item' ke dataLayer
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      item_list_id: "electronic_products",
      item_list_name: "Electronic Products",
      items: itemsForDataLayer,
    },
  });
});
