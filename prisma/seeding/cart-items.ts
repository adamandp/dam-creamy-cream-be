import { PrismaClient } from 'src/generated/prisma/client';

export async function seedCartItems(prisma: PrismaClient) {
  const products = await prisma.product.findMany();
  const carts = await prisma.cart.findMany();

  await prisma.cartItem.createMany({
    data: Array.from({ length: carts.length * 6 }).map((_, index) => ({
      quantity: Math.floor(Math.random() * 10),
      productId: products[index % products.length].id,
      cartId: carts[index % carts.length].id,
    })),
  });

  console.log('Seeding cart items done');
}
