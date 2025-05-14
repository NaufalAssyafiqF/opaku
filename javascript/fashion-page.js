import products from "./product-datas.js";

document.addEventListener("DOMContentLoaded", () => {
    // mengambil data products dan memfilternya
    const fashionProducts = products.filter(product => product.item_category === "fashion");
    const itemsForDataLayer = fashionProducts.map(product => ({
        item_id: product.item_id,
        item_name: product.item_name,
        price: product.price,
        item_category: product.item_category,
    })) 

    // Kirim event 'view_item' ke dataLayer
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: "view_item_list",
        ecommerce: {
            item_list_id: "fashion_products",
            item_list_name: "Fashion Products",
            items: itemsForDataLayer,
        },
    });
    
})
