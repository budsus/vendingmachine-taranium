import React, { useState, useEffect } from "react";
import { vendingMachine, web3 } from "../web3";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

const ProductList = ({ account, refreshStock }) => {
    const [products, setProducts] = useState([
        { id: 1, name: "🥤 Minuman", price: 0.01, stock: 10 },
        { id: 2, name: "🍫 Snack", price: 0.02, stock: 5 }
    ]);

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
    }, [refreshStock]);

    const buyProduct = async (productId, price) => {
        if (!account) {
            alert("Hubungkan wallet terlebih dahulu!");
            return;
        }

        try {
            await vendingMachine.methods.buyProduct(productId, 1).send({
                from: account,
                value: web3.utils.toWei(price.toString(), "ether"),
            });

            await fetchStock();
            alert("Pembelian berhasil! Stok telah diperbarui.");
        } catch (error) {
            console.error("Gagal membeli produk:", error);
        }
    };

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" textAlign="center" color="#4C4D4F" mt={3} gutterBottom>
                Daftar Produk
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {products.map((product) => (
                    <Grid item xs={12} sm={6} key={product.id}>
                        <Card sx={{ backgroundColor: "#616161", color: "#fff" }}>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography color="yellow">{product.price} TARAN</Typography>
                                <Typography color={product.stock > 0 ? "#02EBD0" : "red"}>
                                    Stok: {product.stock}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => buyProduct(product.id, product.price)}
                                    disabled={product.stock <= 0}
                                >
                                    {product.stock > 0 ? "Beli" : "Habis"}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ProductList;
