import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Search, Filter, Star, ShoppingBag } from 'lucide-react';

const Sarees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Mock saree data
  const allSarees = [
    {
      id: 1,
      name: 'Royal Silk Saree',
      price: 15999,
      originalPrice: 19999,
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
      category: 'silk',
      fabric: 'Pure Silk',
      occasion: 'wedding',
      rating: 4.8,
      reviews: 156,
      colors: ['red', 'gold', 'maroon']
    },
    {
      id: 2,
      name: 'Cotton Handloom Saree',
      price: 3999,
      originalPrice: 4999,
      image: 'https://images.unsplash.com/photo-1594736797933-d0ca6108ccb3?w=400',
      category: 'cotton',
      fabric: 'Cotton',
      occasion: 'casual',
      rating: 4.6,
      reviews: 89,
      colors: ['blue', 'white', 'green']
    },
    {
      id: 3,
      name: 'Designer Georgette Saree',
      price: 8999,
      originalPrice: 11999,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
      category: 'georgette',
      fabric: 'Georgette',
      occasion: 'party',
      rating: 4.7,
      reviews: 124,
      colors: ['pink', 'gold', 'cream']
    },
    {
      id: 4,
      name: 'Traditional Banarasi Saree',
      price: 25999,
      originalPrice: 29999,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      category: 'banarasi',
      fabric: 'Silk',
      occasion: 'wedding',
      rating: 4.9,
      reviews: 203,
      colors: ['gold', 'red', 'orange']
    },
    {
      id: 5,
      name: 'Contemporary Chiffon Saree',
      price: 5999,
      originalPrice: 7999,
      image: 'https://images.unsplash.com/photo-1588070961754-2a5b2f7c57de?w=400',
      category: 'chiffon',
      fabric: 'Chiffon',
      occasion: 'party',
      rating: 4.5,
      reviews: 67,
      colors: ['purple', 'silver', 'black']
    },
    {
      id: 6,
      name: 'Embroidered Net Saree',
      price: 12999,
      originalPrice: 15999,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      category: 'net',
      fabric: 'Net',
      occasion: 'party',
      rating: 4.6,
      reviews: 94,
      colors: ['black', 'gold', 'silver']
    }
  ];

  const [filteredSarees, setFilteredSarees] = useState(allSarees);

  useEffect(() => {
    // Get search query from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  useEffect(() => {
    let filtered = allSarees;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(saree => 
        saree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        saree.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        saree.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(saree => saree.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(saree => {
        if (max) {
          return saree.price >= min && saree.price <= max;
        } else {
          return saree.price >= min;
        }
      });
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setFilteredSarees(filtered);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
            Saree Collection
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover our exquisite collection of traditional and contemporary sarees
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="silk">Silk Sarees</SelectItem>
                <SelectItem value="cotton">Cotton Sarees</SelectItem>
                <SelectItem value="georgette">Georgette Sarees</SelectItem>
                <SelectItem value="banarasi">Banarasi Sarees</SelectItem>
                <SelectItem value="chiffon">Chiffon Sarees</SelectItem>
                <SelectItem value="net">Net Sarees</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-5000">Under ₹5,000</SelectItem>
                <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                <SelectItem value="20000">Above ₹20,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredSarees.length} of {allSarees.length} sarees
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredSarees.map((saree) => (
            <Card key={saree.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={saree.image}
                  alt={saree.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                {saree.originalPrice > saree.price && (
                  <Badge className="absolute top-2 left-2 bg-destructive">
                    {Math.round((1 - saree.price / saree.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{saree.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{saree.fabric}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{saree.rating}</span>
                  <span className="text-sm text-muted-foreground">({saree.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-lg">₹{saree.price.toLocaleString()}</span>
                  {saree.originalPrice > saree.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{saree.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <Button className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSarees.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No sarees found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Sarees;
