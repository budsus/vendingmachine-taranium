import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import ProductList from './components/ProductList';
import AddStock from './components/AddStock';

const App = () => {
    const [account, setAccount] = useState(null);
    const [refreshStock, setRefreshStock] = useState(false);

    const handleStockUpdate = () => {
        setRefreshStock(prev => !prev); // Mengubah state untuk memicu useEffect di ProductList
    };

    return (
       <>
        <div>
            <h1>Vending Machine</h1>
            <WalletConnect setAccount={setAccount} />
            <ProductList account={account} refreshStock={refreshStock} />
            <AddStock account={account} onStockUpdated={handleStockUpdate} />
        </div>
       </>
    );
};

export default App;
