import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "Wireless Mouse", price: 29.99 },
    { id: 2, name: "Mechanical Keyboard", price: 79.99 },
    { id: 3, name: "HD Monitor", price: 199.99 },
    { id: 4, name: "USB-C Hub", price: 49.99 },
    { id: 5, name: "External Hard Drive", price: 89.99 },
  ]);
});

export default router;
