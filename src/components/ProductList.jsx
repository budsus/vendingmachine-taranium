import React, { useState, useEffect } from 'react';
import { vendingMachine, web3 } from '../web3';

const ProductList = ({ account, refreshStock }) => {
    const [products, setProducts] = useState([
        { id: 1, name: "Minuman", price: 0.01, stock: 0 },
        { id: 2, name: "Snack", price: 0.02, stock: 0 }
    ]);

    // Fungsi untuk mengambil data stok dari smart contract
    const fetchStock = async () => {
        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                const stock = await vendingMachine.methods.getStock(product.id).call();
                return { ...product, stock: Number(stock) };
            })
        );
        setProducts(updatedProducts);
    };

    useEffect(() => {
        fetchStock();
    }, [refreshStock]); // Memicu pembaruan setiap kali refreshStock berubah

    // Fungsi untuk membeli produk
    const buyProduct = async (productId, price) => {
        if (!account) {
            alert("Hubungkan wallet terlebih dahulu!");
            return;
        }

        try {
            await vendingMachine.methods.buyProduct(productId, 1).send({
                from: account,
                value: web3.utils.toWei(price.toString(), 'ether')
            });

            // Perbarui stok setelah pembelian
            await fetchStock();
            alert("Pembelian berhasil! Stok telah diperbarui.");
        } catch (error) {
            console.error("Gagal membeli produk:", error);
        }
    };

    return (
        <div>
            <h2>Daftar Produk</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - {product.price} TARAN - Stok: {product.stock}
                        <button onClick={() => buyProduct(product.id, product.price)} disabled={product.stock <= 0}>
                            {product.stock > 0 ? "Beli" : "Habis"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
