import React, { useState, useEffect } from 'react';
import { vendingMachine, web3 } from '../web3';

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

            // Panggil fungsi untuk memperbarui stok di ProductList
            onStockUpdated();
        } catch (error) {
            console.error("Gagal menambah stok:", error);
            alert("Gagal menambah stok. Pastikan Anda adalah pemilik kontrak.");
        }
    };

    return (
        <div>
            {isOwner ? (
                <>
                    <h2>Tambah Stok Produk</h2>
                    <input 
                        type="number" 
                        placeholder="ID Produk" 
                        value={productId} 
                        onChange={(e) => setProductId(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        placeholder="Jumlah Stok" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                    />
                    <button onClick={addStock}>Tambah Stok</button>
                </>
            ) : (
                <p>Hanya pemilik kontrak yang bisa menambah stok.</p>
            )}
        </div>
    );
};

export default AddStock;
