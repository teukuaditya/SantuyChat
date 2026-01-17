import prisma from "../utils/prisma";
import { GroupFreeValues } from "../utils/schema/group";
import * as userRepositories from "./userRepositories";

export const createGroup = async (data: GroupFreeValues) => {
  // Kamu sudah pakai 'photo' dan 'userId' tapi sebelumnya tidak didefinisikan.
  // Tanpa ubah signature function, kita ambil dari data (atau kamu pastikan data memang membawa 2 field ini).
  const { photo, userId } = data as GroupFreeValues & {
    photo: string;
    userId: string;
  };

  if (!userId)
    throw new Error("userId tidak ada (pastikan dikirim ke createGroup).");
  if (!photo)
    throw new Error("photo tidak ada (pastikan dikirim ke createGroup).");
  if (!data.name) throw new Error("name wajib diisi.");
  if (!data.about) throw new Error("about wajib diisi.");

  const owner = await userRepositories.findRole("OWNER");
  if (!owner)
    throw new Error("Role OWNER tidak ditemukan. Jalankan seed role dulu.");

  return await prisma.group.create({
    data: {
      photo: photo,
      name: data.name,
      about: data.about,
      benefit: [], // WAJIB karena di schema: benefit String[]
      price: 0,
      type: "FREE",
      room: {
        create: {
          created_by: userId, // sesuai schema kamu: created_by
          is_group: true, // sesuai schema kamu: is_group (harus di dalam room.create)
          name: data.name,
          members: {
            create: {
              user_id: userId,
              role_id: owner.id, // jangan pakai optional chaining
            },
          },
        },
      },
    },
  });
};
