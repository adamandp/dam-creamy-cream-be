import { PrismaClient } from 'src/generated/prisma/client';

const reviews = [
  'The ice cream was honestly disappointing. It melted way too fast and tasted kind of artificial, like cheap vanilla syrup.',
  'Pretty decent ice cream spot. Not mind-blowing, but the chocolate scoop was creamy enough to enjoy on a hot afternoon.',
  'I was expecting more based on the hype. The texture was icy rather than smooth, and the flavors felt a bit muted.',
  'Absolutely loved this place! The pistachio ice cream was rich, nutty, and perfectly balanced—not too sweet at all.',
  'Service was fine, but the ice cream portions were small for the price. Tasted okay, nothing memorable though.',
  'This is my new favorite dessert spot. The cookies and cream had actual cookie chunks and the base was super creamy.',
  'Honestly overrated. The strawberry flavor tasted like cough syrup and I regret paying extra for toppings.',
  'Nice cozy shop with good vibes. The ice cream wasn’t the best I’ve had, but it was still enjoyable enough to come back occasionally.',
  'The mango sorbet was insanely good—refreshing, slightly tangy, and perfect for a hot day. I’d come back just for that.',
  'Too sweet for my taste. After a few bites, it became overwhelming and I couldn’t finish my cup.',
  'Best gelato I’ve had outside of Italy. Smooth texture, rich flavor, and you can really taste the quality ingredients.',
  'The waffle cone was stale and ruined the whole experience. Ice cream itself was okay but nothing special.',
  'I don’t usually write reviews, but this place deserves it. The salted caramel is absolutely addictive.',
  'Prices are way too high for what you get. The scoops are tiny and the flavors don’t justify the cost.',
  'Loved the variety of flavors! Tried avocado and coconut—both were surprisingly good and not too weird.',
  'The ice cream was too icy, not creamy at all. Felt more like frozen water with flavoring.',
  'Such a hidden gem! Small shop but every flavor we tried was amazing, especially the dark chocolate.',
  'It was okay. Not bad, not great. Just your average ice cream you forget about after 10 minutes.',
  'The mint chocolate chip was perfect—refreshing mint without tasting like toothpaste.',
  'Way too sweet and heavy. Felt like I was eating straight sugar with no balance.',
  'I came here with my friends and we all agreed the blueberry cheesecake flavor was incredible.',
  'The shop was crowded and the service was slow, but the ice cream made up for it.',
  'Honestly one of the worst ice creams I’ve had. Weird aftertaste and watery texture.',
  'Pretty solid place for dessert. I wouldn’ttravelfarforit,butI’dstopbyifI’mnearby.',
  'The chocolate fudge was rich and intense—almost too intense, but still very satisfying.',
  'Not impressed. The flavors sounded creative but tasted very artificial.',
  'Great place to chill. The ice cream is smooth and consistent every time I visit.',
  'The rum raisin flavor was surprisingly good, even though I didn’t expect to like it.',
  'Portions are generous and the staff is friendly. Ice cream is above average for sure.',
  'It was fine, but I’ve definitely had better ice cream from a grocery store tub.',
  'The hazelnut flavor is insane. Tastes like Nutella but lighter and creamier.',
  'Too expensive for something that melts in 5 minutes and disappears in 2 bites.',
  'Really enjoyed the experience. Sitting outside with their mango ice cream was perfect.',
  'The vanilla tasted too plain, like it had no real vanilla bean in it.',
  'This place gets busy for a reason—the pistachio and chocolate combo is unbeatable.',
  'Ice cream was okay, but the cone was stale and ruined the experience.',
  'Super creamy, rich, and flavorful. You can tell they use high-quality ingredients.',
  'Nothing special. Just another ice cream shop trying to be trendy.',
  'I could honestly eat their strawberry ice cream every single day and not get bored.',
  'The aftertaste was weird and kind of chemical-like. Not a fan at all.',
  'Everything from the texture to the flavor was perfect. Highly recommend this place.',
];

export async function seedReviews(prisma: PrismaClient) {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: true,
    },
  });
  await prisma.review.createMany({
    data: orders.flatMap((order) =>
      order.orderItems.map((item) => ({
        // orderId: order.id,
        userId: order.userId,
        productId: item.productId,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: reviews[Math.floor(Math.random() * reviews.length)],
      })),
    ),
  });

  console.log('Seeding reviews done');
}
