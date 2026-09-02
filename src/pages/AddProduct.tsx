import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Category, Product } from '../types';
import { SAMPLE_PRESET_IMAGES } from '../data/products';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  X,
  Eye,
} from 'lucide-react';

const CATEGORIES: Category[] = ['Running', 'Lifestyle', 'Basketball', 'Training'];
const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44];

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, resetCatalog, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Add Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Running');
  const [price, setPrice] = useState<number | ''>(2990);
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([38, 39, 40, 41, 42, 43, 44]);
  const [stock, setStock] = useState<number | ''>(20);
  const [image, setImage] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Management State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Handle Image File Upload (Convert to base64 DataURL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setImage(url);
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleToggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const handleSelectAllSizes = () => {
    if (selectedSizes.length === ALL_SIZES.length) {
      setSelectedSizes([]);
    } else {
      setSelectedSizes([...ALL_SIZES]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (price === '' || Number(price) <= 0) {
      newErrors.price = 'Please provide a valid price greater than ฿0';
    }

    if (!description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!image) {
      newErrors.image = 'Product image is required (upload or pick preset)';
    }

    if (selectedSizes.length === 0) {
      newErrors.sizes = 'Select at least one available size';
    }

    if (stock === '' || Number(stock) < 0) {
      newErrors.stock = 'Please enter valid warehouse stock quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fill out all required fields properly', 'error');
      return;
    }

    // Save to LocalStorage & Store Context
    const created = addProduct({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      image,
      sizes: selectedSizes,
      stock: Number(stock),
      isNew: true,
      featured: false,
    });

    // Reset Form
    setName('');
    setPrice(2990);
    setDescription('');
    setImage('');
    setSelectedSizes([38, 39, 40, 41, 42, 43, 44]);
    setStock(20);
    setErrors({});

    // Success & redirect
    showToast(`"${created.name}" created! Redirecting to shop...`, 'success');
    setTimeout(() => {
      navigate('/shop');
    }, 1200);
  };

  const handleCancel = () => {
    navigate('/shop');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock),
      description: editingProduct.description,
      sizes: editingProduct.sizes,
    });

    setEditingProduct(null);
  };

  const executeDelete = () => {
    if (deleteConfirmId !== null) {
      deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 animate-in fade-in duration-300">
      {/* Page Title Banner */}
      <div className="bg-[#F5F5F5] border-b border-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 block mb-2">
            Store Administration
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black font-sans">
            ADD NEW PRODUCT
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            Create new monochrome sneaker listings with instant preview and local persistent storage.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Section 1: Add New Product Form */}
          <div className="lg:col-span-7 bg-white border border-[#E5E5E5] p-6 sm:p-10 shadow-xs">
            <h2 className="text-xl font-black uppercase tracking-tight text-black border-b border-[#E5E5E5] pb-4 mb-8">
              PRODUCT DETAILS FORM
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Image Section */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-black mb-2">
                  Product Image *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  {/* Image Preview Box (~300x300 px) */}
                  <div className="w-full aspect-square max-w-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center relative overflow-hidden group">
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setImage('')}
                            className="bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <ImageIcon className="w-10 h-10 text-neutral-400 mx-auto" />
                        <span className="text-xs font-bold uppercase text-neutral-500 block">
                          300 × 300 Preview
                        </span>
                        <span className="text-[11px] text-neutral-400 block">
                          Upload image or choose preset
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Image Controls & Presets */}
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-black text-white py-3 px-4 text-xs uppercase tracking-wider font-bold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload From Device</span>
                      </button>
                    </div>

                    {/* Presets */}
                    <div>
                      <span className="text-[11px] uppercase font-bold text-neutral-400 block mb-2">
                        Or Pick Sample Preset:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {SAMPLE_PRESET_IMAGES.map((preset, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectPreset(preset.url)}
                            className="aspect-square bg-neutral-100 border border-neutral-300 overflow-hidden hover:border-black transition-all group relative"
                            title={preset.name}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {errors.image && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.image}
                  </p>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-black mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name (e.g. MONO PHANTOM 11)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] px-4 py-3 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Category & Price (Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category Select */}
                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-black mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] px-4 py-3 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price (THB) */}
                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-black mb-1.5">
                    Price (฿ THB) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    placeholder="2990"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value === '' ? '' : Number(e.target.value));
                      if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                    }}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] px-4 py-3 text-sm font-bold focus:outline-none focus:border-black transition-colors"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-black mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the sneakers, material innovations, sole performance, and styling..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] p-4 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                />
                {errors.description && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Available Sizes Checkboxes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase font-extrabold tracking-wider text-black">
                    Available Sizes (EU Checkboxes) *
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllSizes}
                    className="text-xs text-neutral-500 hover:text-black underline font-semibold"
                  >
                    {selectedSizes.length === ALL_SIZES.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((size) => {
                    const isChecked = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`w-11 h-11 text-xs font-bold transition-all border ${
                          isChecked
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-[#F5F5F5] text-neutral-600 border-[#E5E5E5] hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {errors.sizes && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.sizes}
                  </p>
                )}
              </div>

              {/* Warehouse Stock */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-black mb-1.5">
                  Initial Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="20"
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value === '' ? '' : Number(e.target.value));
                    if (errors.stock) setErrors((prev) => ({ ...prev, stock: '' }));
                  }}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] px-4 py-3 text-sm font-bold focus:outline-none focus:border-black transition-colors"
                />
                {errors.stock && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.stock}
                  </p>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-[#E5E5E5]">
                <button
                  type="submit"
                  id="submit-product-btn"
                  className="w-full sm:w-auto bg-black text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-extrabold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ADD PRODUCT</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto bg-white text-black border border-black px-8 py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-100 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Product Management / Catalog Table */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                    Inventory Overview
                  </span>
                  <h2 className="text-lg font-black uppercase text-black">
                    PRODUCT MANAGEMENT ({products.length})
                  </h2>
                </div>

                <button
                  onClick={resetCatalog}
                  title="Reset to 10 sample products"
                  className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 font-semibold underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Sample Data</span>
                </button>
              </div>

              {/* Product Listing */}
              <div className="divide-y divide-[#E5E5E5] max-h-[680px] overflow-y-auto pr-1">
                {products.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-4 group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 bg-[#F5F5F5] border border-[#E5E5E5] object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        {item.category} • {item.stock} in stock
                      </span>
                      <h4 className="text-xs font-bold text-black truncate">{item.name}</h4>
                      <div className="text-xs font-extrabold text-black mt-0.5">
                        ฿{item.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="p-2 text-neutral-400 hover:text-black transition-colors"
                        title="View product"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setEditingProduct(item)}
                        className="p-2 text-neutral-400 hover:text-black transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white max-w-md w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 mx-auto flex items-center justify-center rounded-full">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black uppercase text-black">
              Are you sure you want to delete this product?
            </h3>
            <p className="text-xs text-neutral-500">
              This will remove the sneaker from your store catalog and any active cart sessions.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-neutral-100 text-black py-3 text-xs uppercase font-bold hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="bg-black text-white py-3 text-xs uppercase font-bold hover:bg-neutral-800"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-black uppercase text-black">
                Edit {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full bg-[#F5F5F5] border border-neutral-300 p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase mb-1">Price (฿)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#F5F5F5] border border-neutral-300 p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full bg-[#F5F5F5] border border-neutral-300 p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full bg-[#F5F5F5] border border-neutral-300 p-2.5 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 font-bold uppercase tracking-wider hover:bg-neutral-800"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-neutral-100 text-black py-3 font-bold uppercase tracking-wider hover:bg-neutral-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
