// src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { apiClient } from '../config/apiClient.js';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    
    // Core states mapping structural ledger keys returned by Express
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Action: Synchronize current state from PostgreSQL rows
    const refreshCart = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await apiClient.get('/cart');
            // Expecting our Express query payload array structure
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error("❌ Failed to pull cart state from database:", error);
        }
    };

    // 2. Action: Fire network post packet to append an item row link
    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            alert("🔒 Access Denied: Please log in or register to manage a shopping cart.");
            return;
        }
        
        setLoading(true);
        try {
            // Hits POST /api/v1/cart/items with your expected body structure
            await apiClient.post('/cart/items', { 
                product_id: productId, 
                quantity: quantity 
            });
            
            // Re-query database immediately to capture fresh totals and updates!
            await refreshCart();
        } catch (error) {
            console.error("❌ Failed to add product to database ledger:", error);
            alert(error.response?.data?.error || "Error appending item.");
        } finally {
            setLoading(false);
        }
    };

    // Automatically sync cart memory cells the split-second a user logs in successfully
    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        } else {
            setCartItems([]); // Purge cache state on logout
        }
    }, [isAuthenticated]);

    // Calculate aggregate item count sum on the fly
    const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate gross financial subtotal cash math safely
    const cartSubtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2);

    // Inside src/context/CartContext.jsx

    // 3. Action: Clear an entire product link out of your PostgreSQL cart canvas
    const removeFromCart = async (productId) => {
        try {
            // Fires network packet down over port 3000 mapping straight to your router rule
            await apiClient.delete(`/cart/items/${productId}`);
            
            // Instantly force a background refresh to recalculate counter totals totals
            await refreshCart();
        } catch (error) {
            console.error("❌ Failed to remove product from database ledger:", error);
            alert("Error removing item from bag canvas.");
        }
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            loading, 
            totalItemCount, 
            cartSubtotal, 
            addToCart, 
            removeFromCart, // ADDED
            refreshCart 
        }}>
            {children}
        </CartContext.Provider>
    );

};
