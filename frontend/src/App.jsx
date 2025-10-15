import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, TrendingUp, Package, User, Loader, Heart } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState('user1');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [stats, setStats] = useState({ views: 0, cart: 0, purchases: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchUserStats();
  }, [selectedUser]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Make sure the backend is running.');
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_URL}/interactions/user/${selectedUser}`);
      if (!response.ok) return;
      const data = await response.json();
      
      const stats = {
        views: data.filter(i => i.interaction_type === 'view').length,
        cart: data.filter(i => i.interaction_type === 'cart').length,
        purchases: data.filter(i => i.interaction_type === 'purchase').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const resetInteractions = async () => {
    if (!window.confirm('Are you sure you want to reset all your interactions? This cannot be undone.')) {
      return;
    }

    setResetting(true);
    try {
      const response = await fetch(`${API_URL}/interactions/user/${selectedUser}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to reset interactions');
      
      setStats({ views: 0, cart: 0, purchases: 0 });
      setRecommendations([]);
      
      // Show success message
      alert('✅ All interactions have been reset successfully!');
    } catch (error) {
      console.error('Error resetting interactions:', error);
      alert('Failed to reset interactions. Please try again.');
    }
    setResetting(false);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/recommendations/${selectedUser}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
    }
    setLoading(false);
  };

  const addInteraction = async (productId, type) => {
    try {
      const response = await fetch(`${API_URL}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser,
          product_id: productId,
          interaction_type: type
        })
      });

      if (!response.ok) throw new Error('Failed to add interaction');
      
      // Update stats immediately
      setStats(prev => ({
        ...prev,
        views: type === 'view' ? prev.views + 1 : prev.views,
        cart: type === 'cart' ? prev.cart + 1 : prev.cart,
        purchases: type === 'purchase' ? prev.purchases + 1 : prev.purchases
      }));
      
      // Show success feedback
      const button = document.activeElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Added!';
        button.style.backgroundColor = '#10b981';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding interaction:', error);
      alert('Failed to add interaction. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Smart Recommender
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Shopping Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={resetInteractions}
                disabled={resetting}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    🔄 Reset Stats
                  </>
                )}
              </button>
              <select 
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 border-2 border-purple-200 rounded-lg bg-white hover:border-purple-400 transition-colors cursor-pointer"
              >
                <option value="user1">👤 User 1</option>
                <option value="user2">👤 User 2</option>
                <option value="user3">👤 User 3</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Product Views</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">{stats.views}</p>
                <p className="text-xs text-gray-400 mt-1">Total viewed items</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Cart</p>
                <p className="text-4xl font-bold text-orange-600 mt-1">{stats.cart}</p>
                <p className="text-xs text-gray-400 mt-1">Items added to cart</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Purchases</p>
                <p className="text-4xl font-bold text-green-600 mt-1">{stats.purchases}</p>
                <p className="text-xs text-gray-400 mt-1">Completed orders</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Get Recommendations Section */}
        <div className="mb-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-3">
              Discover Products You'll Love
            </h2>
            <p className="text-purple-100 mb-6">
              Get personalized recommendations powered by AI
            </p>
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <TrendingUp className="w-6 h-6" />
                  Get Recommendations
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommendations Grid */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-800">
                Handpicked For You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                >
                  <div className="relative bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 p-8 h-48 flex items-center justify-center">
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-900" />
                      TOP PICK
                    </div>
                    <div className="text-6xl">
                      {product.category === 'Electronics' ? '💻' : 
                       product.category === 'Audio' ? '🎧' :
                       product.category === 'Accessories' ? '🔌' : 
                       product.category === 'Furniture' ? '🪑' :
                       product.category === 'Smart Home' ? '🏠' :
                       product.category === 'Gaming' ? '🎮' : '📦'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Heart className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-blue-900 mb-1">
                            Why you'll love this:
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {product.explanation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => addInteraction(product.id, 'view')}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        👁️ View
                      </button>
                      <button 
                        onClick={() => addInteraction(product.id, 'cart')}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Browse All Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 h-40 flex items-center justify-center">
                  <span className="text-5xl">
                    {product.category === 'Electronics' ? '💻' : 
                     product.category === 'Audio' ? '🎧' :
                     product.category === 'Accessories' ? '🔌' : 
                     product.category === 'Furniture' ? '🪑' :
                     product.category === 'Smart Home' ? '🏠' :
                     product.category === 'Gaming' ? '🎮' : '📦'}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-base text-gray-800 mt-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold text-green-600 mb-4">
                    ${product.price}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => addInteraction(product.id, 'view')}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => addInteraction(product.id, 'purchase')}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium">
            E-commerce Product Recommender with AI Explanations
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Built with React + Node.js + Supabase + Google Gemini AI
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>✨ AI-Powered</span>
            <span>•</span>
            <span>🚀 Real-time</span>
            <span>•</span>
            <span>💡 Personalized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;