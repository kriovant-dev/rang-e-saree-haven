import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  fabric: string | null;
  occasion: string | null;
  colors: string[];
  sizes: string[];
  images: string[];
  stock_quantity: number | null;
  rating: number | null;
  reviews_count: number | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  category: string;
  fabric: string;
  occasion: string;
  colors: string;
  sizes: string;
  images: string;
  stock_quantity: string;
  is_new: boolean;
  is_bestseller: boolean;
}

// Type for creating new products - only required fields
interface CreateProductData {
  name: string;
  category: string;
  price: number;
  description?: string | null;
  original_price?: number | null;
  fabric?: string | null;
  occasion?: string | null;
  colors?: string[];
  sizes?: string[];
  images?: string[];
  stock_quantity?: number | null;
  is_new?: boolean | null;
  is_bestseller?: boolean | null;
}

const ProductManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    fabric: '',
    occasion: '',
    colors: '',
    sizes: 'S,M,L,XL',
    images: '',
    stock_quantity: '0',
    is_new: false,
    is_bestseller: false,
  });

  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: CreateProductData) => {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Product created successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create product');
      console.error('Create error:', error);
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Product updated successfully');
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update product');
      console.error('Update error:', error);
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete product');
      console.error('Delete error:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      fabric: '',
      occasion: '',
      colors: '',
      sizes: 'S,M,L,XL',
      images: '',
      stock_quantity: '0',
      is_new: false,
      is_bestseller: false,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: (product.price / 100).toString(),
      original_price: product.original_price ? (product.original_price / 100).toString() : '',
      category: product.category,
      fabric: product.fabric || '',
      occasion: product.occasion || '',
      colors: product.colors.join(','),
      sizes: product.sizes.join(','),
      images: product.images.join(','),
      stock_quantity: product.stock_quantity?.toString() || '0',
      is_new: product.is_new || false,
      is_bestseller: product.is_bestseller || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure required fields are present for create operation
    if (!formData.name.trim() || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields (Name, Category, Price)');
      return;
    }

    const productData: CreateProductData = {
      name: formData.name,
      category: formData.category,
      price: Math.round(parseFloat(formData.price) * 100),
      description: formData.description || null,
      original_price: formData.original_price ? Math.round(parseFloat(formData.original_price) * 100) : null,
      fabric: formData.fabric || null,
      occasion: formData.occasion || null,
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      images: formData.images.split(',').map(i => i.trim()).filter(i => i),
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      is_new: formData.is_new,
      is_bestseller: formData.is_bestseller,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, updates: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Manage your saree collection</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingProduct(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarees">Sarees</SelectItem>
                      <SelectItem value="silk-sarees">Silk Sarees</SelectItem>
                      <SelectItem value="cotton-sarees">Cotton Sarees</SelectItem>
                      <SelectItem value="designer-sarees">Designer Sarees</SelectItem>
                      <SelectItem value="wedding-sarees">Wedding Sarees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price (₹) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Original Price (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fabric</label>
                  <Input
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g., Silk, Cotton, Chiffon"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Occasion</label>
                  <Input
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    placeholder="e.g., Wedding, Party, Casual"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Colors (comma-separated)</label>
                  <Input
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="e.g., red, gold, blue"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sizes (comma-separated)</label>
                  <Input
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="e.g., S, M, L, XL"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Image URLs (comma-separated)</label>
                <Textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_new"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  />
                  <label htmlFor="is_new" className="text-sm font-medium">Mark as New</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_bestseller"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                  />
                  <label htmlFor="is_bestseller" className="text-sm font-medium">Mark as Bestseller</label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.fabric && `${product.fabric} • `}
                            {product.colors.slice(0, 2).join(', ')}
                            {product.colors.length > 2 && ` +${product.colors.length - 2}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(product.price)}</div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.original_price)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock_quantity && product.stock_quantity > 0 ? "default" : "destructive"}>
                        {product.stock_quantity || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.is_new && <Badge className="bg-green-100 text-green-800">New</Badge>}
                        {product.is_bestseller && <Badge className="bg-blue-100 text-blue-800">Bestseller</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManager;
