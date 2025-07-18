import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Heart, ShoppingCart, Trash2, Phone, User, ArrowLeft, Home } from 'lucide-react';
import PhoneAuth from '../components/PhoneAuth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromWishlist, clearWishlist, getTotalItems } = useWishlist();
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);

  const handleAddToCart = (item: any) => {
    const cartItem = {
      productId: item.productId,
      name: item.name,
      price: item.price,
      color: item.colors[0] || '',
      size: item.sizes[0] || '',
      quantity: 1,
      image: item.image
    };
    addToCart(cartItem);
    toast.success(`${item.name} added to cart!`);
  };

  const handleAuthSuccess = (authUser: any) => {
    toast.success(`Welcome ${authUser.phoneNumber}! You can now manage your wishlist.`);
    setShowPhoneAuth(false);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saree-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gradient-to-r from-saree-primary to-saree-accent text-white rounded-lg p-8 mb-8">
              <Heart className="mx-auto h-16 w-16 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Your Wishlist</h1>
              <p className="opacity-90">Save your favorite sarees for later</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  Sign In to View Wishlist
                </CardTitle>
                <CardDescription>
                  Please verify your phone number to access your saved items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>🤍 Save items you love</p>
                  <p>📱 Access from any device</p>
                  <p>🛒 Quick add to cart</p>
                  <p>🔄 Sync across sessions</p>
                </div>
                
                <Button 
                  onClick={() => setShowPhoneAuth(true)} 
                  className="w-full bg-saree-accent hover:bg-saree-accent/90"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Sign In with Phone Number
                </Button>
                
                <div className="text-center">
                  <Link to="/sarees" className="text-sm text-saree-primary hover:underline">
                    Continue browsing sarees →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <PhoneAuth
          isOpen={showPhoneAuth}
          onClose={() => setShowPhoneAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-saree-primary mb-2">Your Wishlist</h1>
          <p className="text-gray-600 mb-6">You haven't added any items to your wishlist yet.</p>
          <Link to="/sarees">
            <Button className="bg-saree-accent hover:bg-saree-accent/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Navigation Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <button
            onClick={() => navigate('/')}
            className="hover:text-saree-primary transition-colors"
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <span className="text-saree-primary font-medium">Wishlist</span>
        </nav>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-saree-primary mb-2">My Wishlist</h1>
          <p className="text-gray-600">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} saved</p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                  onClick={() => removeFromWishlist(item.productId)}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Link to={`/product/${item.productId}`}>
                <CardTitle className="text-lg mb-2 hover:text-saree-accent transition-colors line-clamp-2">
                  {item.name}
                </CardTitle>
              </Link>
              <CardDescription className="mb-3">
                <Badge variant="secondary" className="mb-2">
                  {item.category}
                </Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-saree-primary">
                    ₹{item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-gray-600">Colors:</span>
                  {item.colors.slice(0, 3).map((color, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {color}
                    </Badge>
                  ))}
                  {item.colors.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.colors.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-saree-accent hover:bg-saree-accent/90"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(item.productId)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                Added on {new Date(item.addedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
