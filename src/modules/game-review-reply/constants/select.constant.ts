import { SELECT_USER } from 'src/modules/user/constants/select.constant';

export const SELECT_GAME_REVIEW_REPLY = {
  id: true,
  user: {
    select: SELECT_USER,
  },
  content: true,
  createdAt: true,
  updatedAt: true,
};
