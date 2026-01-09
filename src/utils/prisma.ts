import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
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
