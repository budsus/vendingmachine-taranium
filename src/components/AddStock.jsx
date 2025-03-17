import React, { useState, useEffect } from "react";
import { vendingMachine } from "../web3";
import { TextField, Button, Typography } from "@mui/material";

const AddStock = ({ account, onStockUpdated }) => {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const checkOwner = async () => {
            if (account) {
                const ownerAddress = await vendingMachine.methods.getOwner().call();
                setIsOwner(ownerAddress.toLowerCase() === account.toLowerCase());
            }
        };

        checkOwner();
    }, [account]);

    const addStock = async () => {
        if (!isOwner) {
            alert("Hanya pemilik kontrak yang bisa menambahkan stok.");
            return;
        }

        try {
            await vendingMachine.methods.addStock(productId, quantity).send({ from: account });

            alert(`Stok berhasil ditambahkan! Produk ID: ${productId}, Jumlah: ${quantity}`);
            setProductId('');
            setQuantity('');
            onStockUpdated();
        } catch (error) {
            console.error("Gagal menambah stok:", error);
            alert("Gagal menambah stok. Pastikan Anda adalah pemilik kontrak.");
        }
    };

    return isOwner && (
        <div>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Tambah Stok Produk</Typography>
            <TextField label="ID Produk" type="number" fullWidth value={productId} onChange={(e) => setProductId(e.target.value)} margin="normal" />
            <TextField label="Jumlah Stok" type="number" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} margin="normal" />
            <Button variant="contained" color="warning" onClick={addStock} sx={{ mt: 2 }}>
                Tambah Stok
            </Button>
        </div>
    );
};

export default AddStock;
