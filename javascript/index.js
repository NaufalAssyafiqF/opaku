console.log("test halo oioi");

const bannerPromotion = document.getElementById("banner-promotion");

bannerPromotion.addEventListener("click", () => {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: "select_promotion",
      ecommerce: {
        creative_name: "Super sale 50% banner",
        creative_slot: "featured_app_1",
        promotion_id: "promo-433",
        promotion_name: "Super sale 50%",
      },
    });

    window.location.href = "promotion-page.html";
});