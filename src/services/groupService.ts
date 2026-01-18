import type { GroupFreeValues } from "../utils/schema/group";
import * as GroupRepositories from "../repositories/groupRepositories";

export const createGroup = async (
  data: GroupFreeValues,
  photo: string,
  userId: string,
) => {
  const group = await GroupRepositories.createFreeGroup(data, photo, userId);

  return group;
};

