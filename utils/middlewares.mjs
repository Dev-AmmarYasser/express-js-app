import { mockUsers } from "./constants.mjs";

export function resolveIndexByUserId(req, res, next) {
  const {
    body,
    params: { id },
  } = req;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id == parsedId);

  if (findUserIndex == -1) return res.sendStatus(404);

  req.findUserIndex = findUserIndex;

  req.parsedId = parsedId;

  next();
}
