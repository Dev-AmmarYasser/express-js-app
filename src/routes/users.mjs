import { Router } from "express";
import {
  body,
  matchedData,
  query,
  validationResult,
  checkSchema,
} from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";
import { createUserValidationSchema } from "../../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../../utils/middlewares.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Msg must be between 3-10 chars"),
  (request, response, next) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      result.errors.forEach((err) => {
        return response.send(err.msg);
      });
      return;
    }
    console.log(result.errors);
    next();
  },
  (request, response) => {
    const {
      query: { filter, value },
    } = request;

    if (filter && value)
      return response.send(
        mockUsers.filter((user) =>
          user[filter].toString().toLowerCase().includes(value)
        )
      );

    return response.send(mockUsers);
  }
);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(req);

    console.log(data);

    console.log(result);

    const newUser = {
      id: mockUsers[mockUsers.length - 1].id + 1,
      ...data,
    };
    mockUsers.push(newUser);
    console.log(newUser);
    return res.status(201).send(newUser);
  }
);

router.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad request. Invalid Id" });
  }
  const findUser = mockUsers.find((user) => user.id == parsedId);
  if (!findUser) {
    return res.sendStatus(404);
  }
  return res.send(findUser);
});

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex, parsedId } = req;

  mockUsers[findUserIndex] = { id: parsedId, ...body };

  return res.status(200).send(mockUsers);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  const temp = mockUsers[findUserIndex];

  mockUsers[findUserIndex] = { ...temp, ...body };

  return res.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);

  return res.send(mockUsers);
});

export default router;
