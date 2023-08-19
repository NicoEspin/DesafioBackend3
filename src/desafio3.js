import express from "express";
import { ProductManager, Product } from "./productManager.js";

const app = express();
const port = 8080;

const productManager = new ProductManager("./productos.json");

async function startServer() {
  const prod1 = new Product(
    "Leche",
    "Leche descremada",
    250,
    "imagen1.jpg",
    "ASDF12",
    115
  );
  const prod2 = new Product(
    "Cafe",
    "Café tostado",
    1500,
    "imagen2.jpg",
    "BVCD15",
    120
  );
  const prod3 = new Product(
    "Té",
    "Té de hierbas",
    160,
    "imagen3.jpg",
    "BVSB16",
    100
  );
  const prod4 = new Product(
    "Dulce de leche",
    "Sancor",
    300,
    "imagen4.jpg",
    "PRD4",
    50
  );
  const prod5 = new Product(
    "Dulce de frutilla",
    "Arcor",
    220,
    "imagen5.jpg",
    "PRD5",
    70
  );
  const prod6 = new Product(
    "Doritos",
    "Snack",
    1200,
    "imagen6.jpg",
    "PRD6",
    70
  );
  const prod7 = new Product(
    "Cheetos",
    "Snack 2",
    500,
    "imagen7.jpg",
    "PRD7",
    70
  );
  const prod8 = new Product(
    "Agua",
    "Villa del Sur",
    500,
    "imagen8.jpg",
    "PRD8",
    70
  );
  const prod9 = new Product(
    "Manteca",
    "Sin Sal",
    500,
    "imagen9.jpg",
    "PRD9",
    70
  );
  const prod10 = new Product(
    "Agua Saborizada",
    "Sabor manzana",
    500,
    "imagen10.jpg",
    "PRD10",
    70
  );

 
    await productManager.addProduct(prod1);
    await productManager.addProduct(prod2);
    await productManager.addProduct(prod3);
    await productManager.addProduct(prod4);
    await productManager.addProduct(prod5);
    await productManager.addProduct(prod6);
    await productManager.addProduct(prod7);
    await productManager.addProduct(prod8);
    await productManager.addProduct(prod9);
    await productManager.addProduct(prod10);
  

  app.get("/products", async (req, res) => {
    try {
      await productManager.readProducts();
      let products = productManager.products;

      const limit = parseInt(req.query.limit);
      if (!isNaN(limit)) {
        products = products.slice(0, limit);
      }

      res.json({ products });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  });

  app.get("/products/:pid", async (req, res) => {
    try {
      await productManager.readProducts();
      const productId = parseInt(req.params.pid);
      const product = await productManager.getProductById(productId);

      if (product) {
        res.json({ product });
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  });

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}
startServer();
