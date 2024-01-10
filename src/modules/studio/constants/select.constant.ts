import { SELECT_USER } from 'src/modules/user/constants/select.constant';

export const SELECT_STUDIO = {
  id: true,
  name: true,
  manager: {
    select: SELECT_USER,
  },
  createdAt: true,
  updatedAt: true,
};
