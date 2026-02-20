/*
  # Seed AuraFit AI with Expanded Product Catalog

  1. Products - 110 curated fashion items with Unsplash URLs
  2. Blog Articles - 4 educational articles for Style Guide section
  3. Diverse price points ($39-$699) and occasions (office, gym, party, casual)
  4. Wide variety of categories: tops, bottoms, dresses, outerwear, accessories, shoes
*/

-- Insert Products with high-quality Unsplash fashion images
-- Expanded catalog with 110 items across all categories
INSERT INTO products (name, description, price, category, occasion, image_url, sustainable_rating, color_palette) VALUES

-- OFFICE / PROFESSIONAL (30 items)
('Minimalist Linen Blazer', 'Effortless luxury in pure linen. Perfect for office elegance.', 189.99, 'office', 'office', 'https://images.unsplash.com/photo-1591047990975-2c71cf92f34f?w=500&h=600&fit=crop&q=80', 5, '["#8B8B7E", "#D4D4C8", "#E8E8E0"]'),
('Silk Charmeuse Blouse', 'Sustainable silk with a fluid silhouette for any occasion.', 129.99, 'office', 'office', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&q=80', 4, '["#FFFFFF", "#000000", "#87CEEB"]'),
('High-Waist Tailored Pants', 'Structured elegance. Perfect fit for professional settings.', 159.99, 'office', 'office', 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=500&h=600&fit=crop&q=80', 5, '["#2C2C2C", "#8B7355", "#D3D3D3"]'),
('Tailored Pencil Skirt', 'Timeless silhouette. Works with everything in your wardrobe.', 119.99, 'office', 'office', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#2F4F4F", "#696969"]'),
('Midi Pencil Dress', 'Sophisticated office staple. Pairs perfectly with accessories.', 159.99, 'office', 'office', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop&q=80', 4, '["#4B0082", "#9370DB", "#DDA0DD"]'),
('Structured Blazer Dress', 'Modern take on the classic. Office to evening ready.', 189.99, 'office', 'office', 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#8B0000", "#D3D3D3"]'),
('Linen Blend Pants', 'Breathable, wrinkle-resistant. Summer professional style.', 129.99, 'office', 'office', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=600&fit=crop&q=80', 4, '["#F5DEB3", "#D2B48C", "#FFFFFF"]'),
('White Button-Up Shirt', 'Timeless essential. Endless styling possibilities.', 99.99, 'office', 'office', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=600&fit=crop&q=80', 4, '["#FFFFFF", "#000000", "#C0C0C0"]'),
('Designer Handbag', 'Sophisticated structured leather. Investment piece.', 399.99, 'office', 'office', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop&q=80', 4, '["#8B4513", "#D2B48C", "#FFFFFF"]'),
('Pinstripe Suit Jacket', 'Classic power dressing with modern fit. Authority meets style.', 249.99, 'office', 'office', 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500&h=600&fit=crop&q=80', 4, '["#1C1C1C", "#8B8B8B", "#FFFFFF"]'),
('Wide-Leg Trousers', 'Elegant drape with palazzo styling. Sophisticated comfort.', 139.99, 'office', 'office', 'https://images.unsplash.com/photo-1601904409364-37ee8e47c07f?w=500&h=600&fit=crop&q=80', 3, '["#1A1A1A", "#696969", "#C0C0C0"]'),
('Cashmere Turtleneck', 'Luxurious warmth. Perfect under blazers or standalone.', 219.99, 'office', 'office', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=600&fit=crop&q=80', 5, '["#8B7355", "#000000", "#FFFFFF"]'),
('Leather Briefcase', 'Professional excellence. Built to last a lifetime.', 449.99, 'office', 'office', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop&q=80', 4, '["#654321", "#A0826D", "#8B4513"]'),
('Pointed-Toe Pumps', 'Classic elegance. Versatile heel height for all-day wear.', 179.99, 'office', 'office', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#8B0000", "#C0C0C0"]'),
('Satin Midi Skirt', 'Luxe fabric with flowing movement. Office-appropriate glamour.', 149.99, 'office', 'office', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop&q=80', 4, '["#4B0082", "#1C1C1C", "#696969"]'),
('Structured Wool Coat', 'Timeless silhouette. Investment outerwear for years.', 379.99, 'office', 'office', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop&q=80', 4, '["#2C2C2C", "#8B7355", "#FFFFFF"]'),
('Silk Scarf Collection', 'Versatile accessories. Multiple ways to elevate any outfit.', 89.99, 'office', 'office', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=600&fit=crop&q=80', 5, '["#FF6B6B", "#4ECDC4", "#FFD93D"]'),
('Pearl Drop Earrings', 'Classic sophistication. Timeless elegance for professionals.', 129.99, 'office', 'office', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#F5F5DC", "#FFD700"]'),
('Sleeveless Sheath Dress', 'Boardroom-ready. Works with blazer or standalone.', 159.99, 'office', 'office', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#8B0000", "#C0C0C0"]'),
('Knit Cardigan Set', 'Layering essential. Soft merino wool in professional colors.', 169.99, 'office', 'office', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&q=80', 5, '["#D4A574", "#8B7355", "#FFFFFF"]'),
('Leather Loafers', 'Italian craftsmanship. Comfort meets professional polish.', 249.99, 'office', 'office', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=600&fit=crop&q=80', 4, '["#654321", "#000000", "#8B4513"]'),
('Wrap Blouse', 'Flattering V-neck design. Works for all body types.', 99.99, 'office', 'office', 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=600&fit=crop&q=80', 3, '["#8B0000", "#FFFFFF", "#000000"]'),
('Cropped Suit Jacket', 'Modern proportions. Fresh take on traditional suiting.', 219.99, 'office', 'office', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500&h=600&fit=crop&q=80', 4, '["#2C2C2C", "#696969", "#C0C0C0"]'),
('Silk Camisole', 'Wardrobe workhorse. Layer or wear solo with sophistication.', 89.99, 'office', 'office', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#000000", "#FFB6C1"]'),
('Ankle-Length Pants', 'Clean lines with modern crop. Shows off your shoes perfectly.', 139.99, 'office', 'office', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop&q=80', 4, '["#1C1C1C", "#696969", "#D3D3D3"]'),
('Structured Tote Bag', 'Professional carry-all. Laptop-friendly with style.', 279.99, 'office', 'office', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=600&fit=crop&q=80', 3, '["#8B4513", "#000000", "#C0C0C0"]'),
('Pleated Midi Skirt', 'Movement and elegance. Professional with personality.', 149.99, 'office', 'office', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop&q=80', 4, '["#4B0082", "#8B008B", "#C0C0C0"]'),
('Embroidered Blazer', 'Subtle details elevate the classic. Statement professional wear.', 299.99, 'office', 'office', 'https://images.unsplash.com/photo-1616815305769-83ad5b6d0b7e?w=500&h=600&fit=crop&q=80', 3, '["#1C1C1C", "#FFD700", "#696969"]'),
('Leather Belt Set', 'Essentials collection. Complete your professional wardrobe.', 119.99, 'office', 'office', 'https://images.unsplash.com/photo-1624222247344-318ffc7eb9d8?w=500&h=600&fit=crop&q=80', 4, '["#654321", "#000000", "#8B4513"]'),
('Silk Bow Blouse', 'Feminine detail meets professional polish. Unique and elegant.', 149.99, 'office', 'office', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&q=80', 4, '["#FFFFFF", "#FF6B6B", "#FFD93D"]'),

-- GYM / ATHLETIC (25 items)
('Athletic Performance Leggings', 'Moisture-wicking, high-waisted compression for gym sessions.', 99.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=600&fit=crop&q=80', 4, '["#1A1A1A", "#FF6B6B", "#4ECDC4"]'),
('Yoga Studio Jacket', 'Lightweight, breathable. From studio to street.', 89.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=600&fit=crop&q=80', 5, '["#6B5B95", "#D291BC", "#F0E68C"]'),
('Compression Sports Bra', 'High support, elegant design. Performance meets style.', 79.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1614689891149-e338547bc0b6?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#FF69B4", "#FFFFFF"]'),
('Running Shorts', 'Breathable mesh, supportive fit. Built for performance.', 69.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500&h=600&fit=crop&q=80', 3, '["#FF6347", "#000000", "#FFFFFF"]'),
('Mesh Sports Tank', 'Breathable design with sleek silhouette for workouts.', 59.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#FF69B4", "#87CEEB"]'),
('Athleisure Hoodie', 'Luxury comfort. Perfect for gym to coffee transition.', 119.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&q=80', 4, '["#2F4F4F", "#708090", "#C0C0C0"]'),
('Workout Crop Top', 'High support, sleek design. Engineered for performance.', 69.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#FF6B6B", "#FFB6C1"]'),
('Performance Track Pants', 'Tapered fit with moisture control. Studio to street style.', 109.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=500&h=600&fit=crop&q=80', 4, '["#1C1C1C", "#696969", "#FFFFFF"]'),
('Seamless Biker Shorts', 'Squat-proof, no-chafe design. Maximum comfort.', 79.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=600&fit=crop&q=80', 5, '["#FFB6C1", "#FF69B4", "#FFFFFF"]'),
('Training Tank Duo', 'Versatile pack. Breathable racerback design.', 89.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=600&fit=crop&q=80', 4, '["#87CEEB", "#FFD93D", "#FF6B6B"]'),
('High-Waist Yoga Pants', '4-way stretch with sculpting compression. Studio essential.', 119.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=600&fit=crop&q=80', 5, '["#4B0082", "#000000", "#696969"]'),
('CrossFit Training Shorts', 'Durable fabric with squat-safe design. High-intensity ready.', 74.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#FF6347", "#FFFFFF"]'),
('Reflective Running Jacket', 'Lightweight with 360° visibility. Safety meets performance.', 149.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop&q=80', 4, '["#1C1C1C", "#FFD700", "#C0C0C0"]'),
('Compression Arm Sleeves', 'Enhanced circulation and muscle support. Pro-level gear.', 39.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#FFFFFF", "#FF6B6B"]'),
('Performance Gym Bag', 'Ventilated compartments. Shoe pocket keeps gear fresh.', 89.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop&q=80', 3, '["#1C1C1C", "#696969", "#4ECDC4"]'),
('Sweat-Wicking Headband', 'Stay focused. Non-slip silicone grip technology.', 24.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1611553367649-51c035b87e32?w=500&h=600&fit=crop&q=80', 5, '["#FF69B4", "#87CEEB", "#FFD93D"]'),
('Training Gloves', 'Enhanced grip with wrist support. Protect your hands.', 49.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#C0C0C0", "#FF6347"]'),
('Yoga Mat with Strap', 'Extra-thick cushioning. Non-slip surface for all poses.', 69.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=600&fit=crop&q=80', 5, '["#6B5B95", "#4ECDC4", "#FFB6C1"]'),
('Lightweight Running Shoes', 'Responsive cushioning. Engineered for speed and comfort.', 159.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop&q=80', 4, '["#FF6347", "#000000", "#FFFFFF"]'),
('Cycling Shorts', 'Padded comfort for long rides. Moisture-wicking fabric.', 84.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=600&fit=crop&q=80', 4, '["#1C1C1C", "#FF6B6B", "#696969"]'),
('Recovery Compression Tights', 'Post-workout muscle support. Speeds recovery time.', 129.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=600&fit=crop&q=80', 5, '["#000000", "#4ECDC4", "#696969"]'),
('Moisture-Wicking Socks (6-Pack)', 'Cushioned arch support. Blister-resistant construction.', 59.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&h=600&fit=crop&q=80', 4, '["#FFFFFF", "#000000", "#696969"]'),
('Boxing Training Tank', 'Lightweight mesh. Freedom of movement for striking.', 54.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&h=600&fit=crop&q=80', 3, '["#8B0000", "#000000", "#FFFFFF"]'),
('Resistance Band Set', 'Progressive resistance levels. Full-body workout anywhere.', 44.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=600&fit=crop&q=80', 5, '["#FF6B6B", "#4ECDC4", "#FFD93D"]'),
('Sports Watch', 'Track your fitness. Heart rate and GPS enabled.', 199.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#C0C0C0", "#FF6347"]'),

-- PARTY / EVENING (30 items)
('Silk Evening Gown', 'Dramatic and elegant. Perfect for any formal occasion.', 449.99, 'party', 'party', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=600&fit=crop&q=80', 4, '["#8B0000", "#FF1493", "#FFB6C1"]'),
('Linen Summer Dress', 'Breezy and elegant. Perfect for warm weather style.', 139.99, 'party', 'party', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop&q=80', 5, '["#F0E68C", "#FFD700", "#FFA500"]'),
('Sequin Party Top', 'Sparkle and shine. The ultimate party staple.', 129.99, 'party', 'party', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop&q=80', 2, '["#FFD700", "#FFA500", "#FF69B4"]'),
('Statement Gold Earrings', 'Luxury accessory. Elevates any outfit instantly.', 199.99, 'party', 'party', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop&q=80', 4, '["#FFD700", "#FFA500", "#8B4513"]'),
('Maxi Evening Skirt', 'Romantic and sophisticated. Perfect floor-length elegance.', 219.99, 'party', 'party', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop&q=80', 3, '["#4B0082", "#8B008B", "#DAA520"]'),
('Backless Party Dress', 'Bold and beautiful. The ultimate statement piece.', 279.99, 'party', 'party', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=600&fit=crop&q=80', 3, '["#8B0000", "#FF1493", "#FFB6C1"]'),
('Velvet Cocktail Dress', 'Rich texture meets timeless silhouette. Party perfection.', 249.99, 'party', 'party', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop&q=80', 4, '["#4B0082", "#8B008B", "#000000"]'),
('Metallic Pleated Midi', 'Catch the light with every move. Dance floor ready.', 189.99, 'party', 'party', 'https://images.unsplash.com/photo-1595341595124-b1dc8b11fc78?w=500&h=600&fit=crop&q=80', 3, '["#C0C0C0", "#FFD700", "#FFA500"]'),
('Crystal Embellished Heels', 'Red carpet worthy. Make an entrance everywhere.', 299.99, 'party', 'party', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop&q=80', 2, '["#FFD700", "#C0C0C0", "#FFFFFF"]'),
('Satin Wrap Dress', 'Flattering on all body types. Timeless party elegance.', 169.99, 'party', 'party', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop&q=80', 4, '["#8B0000", "#FF1493", "#000000"]'),
('Embellished Clutch Bag', 'Sparkling detail. Perfect size for phone, keys, lipstick.', 149.99, 'party', 'party', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=600&fit=crop&q=80', 3, '["#FFD700", "#C0C0C0", "#FF69B4"]'),
('Off-Shoulder Gown', 'Show off your shoulders. Romantic and dramatic.', 399.99, 'party', 'party', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=600&fit=crop&q=80', 4, '["#FF1493", "#8B008B", "#FFB6C1"]'),
('High-Slit Maxi Dress', 'Sultry sophistication. Leg-baring elegance.', 259.99, 'party', 'party', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#8B0000", "#C0C0C0"]'),
('Feather Trim Mini Dress', 'Playful luxury. Unique texture and movement.', 299.99, 'party', 'party', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop&q=80', 2, '["#FFB6C1", "#FFFFFF", "#FFD700"]'),
('Statement Cuff Bracelet', 'Bold accessory. Instant glamour.', 179.99, 'party', 'party', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop&q=80', 4, '["#FFD700", "#C0C0C0", "#8B4513"]'),
('Beaded Evening Bag', 'Vintage-inspired elegance. Handcrafted details.', 199.99, 'party', 'party', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=600&fit=crop&q=80', 5, '["#FFD700", "#8B4513", "#FFFFFF"]'),
('Lace Bodysuit', 'Layering piece or standalone. Versatile party essential.', 119.99, 'party', 'party', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#FFFFFF", "#FF69B4"]'),
('Sequin Skirt', 'All-over sparkle. Pair with simple top for balance.', 159.99, 'party', 'party', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop&q=80', 2, '["#FFD700", "#C0C0C0", "#FF69B4"]'),
('Pearl Choker Necklace', 'Modern take on classic pearls. Statement elegance.', 189.99, 'party', 'party', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#F5F5DC", "#FFD700"]'),
('Tulle Ball Gown Skirt', 'Princess moment. Dramatic volume and romance.', 329.99, 'party', 'party', 'https://images.unsplash.com/photo-1595341595124-b1dc8b11fc78?w=500&h=600&fit=crop&q=80', 3, '["#FFB6C1", "#FFFFFF", "#FFD700"]'),
('Rhinestone Strappy Heels', 'Dancing all night comfort. Sparkling style.', 229.99, 'party', 'party', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop&q=80', 2, '["#C0C0C0", "#FFD700", "#FFFFFF"]'),
('Satin Palazzo Pants', 'Unexpected party option. Comfortable sophistication.', 179.99, 'party', 'party', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#8B0000", "#FFD700"]'),
('Embroidered Evening Jacket', 'Statement outerwear. Conversation starter.', 349.99, 'party', 'party', 'https://images.unsplash.com/photo-1591047990975-2c71cf92f34f?w=500&h=600&fit=crop&q=80', 3, '["#4B0082", "#FFD700", "#000000"]'),
('Crystal Hair Pins Set', 'Elegant updo accessories. Add sparkle to any hairstyle.', 79.99, 'party', 'party', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop&q=80', 4, '["#C0C0C0", "#FFD700", "#FFFFFF"]'),
('One-Shoulder Mini Dress', 'Asymmetric chic. Modern party styling.', 219.99, 'party', 'party', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop&q=80', 3, '["#FF1493", "#000000", "#FFD700"]'),
('Gold Chain Necklace', 'Layerable luxury. Versatile evening accessory.', 159.99, 'party', 'party', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop&q=80', 4, '["#FFD700", "#C0C0C0", "#8B4513"]'),
('Draped Cowl Neck Dress', 'Elegant draping. Sophisticated silhouette.', 269.99, 'party', 'party', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop&q=80', 4, '["#8B0000", "#000000", "#C0C0C0"]'),
('Statement Ring Set', 'Mix and match luxury. Eye-catching details.', 139.99, 'party', 'party', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop&q=80', 3, '["#FFD700", "#C0C0C0", "#FF69B4"]'),
('Chiffon Overlay Dress', 'Ethereal layers. Romantic evening style.', 289.99, 'party', 'party', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop&q=80', 4, '["#FFB6C1", "#FFFFFF", "#FFA500"]'),
('Jeweled Sandals', 'Sparkling comfort. Perfect for summer parties.', 199.99, 'party', 'party', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop&q=80', 3, '["#FFD700", "#C0C0C0", "#FFFFFF"]'),

-- CASUAL (25 items)
('Premium Denim Jacket', 'Eco-friendly denim with timeless style. A wardrobe essential.', 149.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop&q=80', 4, '["#1E3A5F", "#B8B8B8", "#FFFFFF"]'),
('Luxury Cashmere Sweater', 'Soft, warm, and timeless. A true luxury essential.', 299.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&q=80', 5, '["#8B7355", "#D4A574", "#FFFFFF"]'),
('Organic Cotton T-Shirt', 'Sustainable comfort in everyday style.', 49.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#000000", "#FFD700"]'),
('Sustainable Leather Boots', 'Eco-conscious craftsmanship. Versatile and durable.', 249.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=600&fit=crop&q=80', 5, '["#8B4513", "#654321", "#A0826D"]'),
('Oversized Wool Coat', 'Statement piece. Warmth with luxury.', 359.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop&q=80', 4, '["#8B7355", "#D3D3D3", "#000000"]'),
('Bamboo Eco Joggers', 'Sustainable comfort. Perfect for casual days.', 89.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500&h=600&fit=crop&q=80', 5, '["#8B7355", "#D4A574", "#FFFFFF"]'),
('Sustainable Sneakers', 'Eco-friendly comfort. Perfect for everyday wear.', 129.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#000000", "#696969"]'),
('Luxury Perfume Set', 'Signature scents. Elevate your style profile.', 149.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop&q=80', 5, '["#8B4513", "#FFD700", "#E6E6FA"]'),
('Relaxed Fit Jeans', 'Comfort meets style. Perfect everyday denim.', 119.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop&q=80', 4, '["#1E3A5F", "#696969", "#FFFFFF"]'),
('Cable Knit Sweater', 'Cozy texture. Classic pattern never goes out of style.', 139.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&q=80', 5, '["#D4A574", "#FFFFFF", "#8B7355"]'),
('Canvas Tote Bag', 'Eco-friendly essential. Versatile everyday carry.', 59.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=600&fit=crop&q=80', 5, '["#F5DEB3", "#8B7355", "#FFFFFF"]'),
('Striped Long-Sleeve Tee', 'French-inspired classic. Effortless casual chic.', 69.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&q=80', 4, '["#FFFFFF", "#000000", "#1E3A5F"]'),
('Leather Crossbody Bag', 'Hands-free convenience. Timeless style.', 179.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop&q=80', 4, '["#8B4513", "#654321", "#FFFFFF"]'),
('Denim Mini Skirt', 'Vintage vibes. Perfect with tights or bare legs.', 79.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop&q=80', 3, '["#1E3A5F", "#FFFFFF", "#696969"]'),
('Flannel Button-Up Shirt', 'Soft brushed cotton. Layer or wear solo.', 89.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=600&fit=crop&q=80', 4, '["#8B0000", "#2F4F4F", "#FFD700"]'),
('Slip-On Canvas Shoes', 'Effortless style. All-day comfort for running errands.', 69.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#000000", "#1E3A5F"]'),
('Cargo Utility Pants', 'Functional pockets. On-trend utility style.', 99.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop&q=80', 3, '["#556B2F", "#2F4F4F", "#696969"]'),
('Hoodie Sweatshirt', 'Essential comfort. Perfect for layering or solo.', 79.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&q=80', 4, '["#2F4F4F", "#696969", "#FFFFFF"]'),
('Wide-Brim Sun Hat', 'Protection meets style. Perfect for outdoor adventures.', 59.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=600&fit=crop&q=80', 5, '["#F5DEB3", "#8B7355", "#FFFFFF"]'),
('Belted Trench Coat', 'Classic silhouette. Rain or shine sophistication.', 279.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop&q=80', 4, '["#D4A574", "#2F4F4F", "#FFFFFF"]'),
('Graphic Print Tee', 'Express yourself. Unique designs and soft fabric.', 44.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#FFFFFF", "#FF6B6B"]'),
('Knit Beanie', 'Cozy warmth. Adds texture to any winter outfit.', 39.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&h=600&fit=crop&q=80', 5, '["#2F4F4F", "#8B7355", "#FFD700"]'),
('Chelsea Boots', 'Classic ankle boot. Easy on-off with elastic panels.', 199.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=600&fit=crop&q=80', 4, '["#654321", "#000000", "#8B4513"]'),
('Quilted Vest', 'Lightweight layering. Packable for travel.', 119.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1591047990975-2c71cf92f34f?w=500&h=600&fit=crop&q=80', 4, '["#2F4F4F", "#000000", "#696969"]'),
('Bomber Jacket', 'Street style staple. Versatile layering piece.', 169.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop&q=80', 4, '["#2F4F4F", "#556B2F", "#000000"]');

-- Insert Blog Articles for Style Guide with high-quality images
INSERT INTO blog_articles (title, slug, content, excerpt, featured_image_url, author, category) VALUES
(
  'Understanding Color Theory and Your Skin Tone',
  'understanding-color-theory',
  'Color theory is the science of how colors interact with one another and with our eyes. When it comes to personal styling, understanding your skin undertone is crucial for selecting colors that make you look radiant and healthy.

Cool undertones pair beautifully with jewel tones like sapphire, emerald, and amethyst. These colors have blue or purple undertones that complement cool skin without creating a washed-out appearance.

Warm undertones shine in earthy palettes featuring golden yellows, warm oranges, terracottas, and warm reds. These colors contain yellow or red undertones that harmonize with warm skin tones, creating a luminous, glowing effect.

Neutral undertones are lucky—you can wear nearly any color! However, you''ll still have colors that make you look absolutely stunning versus just okay. True neutral undertones work well with both cool and warm palettes, depending on the depth of the color.

Pro tip: Check your veins under natural light. Blue veins indicate cool undertones, green suggests warm, and a mix indicates neutral. Combine this with the metal test—does silver or gold look better on you?—to confirm your undertone.',
  'Discover how to identify your skin undertone and choose colors that make you look absolutely radiant.',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'color-theory'
),
(
  'How to Dress for Your Body Type',
  'dress-for-body-type',
  'Understanding your body shape is one of the most empowering tools in fashion. Rather than conforming to trends, dressing for your body type means dressing to emphasize your best features and feel confident every day.

The Hourglass figure has balanced proportions with a defined waist. Emphasize the waist with belted styles, wrap dresses, and fitted silhouettes. Avoid shapeless cuts that hide your natural curves.

The Pear shape features wider hips and thighs relative to the shoulders. Balance proportions with structured tops, boat necks, and lighter colors on top. A-line skirts and flared pants elongate the legs beautifully.

The Rectangle body type has similar shoulder and hip measurements with a straighter silhouette. Create definition with peplum tops, ruching, and statement necklines. Layering adds dimension and visual interest.

The Triangle (broader shoulders, narrower hips) pairs well with A-line skirts and detailed bottoms to balance proportions. Dark colors on top, lighter on bottom creates harmony.

The Inverted Triangle has broader shoulders and narrower hips. Horizontal stripes and embellishments on the lower half balance your silhouette. A-line skirts and wide-leg pants are your friends.

Remember: These are guidelines, not rules. Wear what makes you feel confident and beautiful.',
  'Learn styling principles tailored to your unique body shape and proportions.',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'body-types'
),
(
  'Sustainable Fashion Trends 2026',
  'sustainable-fashion-trends-2026',
  'The fashion industry is undergoing a revolution, and sustainability is no longer a niche concern—it''s becoming mainstream. As we move through 2026, several eco-conscious trends are emerging as must-haves for the conscious consumer.

Circular Fashion: Brands are designing clothes with longevity in mind, using durable materials and timeless designs. Rental services and resale platforms are gaining momentum, allowing pieces to have multiple lives.

Regenerative Materials: Beyond organic, regenerative agriculture is restoring soil health while producing fiber. Companies are investing in innovative materials like lab-grown leather and mushroom-based fabrics.

Transparency First: Consumers demand to know where their clothes come from. Blockchain technology enables complete supply chain transparency, from fiber to finished product.

Minimalist Wardrobes: The "capsule wardrobe" continues to thrive. Quality over quantity means fewer pieces that work together, reducing waste and improving personal style.

Natural Dyes: Synthetic dyes are being replaced with plant-based alternatives that are equally vibrant and far less harmful to the environment.

Vintage and Secondhand: Thrifting is no longer seen as a budget option—it''s fashionable and eco-friendly. Designer secondhand platforms are booming.

Tips for Building a Sustainable Wardrobe:
1. Invest in quality basics that last
2. Choose natural, biodegradable fabrics
3. Support ethical brands with transparent practices
4. Buy secondhand when possible
5. Care for your clothes properly to extend their lifespan',
  'Explore the fashion trends that are shaping a more sustainable industry in 2026 and beyond.',
  'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'sustainability'
),
(
  'The Science Behind Perfect Fit',
  'science-behind-perfect-fit',
  'A perfect fit isn''t just about looking good—it''s about how a garment sits on your unique body and makes you feel. The science of perfect fit combines biomechanics, textiles science, and personal comfort.

Understanding Key Measurements:
- Shoulder Seam: Should sit at the edge of your shoulder joint, not hanging down your arm
- Armhole: Should be high enough to not restrict movement but not so high it pinches
- Sleeve Length: Your wrist should have a quarter-inch of room when arms are at sides
- Waist: Should sit at your natural waist where your body bends comfortably
- Inseam: Pants should break slightly at your shoe, creating a 1-inch pool at the heel

Fabric Performance:
Natural fibers like cotton, linen, and wool breathe and mold to your body over time. Blended fabrics offer stretch and durability. Technical fabrics provide moisture-wicking and recovery.

The Fit Formula:
Perfect fit = correct size + right proportions + suitable fabric + proper tailoring

Two-Way Stretch fabrics reduce bulk while maintaining support. Four-way stretch moves with your body in all directions, ideal for athletic wear.

Tailoring Investment:
A $50 dress that''s perfectly tailored looks more expensive than a $200 dress that doesn''t fit right. Key tailoring investments include: hemming, taking in seams, adjusting shoulders, and shortening sleeves.

Pro Tip: Every body is unique. Don''t expect the same size across all brands. Try things on, and don''t hesitate to invest in tailoring to create your perfect fit.',
  'Learn the biomechanics and science behind garment fit and how to find your perfect fit.',
  'https://images.unsplash.com/photo-1558769132-cb1aea3c1931?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'science'
);

-- Insert Blog Articles for Style Guide with high-quality images
INSERT INTO blog_articles (title, slug, content, excerpt, featured_image_url, author, category) VALUES
(
  'Understanding Color Theory and Your Skin Tone',
  'understanding-color-theory',
  'Color theory is the science of how colors interact with one another and with our eyes. When it comes to personal styling, understanding your skin undertone is crucial for selecting colors that make you look radiant and healthy.

Cool undertones pair beautifully with jewel tones like sapphire, emerald, and amethyst. These colors have blue or purple undertones that complement cool skin without creating a washed-out appearance.

Warm undertones shine in earthy palettes featuring golden yellows, warm oranges, terracottas, and warm reds. These colors contain yellow or red undertones that harmonize with warm skin tones, creating a luminous, glowing effect.

Neutral undertones are lucky—you can wear nearly any color! However, you''ll still have colors that make you look absolutely stunning versus just okay. True neutral undertones work well with both cool and warm palettes, depending on the depth of the color.

Pro tip: Check your veins under natural light. Blue veins indicate cool undertones, green suggests warm, and a mix indicates neutral. Combine this with the metal test—does silver or gold look better on you?—to confirm your undertone.',
  'Discover how to identify your skin undertone and choose colors that make you look absolutely radiant.',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'color-theory'
),
(
  'How to Dress for Your Body Type',
  'dress-for-body-type',
  'Understanding your body shape is one of the most empowering tools in fashion. Rather than conforming to trends, dressing for your body type means dressing to emphasize your best features and feel confident every day.

The Hourglass figure has balanced proportions with a defined waist. Emphasize the waist with belted styles, wrap dresses, and fitted silhouettes. Avoid shapeless cuts that hide your natural curves.

The Pear shape features wider hips and thighs relative to the shoulders. Balance proportions with structured tops, boat necks, and lighter colors on top. A-line skirts and flared pants elongate the legs beautifully.

The Rectangle body type has similar shoulder and hip measurements with a straighter silhouette. Create definition with peplum tops, ruching, and statement necklines. Layering adds dimension and visual interest.

The Triangle (broader shoulders, narrower hips) pairs well with A-line skirts and detailed bottoms to balance proportions. Dark colors on top, lighter on bottom creates harmony.

The Inverted Triangle has broader shoulders and narrower hips. Horizontal stripes and embellishments on the lower half balance your silhouette. A-line skirts and wide-leg pants are your friends.

Remember: These are guidelines, not rules. Wear what makes you feel confident and beautiful.',
  'Learn styling principles tailored to your unique body shape and proportions.',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'body-types'
),
(
  'Sustainable Fashion Trends 2026',
  'sustainable-fashion-trends-2026',
  'The fashion industry is undergoing a revolution, and sustainability is no longer a niche concern—it''s becoming mainstream. As we move through 2026, several eco-conscious trends are emerging as must-haves for the conscious consumer.

Circular Fashion: Brands are designing clothes with longevity in mind, using durable materials and timeless designs. Rental services and resale platforms are gaining momentum, allowing pieces to have multiple lives.

Regenerative Materials: Beyond organic, regenerative agriculture is restoring soil health while producing fiber. Companies are investing in innovative materials like lab-grown leather and mushroom-based fabrics.

Transparency First: Consumers demand to know where their clothes come from. Blockchain technology enables complete supply chain transparency, from fiber to finished product.

Minimalist Wardrobes: The "capsule wardrobe" continues to thrive. Quality over quantity means fewer pieces that work together, reducing waste and improving personal style.

Natural Dyes: Synthetic dyes are being replaced with plant-based alternatives that are equally vibrant and far less harmful to the environment.

Vintage and Secondhand: Thrifting is no longer seen as a budget option—it''s fashionable and eco-friendly. Designer secondhand platforms are booming.

Tips for Building a Sustainable Wardrobe:
1. Invest in quality basics that last
2. Choose natural, biodegradable fabrics
3. Support ethical brands with transparent practices
4. Buy secondhand when possible
5. Care for your clothes properly to extend their lifespan',
  'Explore the fashion trends that are shaping a more sustainable industry in 2026 and beyond.',
  'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'sustainability'
),
(
  'The Science Behind Perfect Fit',
  'science-behind-perfect-fit',
  'A perfect fit isn''t just about looking good—it''s about how a garment sits on your unique body and makes you feel. The science of perfect fit combines biomechanics, textiles science, and personal comfort.

Understanding Key Measurements:
- Shoulder Seam: Should sit at the edge of your shoulder joint, not hanging down your arm
- Armhole: Should be high enough to not restrict movement but not so high it pinches
- Sleeve Length: Your wrist should have a quarter-inch of room when arms are at sides
- Waist: Should sit at your natural waist where your body bends comfortably
- Inseam: Pants should break slightly at your shoe, creating a 1-inch pool at the heel

Fabric Performance:
Natural fibers like cotton, linen, and wool breathe and mold to your body over time. Blended fabrics offer stretch and durability. Technical fabrics provide moisture-wicking and recovery.

The Fit Formula:
Perfect fit = correct size + right proportions + suitable fabric + proper tailoring

Two-Way Stretch fabrics reduce bulk while maintaining support. Four-way stretch moves with your body in all directions, ideal for athletic wear.

Tailoring Investment:
A $50 dress that''s perfectly tailored looks more expensive than a $200 dress that doesn''t fit right. Key tailoring investments include: hemming, taking in seams, adjusting shoulders, and shortening sleeves.

Pro Tip: Every body is unique. Don''t expect the same size across all brands. Try things on, and don''t hesitate to invest in tailoring to create your perfect fit.',
  'Learn the biomechanics and science behind garment fit and how to find your perfect fit.',
  'https://images.unsplash.com/photo-1558769132-cb1aea3c1931?w=800&h=400&fit=crop&q=80',
  'AuraFit AI',
  'science'
);