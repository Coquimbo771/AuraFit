import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Cargar variables de entorno desde .env
config();

// Cargar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no encontradas.');
  console.error('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Iniciando migración de base de datos...\n');

  try {
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260211145853_002_seed_products_and_articles.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📄 Archivo de migración cargado');
    console.log('📊 Tamaño del archivo:', (sqlContent.length / 1024).toFixed(2), 'KB\n');

    // 1. Limpiar productos antiguos
    console.log('🗑️  PASO 1: Limpiando productos antiguos...');
    
    const { error: deleteProductsError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos
    
    if (deleteProductsError && deleteProductsError.code !== 'PGRST116') {
      console.warn('⚠️  Advertencia al limpiar productos:', deleteProductsError.message);
    } else {
      console.log('✅ Productos antiguos eliminados');
    }

    const { error: deleteArticlesError } = await supabase
      .from('blog_articles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos
    
    if (deleteArticlesError && deleteArticlesError.code !== 'PGRST116') {
      console.warn('⚠️  Advertencia al limpiar artículos:', deleteArticlesError.message);
    } else {
      console.log('✅ Artículos antiguos eliminados\n');
    }

    // 2. Extraer los datos del SQL
    console.log('📦 PASO 2: Extrayendo datos del SQL...');
    
    // Extraer productos (usando regex para encontrar las líneas de INSERT)
    const productMatches = sqlContent.match(/\('([^']+)',\s*'([^']+)',\s*([\d.]+),\s*'(\w+)',\s*'(\w+)',\s*'([^']+)',\s*(\d+),\s*'(\[[^\]]+\])'\)/g);
    
    if (!productMatches) {
      throw new Error('No se pudieron extraer los productos del archivo SQL');
    }

    const products = productMatches.map(match => {
      const parts = match.match(/\('([^']+)',\s*'([^']+)',\s*([\d.]+),\s*'(\w+)',\s*'(\w+)',\s*'([^']+)',\s*(\d+),\s*'(\[[^\]]+\])'\)/);
      if (!parts) return null;
      
      return {
        name: parts[1],
        description: parts[2],
        price: parseFloat(parts[3]),
        category: parts[4],
        occasion: parts[5],
        image_url: parts[6],
        sustainable_rating: parseInt(parts[7]),
        color_palette: JSON.parse(parts[8])
      };
    }).filter(p => p !== null);

    console.log(`✅ ${products.length} productos extraídos\n`);

    // 3. Insertar productos en lotes
    console.log('💾 PASO 3: Insertando productos (puede tomar 1-2 minutos)...');
    
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(products.length / batchSize);
      
      process.stdout.write(`   Lote ${batchNumber}/${totalBatches} (${batch.length} productos)... `);
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch);
      
      if (error) {
        console.log('❌');
        console.error('   Error:', error.message);
        errorCount += batch.length;
      } else {
        console.log('✅');
        successCount += batch.length;
      }
      
      // Pequeña pausa entre lotes para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n✅ Productos insertados: ${successCount}/${products.length}`);
    if (errorCount > 0) {
      console.log(`⚠️  Productos con error: ${errorCount}`);
    }

    // 4. Insertar artículos de blog
    console.log('\n📝 PASO 4: Insertando artículos de blog...');
    
    const articles = [
      {
        title: 'Understanding Color Theory and Your Skin Tone',
        slug: 'understanding-color-theory',
        content: `Color theory is the science of how colors interact with one another and with our eyes. When it comes to personal styling, understanding your skin undertone is crucial for selecting colors that make you look radiant and healthy.

Cool undertones pair beautifully with jewel tones like sapphire, emerald, and amethyst. These colors have blue or purple undertones that complement cool skin without creating a washed-out appearance.

Warm undertones shine in earthy palettes featuring golden yellows, warm oranges, terracottas, and warm reds. These colors contain yellow or red undertones that harmonize with warm skin tones, creating a luminous, glowing effect.

Neutral undertones are lucky—you can wear nearly any color! However, you'll still have colors that make you look absolutely stunning versus just okay. True neutral undertones work well with both cool and warm palettes, depending on the depth of the color.

Pro tip: Check your veins under natural light. Blue veins indicate cool undertones, green suggests warm, and a mix indicates neutral. Combine this with the metal test—does silver or gold look better on you?—to confirm your undertone.`,
        excerpt: 'Discover how to identify your skin undertone and choose colors that make you look absolutely radiant.',
        featured_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=400&fit=crop&q=80',
        author: 'AuraFit AI',
        category: 'color-theory'
      },
      {
        title: 'How to Dress for Your Body Type',
        slug: 'dress-for-body-type',
        content: `Understanding your body shape is one of the most empowering tools in fashion. Rather than conforming to trends, dressing for your body type means dressing to emphasize your best features and feel confident every day.

The Hourglass figure has balanced proportions with a defined waist. Emphasize the waist with belted styles, wrap dresses, and fitted silhouettes. Avoid shapeless cuts that hide your natural curves.

The Pear shape features wider hips and thighs relative to the shoulders. Balance proportions with structured tops, boat necks, and lighter colors on top. A-line skirts and flared pants elongate the legs beautifully.

The Rectangle body type has similar shoulder and hip measurements with a straighter silhouette. Create definition with peplum tops, ruching, and statement necklines. Layering adds dimension and visual interest.

The Triangle (broader shoulders, narrower hips) pairs well with A-line skirts and detailed bottoms to balance proportions. Dark colors on top, lighter on bottom creates harmony.

The Inverted Triangle has broader shoulders and narrower hips. Horizontal stripes and embellishments on the lower half balance your silhouette. A-line skirts and wide-leg pants are your friends.

Remember: These are guidelines, not rules. Wear what makes you feel confident and beautiful.`,
        excerpt: 'Learn styling principles tailored to your unique body shape and proportions.',
        featured_image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop&q=80',
        author: 'AuraFit AI',
        category: 'body-types'
      },
      {
        title: 'Sustainable Fashion Trends 2026',
        slug: 'sustainable-fashion-trends-2026',
        content: `The fashion industry is undergoing a revolution, and sustainability is no longer a niche concern—it's becoming mainstream. As we move through 2026, several eco-conscious trends are emerging as must-haves for the conscious consumer.

Circular Fashion: Brands are designing clothes with longevity in mind, using durable materials and timeless designs. Rental services and resale platforms are gaining momentum, allowing pieces to have multiple lives.

Regenerative Materials: Beyond organic, regenerative agriculture is restoring soil health while producing fiber. Companies are investing in innovative materials like lab-grown leather and mushroom-based fabrics.

Transparency First: Consumers demand to know where their clothes come from. Blockchain technology enables complete supply chain transparency, from fiber to finished product.

Minimalist Wardrobes: The "capsule wardrobe" continues to thrive. Quality over quantity means fewer pieces that work together, reducing waste and improving personal style.

Natural Dyes: Synthetic dyes are being replaced with plant-based alternatives that are equally vibrant and far less harmful to the environment.

Vintage and Secondhand: Thrifting is no longer seen as a budget option—it's fashionable and eco-friendly. Designer secondhand platforms are booming.

Tips for Building a Sustainable Wardrobe:
1. Invest in quality basics that last
2. Choose natural, biodegradable fabrics
3. Support ethical brands with transparent practices
4. Buy secondhand when possible
5. Care for your clothes properly to extend their lifespan`,
        excerpt: 'Explore the fashion trends that are shaping a more sustainable industry in 2026 and beyond.',
        featured_image_url: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&h=400&fit=crop&q=80',
        author: 'AuraFit AI',
        category: 'sustainability'
      },
      {
        title: 'The Science Behind Perfect Fit',
        slug: 'science-behind-perfect-fit',
        content: `A perfect fit isn't just about looking good—it's about how a garment sits on your unique body and makes you feel. The science of perfect fit combines biomechanics, textiles science, and personal comfort.

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
A $50 dress that's perfectly tailored looks more expensive than a $200 dress that doesn't fit right. Key tailoring investments include: hemming, taking in seams, adjusting shoulders, and shortening sleeves.

Pro Tip: Every body is unique. Don't expect the same size across all brands. Try things on, and don't hesitate to invest in tailoring to create your perfect fit.`,
        excerpt: 'Learn the biomechanics and science behind garment fit and how to find your perfect fit.',
        featured_image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea3c1931?w=800&h=400&fit=crop&q=80',
        author: 'AuraFit AI',
        category: 'science'
      }
    ];

    const { data: articlesData, error: articlesError } = await supabase
      .from('blog_articles')
      .insert(articles);

    if (articlesError) {
      console.error('❌ Error al insertar artículos:', articlesError.message);
    } else {
      console.log(`✅ ${articles.length} artículos de blog insertados\n`);
    }

    // 5. Verificar resultados
    console.log('🔍 PASO 5: Verificando resultados...\n');

    const { data: productCount } = await supabase
      .from('products')
      .select('category', { count: 'exact', head: false });

    if (productCount) {
      const categories = productCount.reduce((acc: any, p: any) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});

      console.log('📊 Productos por categoría:');
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`);
      });
      console.log(`   TOTAL: ${productCount.length}\n`);
    }

    const { count: articleCount } = await supabase
      .from('blog_articles')
      .select('*', { count: 'exact', head: true });

    console.log(`📝 Artículos de blog: ${articleCount || 0}\n`);

    console.log('✅ ¡Migración completada exitosamente! 🎉\n');
    console.log('🚀 Tu Marketplace ahora tiene 110 productos disponibles.\n');

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
runMigration();
