import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    user: {
      photo_url: {
        needs: { photo: true },
        compute(user) {
          if (!user.photo) return null;
          return `${process.env.URL_ASSET_PHOTO ?? ""}${user.photo}`;
        },
      },
    },
  },
});

export default prisma;
