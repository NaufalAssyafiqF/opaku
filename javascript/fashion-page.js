import products from "./product-datas.js";

document.addEventListener("DOMContentLoaded", () => {
  // mengambil data products dan memfilternya
  const fashionProducts = products.filter(
    (product) => product.item_category === "fashion"
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

  // Kirim event 'view_item_list' ke dataLayer
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      item_list_id: "fashion_products",
      item_list_name: "Fashion Products",
      items: itemsForDataLayer,
    },
  });
});

const product_2551 = document.getElementById("product-2551");
const product_2552 = document.getElementById("product-2552");
const product_2553 = document.getElementById("product-2553");

product_2551.addEventListener("click", () => {
  const product = products.find(
    (product) => product.item_id === "product-2551"
  );

  const dataLayerforItem = [
    {
      item_id: product.item_id,
      item_name: product.item_name,
      price: product.price,
      item_category: product.item_category,
      index: 1,
      item_brand: product.item_brand,
      item_variant: product.item_variant,
      affiliation: product.affiliation,
    },
  ];

  //   push data layer select_item
  //   window.dataLayer = window.dataLayer || [];
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "select_item",
    ecommerce: {
      item_list_id: "fashion_products",
      item_list_name: "Fashion Products",
      items: dataLayerforItem,
    },
  });
});

product_2552.addEventListener("click", () => {
  const product = products.find(
    (product) => product.item_id === "product-2552"
  );

  const dataLayerforItem = [
    {
      item_id: product.item_id,
      item_name: product.item_name,
      price: product.price,
      item_category: product.item_category,
      index: 1,
      item_brand: product.item_brand,
      item_variant: product.item_variant,
      affiliation: product.affiliation,
    },
  ];

  //   push data layer select_item
  //   window.dataLayer = window.dataLayer || [];
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "select_item",
    ecommerce: {
      item_list_id: "fashion_products",
      item_list_name: "Fashion Products",
      items: dataLayerforItem,
    },
  });
});
product_2553.addEventListener("click", () => {
  const product = products.find(
    (product) => product.item_id === "product-2553"
  );

  const dataLayerforItem = [
    {
      item_id: product.item_id,
      item_name: product.item_name,
      price: product.price,
      item_category: product.item_category,
      index: 1,
      item_brand: product.item_brand,
      item_variant: product.item_variant,
      affiliation: product.affiliation,
    },
  ];

  //   push data layer select_item
  //   window.dataLayer = window.dataLayer || [];
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "select_item",
    ecommerce: {
      item_list_id: "fashion_products",
      item_list_name: "Fashion Products",
      items: dataLayerforItem,
    },
  });
});
