import express from 'express';
import { promises as fs } from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async readProducts() {
        try {
            const fileContents = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(fileContents);
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    async addProduct(product) {
        await this.readProducts();

        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        const missingFields = requiredFields.filter(field => !(field in product));

        if (missingFields.length > 0) {
            console.log(`Campos requeridos faltantes en el producto: ${missingFields.join(', ')}`);
            return;
        }

        const isCodeRepeated = this.products.some(existingProduct => existingProduct.code === product.code);
        if (isCodeRepeated) {
            console.log("Ya existe un producto con este código");
            return;
        }

        const newProduct = {
            ...product,
            id: Product.idGenerate(),
        };
        this.products.push(newProduct);
        await this.saveProducts();
    }

    async getProducts() {
        await this.readProducts();
        return this.products;
    }

    async getProductById(id) {
        await this.readProducts();
        return this.products.find(product => product.id === id);
    }
    async getProductByCode(code) {
        await this.readProducts();
        return this.products.find(product => product.code === code);
    }

    async updateProduct(id, updatedFields) {
        await this.readProducts();
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields,
            };
            await this.saveProducts();
        }
    }

    async deleteProduct(id) {
        await this.readProducts();
        this.products = this.products.filter(product => product.id !== id);
        await this.saveProducts();
    }
}

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

    static idGenerate() {
        if (!this.idIncrement) {
            this.idIncrement = 1;
        } else {
            this.idIncrement++;
        }
        return this.idIncrement;
    }
}

const app = express();
const port = 8080;

const productManager = new ProductManager('./productos.json');

const prod1 = new Product("Leche", "Leche descremada", 250, "imagen1.jpg", "ASDF12", 115);
const prod2 = new Product("Cafe", "Café tostado", 1500, "imagen2.jpg", "BVCD15", 120);
const prod3 = new Product("Té", "Té de hierbas", 160, "imagen3.jpg", "BVSB16", 100);
const prod4 = new Product("Dulce de leche", "Sancor", 300, "imagen4.jpg", "PRD4", 50);
const prod5 = new Product("Dulce de frutilla", "Arcor", 220, "imagen5.jpg", "PRD5", 70);
const prod6 = new Product("Doritos", "Snack", 1200, "imagen6.jpg", "PRD6", 70);
const prod7 = new Product("Cheetos", "Snack 2", 500, "imagen7.jpg", "PRD7", 70);
const prod8 = new Product("Agua", "Villa del Sur", 500, "imagen8.jpg", "PRD8", 70);
const prod9 = new Product("Manteca", "Sin Sal", 500, "imagen9.jpg", "PRD9", 70);
const prod10 = new Product("Agua Saborizada", "Sabor manzana", 500, "imagen10.jpg", "PRD10", 70);


(async () => {
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
   

   
    const products = await productManager.getProducts();
    console.log(products);

    const foundProductByCode = await productManager.getProductByCode("BVCD15");
    console.log(foundProductByCode);

    const foundProductById = await productManager.getProductById(2);
    console.log(foundProductById);

    await productManager.updateProduct(2, { price: 1600 });
    const updatedProduct = await productManager.getProductById(2);
    console.log(updatedProduct);

    await productManager.deleteProduct(1);
    const remainingProducts = await productManager.getProducts();
    console.log(remainingProducts);
})();

app.get('/products', async (req, res) => {
    try {
        await productManager.readProducts();
        let products = productManager.products;

        const limit = parseInt(req.query.limit);
        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }

        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        await productManager.readProducts();
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
