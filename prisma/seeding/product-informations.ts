import { PrismaClient } from 'src/generated/prisma/client';

const dummyProductsInformation = [
  {
    highlights: [
      'Heavenly fusion of premium chocolate and real berry extracts',
      'Cake-inspired dense, smooth, and melting texture',
      'Perfect balance of rich sweetness and refreshing tartness',
    ],
    servingSuggestions: [
      'Slice and serve on a dessert plate for an elegant presentation',
      'Pair with fresh raspberries or strawberries on top',
      'Excellent centerpiece dessert for birthdays and celebrations',
    ],
    productDetails: {
      size: '500ml / mini cake tub',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 4 months from production date',
    },
    whyChoose:
      'This is the ultimate choice for cake lovers who want the refreshing coldness of premium ice cream combined with rich chocolate decadence.',
  },
  {
    highlights: [
      'Luxurious red velvet cake flavor notes',
      'Infused with aromatic vanilla and premium cocoa hints',
      'Velvety smooth, ultra-creamy premium texture',
    ],
    servingSuggestions: [
      'Enjoy as a premium afternoon indulgence',
      'Pair beautifully with a hot cup of espresso or black coffee',
      'Garnish with white chocolate shavings',
    ],
    productDetails: {
      size: '150ml / slice portion',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 3 months from production date',
    },
    whyChoose:
      'It brings the sophisticated elegance of a gourmet bakery red velvet cake into a perfectly portioned, refreshing frozen luxury.',
  },
  {
    highlights: [
      'Deep, comforting, and nostalgic authentic chocolate flavor',
      'Smooth, traditional creamy texture that satisfies instantly',
      'Loved by kids and adults alike',
    ],
    servingSuggestions: [
      'Enjoy straight out of the cup with a spoon',
      'Add toppings like chocolate sprinkles, chopped nuts, or whipped cream',
      'Blend with milk to create a rich, classic chocolate milkshake',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'A foolproof crowd-pleaser made with top-tier cocoa, delivering the exact nostalgic comfort food experience you crave.',
  },
  {
    highlights: [
      'Infused with real, visible premium vanilla bean specks',
      'Silky smooth and exceptionally tender mouthfeel',
      'Authentic, pure aromatic vanilla flavor',
    ],
    servingSuggestions: [
      'Perfect scoop on top of hot apple pie or warm brownies',
      'Create custom sundaes by adding fruits and syrups',
      'Savor alone to fully experience the high-quality vanilla beans',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'This isn’t just ordinary vanilla; it uses real vanilla beans to give sophisticated connoisseurs a rich, authentic taste experience.',
  },
  {
    highlights: [
      'Made from sweet, hand-picked fresh strawberries',
      'Invigoratingly fruity and naturally vibrant profile',
      'Smooth cream base with refreshing berry notes',
    ],
    servingSuggestions: [
      'Serve alongside fresh seasonal fruits',
      'Great for making a vibrant pink strawberry milkshake',
      'Layer with granola and syrup for a delicious frozen parfait',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Crafted with premium hand-picked berries to offer a refreshing fruit burst that tastes authentically like summer.',
  },
  {
    highlights: [
      'Crisp, refreshing mint base that cools down your palate',
      'Generously loaded with premium crunchy chocolate chips',
      'Exciting dual-texture contrast of smooth and crunchy',
    ],
    servingSuggestions: [
      'Excellent as a refreshing palate cleanser after dinner',
      'Top with chocolate fudge sauce for extra indulgence',
      'Serve in a waffle cone for full texture appreciation',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'The immaculate ratio of cool mint freshness and snappy chocolate pieces makes it the ultimate refreshing treat.',
  },
  {
    highlights: [
      'Ultra-crisp waffle cone with a delicious chocolate tip',
      'Topped with highly aromatic roasted nuts',
      'Drizzled with rich, viscous caramel sauce layers',
    ],
    servingSuggestions: [
      'Perfect grab-and-go snack directly from the wrapper',
      'Ideal treat for outdoor activities and sunny days',
      'Enjoy as a multi-textured dessert on the move',
    ],
    productDetails: {
      size: '120ml / cone',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 5 months from production date',
    },
    whyChoose:
      'Offers an exciting multi-sensory adventure, mapping out layers of crunch, nuttiness, caramel smoothness, and chocolate depths.',
  },
  {
    highlights: [
      'Crispy, golden baked waffle cone structure',
      'Vibrant swirls of natural fresh berry fruit sauce',
      'Light, tangy, and uplifting fruit flavor notes',
    ],
    servingSuggestions: [
      'Eat immediately after peeling the wrapper',
      'Great afternoon snack to beat the summer heat',
      'Fun dessert choice for kids and outdoor picnics',
    ],
    productDetails: {
      size: '120ml / cone',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 5 months from production date',
    },
    whyChoose:
      'Blends the exciting crunch of a classic cone with the intensely bright and tangy notes of authentic berry swirls.',
  },
  {
    highlights: [
      'Smooth vanilla foundation wrapped in premium caramel',
      'Packed with chunky, chewy chocolate fudge pieces',
      'Crispy golden cone with a chocolate-filled core',
    ],
    servingSuggestions: [
      'Unwrap and enjoy on sunny park days',
      'Satisfies both sweet caramel and rich chocolate cravings simultaneously',
      'No dishes required—just unwrap and bite!',
    ],
    productDetails: {
      size: '120ml / cone',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 5 months from production date',
    },
    whyChoose:
      'It perfectly balances smooth vanilla, gooey caramel, and chunky chocolate fudge in a convenient handheld treat.',
  },
  {
    highlights: [
      'Made from choice, sun-ripened tropical mangoes',
      'Naturally dairy-free, light, and hyper-refreshing sorbet base',
      'Vibrant color and intense natural aroma',
    ],
    servingSuggestions: [
      'Pair with a splash of lime juice for an extra kick',
      'Scoop into a cocktail glass as a base for tropical mocktails',
      'Serve with a sprig of fresh mint leaf',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Captures the pure, unadulterated essence of tropical mangoes in a clean, fat-free, refreshing sorbet format.',
  },
  {
    highlights: [
      '100% dairy-free formulation with real crushed strawberries',
      'Perfectly retains natural strawberry sweet-and-sour balance',
      'Clean, crisp finish on the tongue',
    ],
    servingSuggestions: [
      'Enjoy as a refreshing mid-day cooldown snack',
      'Garnish with sliced fresh kiwis or mint leaves',
      'Blend with ice water for an instantaneous slushie treat',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Provides an intense, natural berry rush without any dairy heaviness—ideal for hot afternoons.',
  },
  {
    highlights: [
      'Exotic and completely unique kiwi flavor profile',
      'High tanginess index for a powerful palate awakening',
      'Light, icy, and dairy-free composition',
    ],
    servingSuggestions: [
      'Serve as an unexpected, sophisticated dinner party dessert',
      'Combine with other tropical fruit scoops for a vibrant sorbet bowl',
      'Drizzle with a touch of honey before consuming',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Breaks away from traditional flavors to offer a bold, exotic kiwi tang that cleanses and revitalizes.',
  },
  {
    highlights: [
      'A proprietary blend of multiple exotic tropical berries',
      'Visually vibrant and deep-colored formulation',
      'Bursting with natural vitamins and authentic fruit notes',
    ],
    servingSuggestions: [
      'Top with shaved coconut flakes',
      'An amazing guilt-free addition to morning smoothie bowls',
      'Savor in the sun for an instantaneous vacation vibe',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Combines the health feel of real berries with the sheer joy of a refreshing, ice-cold summer escape.',
  },
  {
    highlights: [
      'Packed with an invigorating medley of sun-ripened citrus fruits',
      'Zesty, vibrant, and incredibly high refreshment factor',
      'A beautiful, colorful, all-natural presentation',
    ],
    servingSuggestions: [
      'Perfect pick-me-up during a hot workday slump',
      'Pair with a splash of sparkling water or club soda',
      'Garnish with orange slices or lime peels',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Acts like literal frozen sunshine, breaking through exhaustion with an instant jolt of citrus energy.',
  },
  {
    highlights: [
      'High-impact, genuine lemon zest sour punch',
      'Functions beautifully as a high-end gourmet palate cleanser',
      '100% fat-free and light on the stomach',
    ],
    servingSuggestions: [
      'Serve between course meals or right after a heavy dinner',
      'Incorporate into summer cocktails or lemonades',
      'Accompany with a side of sweet wafer biscuits',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'It provides the cleanest, sharpest lemon flavor imaginable to instantly reset your tastebuds and cool you down.',
  },
  {
    highlights: [
      'Infused with rare, delicate aromatic orange blossom essence',
      'Sophisticated floral-citrus sweet crossover flavor profile',
      'Incredibly smooth texture for an icy sorbet',
    ],
    servingSuggestions: [
      'Serve at fancy brunches or high-tea events',
      'Pair with a white wine or champagne pour',
      'Enjoy solo while relaxing under shade',
    ],
    productDetails: {
      size: '150ml / cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'A floral, elegant twist on classic orange sorbet designed for refined tastes looking for something premium.',
  },
  {
    highlights: [
      'Authentic Italian-style dense gelato recipe',
      'Made with rich, roasted high-grade pistachios',
      'Deep, earthy, buttery-nutty luxurious profile',
    ],
    servingSuggestions: [
      'Serve slightly softened for true Italian gelato creaminess',
      'Dust with extra chopped salted pistachios on top',
      'Pair with dark chocolate curls or waffle crisps',
    ],
    productDetails: {
      size: '150ml / premium cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 4 months from production date',
    },
    whyChoose:
      'Crafted with genuine artisanal methods to bring the bold, nutty indulgence of a Roman gelateria straight to you.',
  },
  {
    highlights: [
      'Intense, high-quality brewed espresso extraction base',
      'Velvety, slow-churned low-air gelato consistency',
      'An authentic treat displaying true Italian craftsmanship',
    ],
    servingSuggestions: [
      'Pour a shot of hot espresso over it to make an Affogato',
      'Serve as a sophisticated alternative to late-afternoon iced coffee',
      'Accompany with biscotti biscuits',
    ],
    productDetails: {
      size: '150ml / premium cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 4 months from production date',
    },
    whyChoose:
      'The ultimate luxury for coffee lovers who demand deep espresso strength combined with heavy, slow-churned gelato smoothness.',
  },
  {
    highlights: [
      'Inspired by the world-famous sunny orchards of Sicily',
      'Denser and creamier than a traditional fruit sorbet',
      'Bright, high-zest invigorating flavor notes',
    ],
    servingSuggestions: [
      'Garnish with candied lemon peels',
      'Serve as a sunny weekend mid-day reward',
      'Pairs brilliantly with vanilla sponge cake slices',
    ],
    productDetails: {
      size: '150ml / premium cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 4 months from production date',
    },
    whyChoose:
      'Unlike standard water-based lemon sorbets, this offers a dense, creamy, premium gelato texture with a Sicilian sour bite.',
  },
  {
    highlights: [
      'Classic, highly-sought-after Italian Nocciola recipe',
      'Made with rich, deeply-roasted premium hazelnuts',
      'Sophisticated, warm, comforting nut profile',
    ],
    servingSuggestions: [
      'Drizzle with warm dark chocolate sauce',
      'Serve alongside a warm croissant or wafer roll',
      'Enjoy slow to savor the complex roasted hazelnut notes',
    ],
    productDetails: {
      size: '150ml / premium cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 4 months from production date',
    },
    whyChoose:
      'Delivers a deep, comforting, buttery hazelnut experience that balances earthy warmth with cool, dense luxury.',
  },
  {
    highlights: [
      'Extremely low calorie footprint per serving',
      'Guilt-free indulgence built for active/diet lifestyles',
      'Maintains a remarkably smooth classic vanilla profile',
    ],
    servingSuggestions: [
      'Perfect late-night snack when calorie budgets are tight',
      'Top with a handful of clean oats or sugar-free syrups',
      'Blend into protein shakes for an icy vanilla texture boost',
    ],
    productDetails: {
      size: '150ml / diet cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Engineered specifically so you do not have to compromise on classic vanilla indulgence while maintaining your calorie goals.',
  },
  {
    highlights: [
      'Rich fudge chocolate taste with minimal calorie impact',
      'Proof that low-fat healthy recipes can taste highly decadent',
      'Silky chocolate texture that avoids wateriness',
    ],
    servingSuggestions: [
      'Enjoy post-workout for a cooling, sweet reward',
      'Mix with low-calorie dark chocolate flakes',
      'Eat directly from the container while reading or watching a movie',
    ],
    productDetails: {
      size: '150ml / diet cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Bridges the gap between heavy, high-calorie fudge cravings and a strict fitness schedule flawlessly.',
  },
  {
    highlights: [
      'Skinny formulation loaded with genuine strawberry bits',
      'Fruity sweet profile driven by natural fruit sugars',
      'Low calorie density for maximum diet compatibility',
    ],
    servingSuggestions: [
      'Serve as a cooling treat on bright summer days',
      'Pair with fresh fruit bowls for a fiber-rich snack time',
      'Incorporate into clean yogurt parfaits',
    ],
    productDetails: {
      size: '150ml / diet cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Gives your sweet tooth an authentic, refreshing berry thrill without any of the extra caloric baggage.',
  },
  {
    highlights: [
      'Deep, dark chocolate cocoa ribbon swirls incorporated throughout',
      'Diet-conscious recipe that guarantees zero guilt',
      'Light cream base with a satisfying cocoa finish',
    ],
    servingSuggestions: [
      'Eat at any hour of the day when a chocolate craving strikes',
      'Enjoy with zero-calorie maple or cocoa syrups',
      'Perfect single portion size for immediate consumption',
    ],
    productDetails: {
      size: '150ml / diet cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'The inclusion of an active cocoa swirl gives it a multi-dimensional chocolate flavor that mimics full-fat alternatives.',
  },
  {
    highlights: [
      'Crisp, cool mint base under a diet-friendly framework',
      'Sprinkled with smart, low-sugar crunchy chocolate chips',
      'Highly refreshing profile designed to satisfy and cool',
    ],
    servingSuggestions: [
      'Great afternoon snack to wake up your senses healthily',
      'Enjoy straight from the freezer on hot days',
      'Perfect option for kids who love mint but need low-sugar alternatives',
    ],
    productDetails: {
      size: '150ml / diet cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'The exact iconic mint-chip sensation you love, optimized safely to fit into a healthy, everyday wellness lifestyle.',
  },
  {
    highlights: [
      'Strictly 0% added refined table sugars',
      'Bursting with natural berry fruit flavor notes',
      'No artificial, chemical-tasting sugar aftertaste',
    ],
    servingSuggestions: [
      'Ideal for diabetic-friendly or keto-leaning sweet meal plans',
      'Top with raw almonds or chia seeds',
      'Enjoy as a light, guilt-free bedtime snack',
    ],
    productDetails: {
      size: '150ml / diet cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Maintains 100% taste satisfaction purely through natural fruit chemistry and smart formulation without spiking your blood sugar.',
  },
  {
    highlights: [
      'Zero-guilt tropical mango profile',
      'Intense fruit-forward sweetness with minimal calorie footprint',
      'Smooth, easy-to-scoop clean texture',
    ],
    servingSuggestions: [
      'Pair with low-fat coconut milk yogurt',
      'Enjoy poolside or after light outdoor workouts',
      'Add a tiny dash of lime zest for a premium punch',
    ],
    productDetails: {
      size: '150ml / diet cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Provides the full, sunny, rich sweetness of premium tropical mangoes while leaving all the diet-breaking calories behind.',
  },
  {
    highlights: [
      'Thick, rich, drinkable premium milkshake texture',
      'Deep, multi-layered vanilla extract profile',
      'Highly satisfying, satisfyingly dense drink format',
    ],
    servingSuggestions: [
      'Serve in a tall glass with a wide straw',
      'Top generously with whipped cream and a cherry',
      'Perfect companion drink to burgers and fries',
    ],
    productDetails: {
      size: '300ml / ready-to-drink bottle',
      storage: 'Keep frozen or ultra-chilled at -18°C',
      shelfLife: 'Up to 3 months from production date',
    },
    whyChoose:
      'It bypasses the need for an expensive blender, delivering a thick, authentic diner-style vanilla milkshake instantly.',
  },
  {
    highlights: [
      '100% dairy-free, animal-product-free certified vegan',
      'Swirled with thick, luxurious plant-based dark chocolate fudge',
      'Incredibly creamy base that rivals dairy milk',
    ],
    servingSuggestions: [
      'Enjoy out of a bowl with vegan wafer cookies',
      'Add to plant-based dessert recipes as a premium side scoop',
      'Top with shredded coconut or vegan marshmallows',
    ],
    productDetails: {
      size: '150ml / plant cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Crafted carefully from natural plant fats to recreate the exact texture of dairy cream, so vegan lifestyles feel fully indulgent.',
  },
  {
    highlights: [
      'Premium roasted almond milk foundation',
      'Infused with real vanilla bean specks for absolute flavor authenticity',
      'Highly digestable, lactose-free, and clean-tasting',
    ],
    servingSuggestions: [
      'Perfect for lactose-intolerant individuals seeking classic vanilla flavors',
      'Scoop over oatmeal pancakes or vegan waffles',
      'Blend with almond milk for a quick vegan shake',
    ],
    productDetails: {
      size: '150ml / plant cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'The nutty undertone of almond milk complements the authentic vanilla beans to create a complex, delightful flavor layer.',
  },
  {
    highlights: [
      'Perfect crossover of bold coffee beans and rich dark cocoa',
      'Crafted from 100% natural, clean plant-based ingredients',
      'Delightful pick-me-up profile with a rich aroma',
    ],
    servingSuggestions: [
      'Enjoy as a premium afternoon dessert treat',
      'Serve alongside roasted walnuts or dark vegan chocolates',
      'Garnish with coffee bean decorations',
    ],
    productDetails: {
      size: '150ml / plant cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'It simultaneously answers the call of coffee lovers, chocolate lovers, and vegan food requirements in one single cup.',
  },
  {
    highlights: [
      'Ultra-trendy, highly-sustainable oatmilk creamy foundation',
      'Bursting with real, naturally sweet refreshing berry infusions',
      'Nut-free and dairy-free friendly formulation',
    ],
    servingSuggestions: [
      'Excellent hot-weather dessert option for family gatherings',
      'Top with crushed graham crackers or granola',
      'Eat alongside freshly sliced seasonal mixed berries',
    ],
    productDetails: {
      size: '150ml / plant cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Oatmilk provides a uniquely neutral, buttery-smooth texture that allows the bright berry notes to shine completely clear.',
  },
  {
    highlights: [
      'Rich, naturally high-fat premium coconut cream base',
      'Deeply infused with ripe, juicy tropical mango pulp',
      'Exceedingly creamy mouthfeel matching premium traditional gelato',
    ],
    servingSuggestions: [
      'Top with toasted coconut flakes for an absolute texture win',
      'Serve inside a hollowed-out coconut shell at parties',
      'Pair alongside sliced fresh mango blocks',
    ],
    productDetails: {
      size: '150ml / plant cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'The natural synergy between tropical coconut cream and sweet mango pulp delivers an uncompromised paradise experience.',
  },
  {
    highlights: [
      'Smooth, highly-refined clean soy protein base',
      'Loaded with heavily swirled vegan-friendly luscious caramel',
      'Satisfies intense sweet cravings without animal fats',
    ],
    servingSuggestions: [
      'Drizzle with crushed vegan pretzel bits for a sweet-salty twist',
      'Enjoy as a post-dinner luxury treat with loved ones',
      'Great base for building gourmet vegan sundae creations',
    ],
    productDetails: {
      size: '150ml / plant cup',
      storage: 'Keep frozen at -18°C',
      shelfLife: 'Up to 6 months from production date',
    },
    whyChoose:
      'Gives absolute caramel enthusiasts a robust, high-sweetness indulgence completely clean of any dairy products.',
  },
];

export async function seedProductInformations(prisma: PrismaClient) {
  const products = await prisma.product.findMany();

  await prisma.productInformation.createMany({
    data: products.map((product, index) => ({
      productId: product.id,
      highlights: dummyProductsInformation[index].highlights,
      servingSuggestions: dummyProductsInformation[index].servingSuggestions,
      productDetails: dummyProductsInformation[index].productDetails,
      whyChoose: dummyProductsInformation[index].whyChoose,
    })),
  });

  console.log('Seeding product informations done');
}
