import { PrismaClient } from 'src/generated/prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  const cakeId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Cake' } })
    .then((category) => category.id);
  const classicId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Classic' } })
    .then((category) => category.id);
  const cornettoId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Cornetto' } })
    .then((category) => category.id);
  const fruitBasedId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Fruit-Based' } })
    .then((category) => category.id);
  const gelatoId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Gelato' } })
    .then((category) => category.id);
  const lowCalorieId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Low Calorie' } })
    .then((category) => category.id);
  const milkshakeId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Milkshake' } })
    .then((category) => category.id);
  const veganId = await prisma.category
    .findFirstOrThrow({ where: { name: 'Vegan' } })
    .then((category) => category.id);

  const dummyProducts = [
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586406/cake1_zhllnp.png',
      name: 'Choco Berry Dream Cake',
      description:
        'Indulge in a heavenly fusion of rich chocolate and vibrant berries in this cake-inspired ice cream. A perfect blend of sweet and tart, with a smooth, melting texture that will transport you to dessert paradise.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: cakeId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586408/cake2_rf2vln.png',
      name: 'Velvet Temptation Slice',
      description:
        'Experience the luxurious smoothness of red velvet in a delightful ice cream form. Each spoonful offers a rich, creamy texture with hints of vanilla and cocoa, creating an unforgettable dessert experience.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: cakeId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586407/classic1_ogddqy.png',
      name: 'Timeless Chocolate Classic',
      description:
        'An all-time favorite that never disappoints. This classic chocolate ice cream boasts a smooth, creamy texture and a comforting, nostalgic taste, perfect for satisfying your cravings anytime.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: classicId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586412/classic2_b2uhur.png',
      name: 'Vanilla Bean Creamy Dream',
      description:
        'Savor the exquisite tenderness of classic vanilla ice cream infused with real vanilla beans. Its silky smooth texture and authentic flavor make it a perfect choice for true vanilla connoisseurs.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: classicId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586412/classic3_qajbxp.png',
      name: 'Strawberry Bliss Classic',
      description:
        'A refreshing take on a classic, featuring the sweet and tangy taste of fresh strawberries. Made with hand-picked berries for an authentic and invigorating flavor experience.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: classicId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586407/classic4_p6li7b.png',
      name: 'Mint Choco Chip Classic',
      description:
        'The perfect marriage of refreshing mint and crunchy chocolate chips. This classic ice cream delivers a cool and sweet sensation that will delight your palate with every scoop.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: classicId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586406/cornetto1_cqw4kt.png',
      name: 'Choco Nutty Cone',
      description:
        'A crispy cone filled with layers of creamy chocolate ice cream, generously topped with nuts and drizzled with luscious caramel sauce. A captivating blend of textures and flavors in every bite.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: cornettoId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586406/cornetto2_iqhybb.png',
      name: 'Berry Swirl Cone Delight',
      description:
        'A delightful crispy cone featuring sweet and tangy berry-flavored ice cream, swirled with fresh fruit sauce. The perfect cool and crunchy sensation for a bright sunny day.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: cornettoId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586408/cornetto3_j2sgzk.png',
      name: 'Caramel Fudge Cone',
      description:
        'This cornetto features smooth vanilla ice cream, enveloped in rich caramel sauce and chunky chocolate fudge pieces. Every bite is an unforgettable sweet adventure.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: cornettoId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586410/fruit-based1_f4jlix.png',
      name: 'Mango Tango Sorbet',
      description:
        'A refreshing and vibrant mango-based ice cream. Crafted from selected ripe mangoes for an authentic tropical taste that is both invigorating and delicious.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: fruitBasedId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586411/fruit-based2_yrk0ic.png',
      name: 'Strawberry Splash Sorbet',
      description:
        'Experience the fresh burst of strawberries in every spoonful of this sorbet. Made with real strawberries, it delivers a natural sweetness and a hint of tanginess that brightens your day.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: fruitBasedId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586410/fruit-based3_sisjqy.png',
      name: 'Kiwi Burst Sorbet',
      description:
        'A unique and revitalizing kiwi ice cream, balancing sweet and tangy flavors perfectly. An excellent choice for those seeking something different and exotic.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: fruitBasedId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586452/fruit-based4_vsnlvo.png',
      name: 'Tropical Berry Splash',
      description:
        'Dive into a mix of exotic tropical berries with this vibrant and refreshing ice cream. Each scoop is bursting with natural fruit flavors, offering a delightful and cool escape.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: fruitBasedId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586450/fruit-based5_xoiekv.png',
      name: 'Citrus Sunshine Sorbet',
      description:
        'Brighten your day with this zesty citrus sorbet. Packed with the invigorating taste of sun-ripened citrus fruits, it offers a cool and colorful delight that awakens your senses.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: fruitBasedId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586450/fruit-based6_xwjhyt.png',
      name: 'Lemon Zest Sorbet',
      description:
        'A tangy and refreshing lemon sorbet that cleanses the palate. Its vibrant flavor and smooth texture make it a perfect light dessert or a cooling treat on a warm day.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: fruitBasedId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586452/fruit-based7_bysgjj.png',
      name: 'Orange Blossom Sorbet',
      description:
        'Experience the sweet and aromatic essence of orange blossoms in this unique sorbet. It delivers a refreshing burst of citrus with a delicate floral hint, creating a truly delightful flavor profile.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: fruitBasedId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586512/gelato1_u3kgbc.png',
      name: 'Italian Pistachio Luxury',
      description:
        'Savor the authentic taste of Italy with this premium pistachio gelato. Made with high-quality ingredients, it boasts a rich, creamy texture and a bold, nutty flavor that is truly luxurious.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: gelatoId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586513/gelato2_oq72r2.png',
      name: 'Roman Espresso Cream',
      description:
        'Awaken your senses with this rich espresso gelato. Its intense coffee flavor and velvety smooth texture are a testament to authentic Italian craftsmanship, perfect for coffee lovers.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: gelatoId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586550/gelato3_cvg9bk.png',
      name: 'Sicilian Lemon Gelato',
      description:
        'A tangy and refreshing lemon gelato, inspired by the sunny orchards of Sicily. Its bright, zesty flavor and smooth consistency make it an invigorating treat on any day.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: gelatoId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586549/gelato4_ipsgbd.png',
      name: 'Hazelnut Dream Gelato',
      description:
        'Indulge in the creamy richness of hazelnut gelato, a classic Italian delight. Made with roasted hazelnuts, it offers a comforting and sophisticated flavor profile.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: gelatoId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586551/low-calorie1_lgbomv.png',
      name: 'Fit Freeze Vanilla',
      description:
        'Enjoy guilt-free indulgence with this delicious low-calorie vanilla ice cream. It offers maximum taste with fewer calories, perfect for those watching their intake without compromising on flavor.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: lowCalorieId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586550/low-calorie2_gsljcs.png',
      name: 'Light Chocolate Fudge',
      description:
        'A delightful low-calorie chocolate fudge ice cream that proves healthy can be delicious. Experience rich chocolate flavor with a smooth texture, minus the guilt.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: lowCalorieId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586552/low-calorie3_i5dzab.png',
      name: 'Skinny Strawberry Chill',
      description:
        'A refreshing low-calorie strawberry ice cream that satisfies your sweet tooth. Made with real strawberries, it offers a vibrant and fruity taste without the extra calories.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: lowCalorieId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586688/low-calorie4_biqsvl.png',
      name: 'Diet Chocolate Swirl',
      description:
        'Indulge in this delightful low-calorie chocolate swirl ice cream. It offers a rich cocoa experience with a hint of sweetness, making it a perfect guilt-free treat for any time of day.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: lowCalorieId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586696/low-calorie5_doxcgv.png',
      name: 'Healthy Mint Chip',
      description:
        'Enjoy the refreshing combination of mint and chocolate chips in this healthy, low-calorie option. It’s a guilt-free way to cool down and satisfy your sweet cravings.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: lowCalorieId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586688/low-calorie6_d3i37m.png',
      name: 'Sugar-Free Berry Delight',
      description:
        'A delightful sugar-free berry ice cream that is bursting with natural fruit flavors. Perfect for those seeking a sweet treat without the added sugar, maintaining maximum taste and satisfaction.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: lowCalorieId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586688/low-calorie7_pnfspt.png',
      name: 'Zero Guilt Mango',
      description:
        'Dive into the tropical taste of mango with this zero-guilt, low-calorie ice cream. It offers maximum taste and refreshing sweetness without compromising on your healthy lifestyle.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: lowCalorieId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586699/milshake1_obvhoi.png',
      name: 'Creamy Vanilla Blast',
      description:
        'A classic creamy vanilla milkshake, thick and satisfying. Perfect for any milkshake lover, offering a smooth and indulgent treat that hits all the right notes.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: milkshakeId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586690/vegan1_bpmqd0.png',
      name: 'Plant-Based Choco Swirl',
      description:
        'A rich and creamy dairy-free frozen dessert, crafted from natural plant-based ingredients. Indulge in decadent chocolate swirls without compromising on your vegan lifestyle.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: veganId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586694/vegan2_wslv02.png',
      name: 'Almond Milk Vanilla Bean',
      description:
        'Savor the delicate sweetness of vanilla bean in this plant-based frozen dessert. Made with smooth almond milk, it offers a guilt-free pleasure for all, especially those avoiding dairy.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: veganId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586689/vegan3_skimcm.png',
      name: 'Vegan Mocha Bliss',
      description:
        'A blissful dairy-free frozen dessert infused with rich mocha flavor. Crafted from natural plant-based ingredients, it’s a perfect pick-me-up for coffee and chocolate lovers alike.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: veganId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586690/vegan4_uc56z5.png',
      name: 'Oatmilk Berry Cool',
      description:
        'Experience the refreshing blend of berries in this oatmilk-based frozen dessert. It’s a delightful dairy-free option, perfect for a light and fruity treat that everyone can enjoy.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: veganId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586691/vegan5_aa6ska.png',
      name: 'Coconut Cream Mango',
      description:
        'Dive into tropical paradise with this rich coconut cream and mango frozen dessert. It’s a creamy, dairy-free treat made with natural ingredients, offering a taste of the tropics in every spoonful.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: veganId,
      isActive: true,
    },
    {
      imageUrl:
        'https://res.cloudinary.com/damandp/image/upload/v1748586712/vegan6_pfj5gz.png',
      name: 'Soy Caramel Swirl',
      description:
        'Indulge in this smooth soy-based frozen dessert, swirled with luscious caramel. It’s a dairy-free delight that offers a rich, sweet, and satisfying experience for all caramel enthusiasts.',
      price: Math.ceil(Math.random() * 100000),
      categoryId: veganId,
      isActive: true,
    },
  ];

  await Promise.all(
    dummyProducts.map(async ({ categoryId, ...data }) => {
      await prisma.product.create({
        data: {
          ...data,
          categoryId: categoryId,
          inventory: {
            create: {
              quantity: Math.ceil(Math.random() * 100),
              isActive: true,
            },
          },
        },
      });
    }),
  );

  console.log('Seeding products and inventories done');
}
