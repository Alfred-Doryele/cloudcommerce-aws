// ============================================================
//  CloudCommerce — front-end configuration
// ============================================================
//  STATIC MODE (default):
//    Leave API_BASE empty. Products load from data/products.json.
//    This is all you need for Lab 1 (S3 + CloudFront).
//
//  CONNECTED MODE (Lab 3+):
//    Once your Catalog service is running on ECS Fargate behind
//    an Application Load Balancer, paste its URL below, e.g.:
//        window.API_BASE = "https://api.cloudcommerce.example.com";
//    The site will then GET `${API_BASE}/products` instead of the
//    local JSON file, and the Status panel will flip to "Live API".
// ============================================================

window.API_BASE = ""; // <-- leave empty for static mode
