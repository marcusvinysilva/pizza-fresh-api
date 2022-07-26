import { Prisma, PrismaClient } from '@prisma/client';

export const products: Prisma.ProductCreateInput[] = [
  {
    name: 'Anchovas',
    description: 'Anchovas, Calabresa, Tomate, Congumelos e Cebola',
    image: 'https://i.imgur.com/r9Z5Nkt.png',
    price: 40.29,
  },
  {
    name: 'Bacon',
    description: 'Bacon, Pimentão, Champignon e Mussarela',
    image: 'https://i.imgur.com/T4siTwB.png',
    price: 60.59,
  },
  {
    name: 'Peperoni',
    description: 'Peperoni e Mussarela',
    image: 'https://i.imgur.com/enerGan.png',
    price: 40.69,
  },
];

export const product = async (prisma: PrismaClient) => {
  for (const obj of Object.values(products)) {
    await prisma.product.upsert({
      where: { name: obj.name },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
