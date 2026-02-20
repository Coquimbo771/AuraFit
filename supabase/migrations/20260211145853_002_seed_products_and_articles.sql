/*
  # Seed AuraFit AI with Products and Articles

  1. Products - 30 curated fashion items with Unsplash URLs
  2. Blog Articles - 4 educational articles for Style Guide section
  3. Mix of price points ($49-$499) and occasions (office, gym, party, casual)
*/

-- Insert Products with high-quality Unsplash fashion images
-- Updated URLs with verified stable images and q=80 for quality
INSERT INTO products (name, description, price, category, occasion, image_url, sustainable_rating, color_palette) VALUES
('Minimalist Linen Blazer', 'Effortless luxury in pure linen. Perfect for office elegance.', 189.99, 'office', 'office', 'https://images.unsplash.com/photo-1591047990975-2c71cf92f34f?w=500&h=600&fit=crop&q=80', 5, '["#8B8B7E", "#D4D4C8", "#E8E8E0"]'),
('Silk Charmeuse Blouse', 'Sustainable silk with a fluid silhouette for any occasion.', 129.99, 'office', 'office', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&q=80', 4, '["#FFFFFF", "#000000", "#87CEEB"]'),
('Premium Denim Jacket', 'Eco-friendly denim with timeless style. A wardrobe essential.', 149.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop&q=80', 4, '["#1E3A5F", "#B8B8B8", "#FFFFFF"]'),
('High-Waist Tailored Pants', 'Structured elegance. Perfect fit for professional settings.', 159.99, 'office', 'office', 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=500&h=600&fit=crop&q=80', 5, '["#2C2C2C", "#8B7355", "#D3D3D3"]'),
('Athletic Performance Leggings', 'Moisture-wicking, high-waisted compression for gym sessions.', 99.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=600&fit=crop&q=80', 4, '["#1A1A1A", "#FF6B6B", "#4ECDC4"]'),
('Luxury Cashmere Sweater', 'Soft, warm, and timeless. A true luxury essential.', 299.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&q=80', 5, '["#8B7355", "#D4A574", "#FFFFFF"]'),
('Silk Evening Gown', 'Dramatic and elegant. Perfect for any formal occasion.', 449.99, 'party', 'party', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=600&fit=crop&q=80', 4, '["#8B0000", "#FF1493", "#FFB6C1"]'),
('Organic Cotton T-Shirt', 'Sustainable comfort in everyday style.', 49.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#000000", "#FFD700"]'),
('Designer Handbag', 'Sophisticated structured leather. Investment piece.', 399.99, 'office', 'office', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop&q=80', 4, '["#8B4513", "#D2B48C", "#FFFFFF"]'),
('Yoga Studio Jacket', 'Lightweight, breathable. From studio to street.', 89.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=600&fit=crop&q=80', 5, '["#6B5B95", "#D291BC", "#F0E68C"]'),
('Tailored Pencil Skirt', 'Timeless silhouette. Works with everything in your wardrobe.', 119.99, 'office', 'office', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#2F4F4F", "#696969"]'),
('Sustainable Leather Boots', 'Eco-conscious craftsmanship. Versatile and durable.', 249.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=600&fit=crop&q=80', 5, '["#8B4513", "#654321", "#A0826D"]'),
('Linen Summer Dress', 'Breezy and elegant. Perfect for warm weather style.', 139.99, 'party', 'party', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop&q=80', 5, '["#F0E68C", "#FFD700", "#FFA500"]'),
('Compression Sports Bra', 'High support, elegant design. Performance meets style.', 79.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1614689891149-e338547bc0b6?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#FF69B4", "#FFFFFF"]'),
('Oversized Wool Coat', 'Statement piece. Warmth with luxury.', 359.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop&q=80', 4, '["#8B7355", "#D3D3D3", "#000000"]'),
('Midi Pencil Dress', 'Sophisticated office staple. Pairs perfectly with accessories.', 159.99, 'office', 'office', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop&q=80', 4, '["#4B0082", "#9370DB", "#DDA0DD"]'),
('Running Shorts', 'Breathable mesh, supportive fit. Built for performance.', 69.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500&h=600&fit=crop&q=80', 3, '["#FF6347", "#000000", "#FFFFFF"]'),
('Sequin Party Top', 'Sparkle and shine. The ultimate party staple.', 129.99, 'party', 'party', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop&q=80', 2, '["#FFD700", "#FFA500", "#FF69B4"]'),
('Bamboo Eco Joggers', 'Sustainable comfort. Perfect for casual days.', 89.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500&h=600&fit=crop&q=80', 5, '["#8B7355", "#D4A574", "#FFFFFF"]'),
('Statement Gold Earrings', 'Luxury accessory. Elevates any outfit instantly.', 199.99, 'party', 'party', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop&q=80', 4, '["#FFD700", "#FFA500", "#8B4513"]'),
('Structured Blazer Dress', 'Modern take on the classic. Office to evening ready.', 189.99, 'office', 'office', 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#8B0000", "#D3D3D3"]'),
('Mesh Sports Tank', 'Breathable design with sleek silhouette for workouts.', 59.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&h=600&fit=crop&q=80', 3, '["#000000", "#FF69B4", "#87CEEB"]'),
('Maxi Evening Skirt', 'Romantic and sophisticated. Perfect floor-length elegance.', 219.99, 'party', 'party', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop&q=80', 3, '["#4B0082", "#8B008B", "#DAA520"]'),
('Linen Blend Pants', 'Breathable, wrinkle-resistant. Summer professional style.', 129.99, 'office', 'office', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=600&fit=crop&q=80', 4, '["#F5DEB3", "#D2B48C", "#FFFFFF"]'),
('Athleisure Hoodie', 'Luxury comfort. Perfect for gym to coffee transition.', 119.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&q=80', 4, '["#2F4F4F", "#708090", "#C0C0C0"]'),
('Luxury Perfume Set', 'Signature scents. Elevate your style profile.', 149.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop&q=80', 5, '["#8B4513", "#FFD700", "#E6E6LA"]'),
('White Button-Up Shirt', 'Timeless essential. Endless styling possibilities.', 99.99, 'office', 'office', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=600&fit=crop&q=80', 4, '["#FFFFFF", "#000000", "#C0C0C0"]'),
('Backless Party Dress', 'Bold and beautiful. The ultimate statement piece.', 279.99, 'party', 'party', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=600&fit=crop&q=80', 3, '["#8B0000", "#FF1493", "#FFB6C1"]'),
('Sustainable Sneakers', 'Eco-friendly comfort. Perfect for everyday wear.', 129.99, 'casual', 'casual', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop&q=80', 5, '["#FFFFFF", "#000000", "#696969"]'),
('Workout Crop Top', 'High support, sleek design. Engineered for performance.', 69.99, 'gym', 'gym', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&q=80', 4, '["#000000", "#FF6B6B", "#FFB6C1"]');

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