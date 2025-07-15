import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Royal Banarasi Silk Saree",
      price: 15999,
      originalPrice: 19999,
      rating: 4.8,
      reviews: 127,
      category: "Wedding",
      colors: ["burgundy", "gold", "emerald"],
      isNew: true,
      isBestseller: false,
      image: "banarasi-silk"
    },
    {
      id: 2,
      name: "Designer Georgette Saree",
      price: 8999,
      originalPrice: 11999,
      rating: 4.6,
      reviews: 89,
      category: "Party",
      colors: ["rose", "royal-blue", "saffron"],
      isNew: false,
      isBestseller: true,
      image: "georgette-designer"
    },
    {
      id: 3,
      name: "Traditional Cotton Saree",
      price: 3999,
      originalPrice: 5999,
      rating: 4.7,
      reviews: 203,
      category: "Casual",
      colors: ["emerald", "burgundy", "saffron"],
      isNew: false,
      isBestseller: false,
      image: "cotton-traditional"
    },
    {
      id: 4,
      name: "Kanjivaram Silk Masterpiece",
      price: 22999,
      originalPrice: 27999,
      rating: 4.9,
      reviews: 156,
      category: "Bridal",
      colors: ["gold", "burgundy", "royal-blue"],
      isNew: true,
      isBestseller: true,
      image: "kanjivaram-silk"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getColorClass = (color: string) => {
    const colorMap = {
      burgundy: 'bg-saree-burgundy',
      gold: 'bg-saree-gold',
      emerald: 'bg-saree-emerald',
      'royal-blue': 'bg-saree-royal-blue',
      saffron: 'bg-saree-saffron',
      rose: 'bg-saree-rose'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-400';
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">
              Featured
            </span>
            <span className="text-foreground"> Collection</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked sarees that embody the perfect blend of traditional craftsmanship and contemporary elegance
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card 
              key={product.id} 
              className="group hover-lift transition-smooth border-border overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* Placeholder Image */}
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                    <div className="text-center text-primary-foreground">
                      <div className="mb-2 text-4xl">👗</div>
                      <div className="text-sm font-medium">{product.image}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <Badge className="bg-saree-saffron text-primary-foreground">
                        New
                      </Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-saree-burgundy text-primary-foreground">
                        Bestseller
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                    <Button size="icon" variant="secondary" className="h-8 w-8 hover-glow">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8 hover-glow">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button className="w-full gradient-primary text-primary-foreground hover:scale-105 transition-smooth">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-saree-gold text-saree-gold" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-1 mb-3">
                    {product.colors.map((color) => (
                      <div
                        key={color}
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${getColorClass(color)}`}
                      />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="mt-1">
                    <span className="text-xs text-saree-saffron font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-up">
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;