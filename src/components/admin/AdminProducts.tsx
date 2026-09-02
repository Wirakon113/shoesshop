import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category, Product } from '../../types';
import { SAMPLE_PRESET_IMAGES } from '../../data/products';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Check,
  X,
  Star,
  Layers,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES: Category[] = ['Running', 'Lifestyle', 'Basketball', 'Training'];
const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44];

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetCatalog, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Modal / Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Add/Edit Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Running' as Category,
    price: 3500,
    stock: 20,
    sku: '',
    description: '',
    image: '',
    sizes: [38, 39, 40, 41, 42, 43, 44],
    featured: false,
    isNew: false,
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = product.stock > 0 && product.stock <= 5;
    if (stockFilter === 'out') matchesStock = product.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Running',
      price: 3500,
      stock: 20,
      sku: '',
      description: '',
      image: SAMPLE_PRESET_IMAGES[0].url,
      sizes: [38, 39, 40, 41, 42, 43, 44],
      featured: false,
      isNew: true,
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku || '',
      description: product.description,
      image: product.image,
      sizes: product.sizes,
      featured: !!product.featured,
      isNew: !!product.isNew,
    });
    setFormErrors({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
        setFormErrors((prev) => ({ ...prev, image: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSize = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b),
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'กรุณากรอกชื่อรุ่นรองเท้า';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'กรุณาระบุราคาที่ถูกต้อง';
    if (formData.stock === undefined || Number(formData.stock) < 0) errors.stock = 'กรุณาระบุจำนวนสต็อก';
    if (!formData.image.trim()) errors.image = 'กรุณาระบุรูปภาพสินค้า';
    if (formData.sizes.length === 0) errors.sizes = 'กรุณาเลือกอย่างน้อย 1 ขนาดไซส์';
    if (!formData.description.trim()) errors.description = 'กรุณากรอกรายละเอียดสินค้า';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addProduct({
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sku: formData.sku.trim() || undefined,
      description: formData.description.trim(),
      image: formData.image,
      additionalImages: [formData.image],
      sizes: formData.sizes,
      featured: formData.featured,
      isNew: formData.isNew,
    });

    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !validateForm()) return;

    updateProduct(editingProduct.id, {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sku: formData.sku.trim() || undefined,
      description: formData.description.trim(),
      image: formData.image,
      sizes: formData.sizes,
      featured: formData.featured,
      isNew: formData.isNew,
    });

    setEditingProduct(null);
  };

  const handleStockQuickChange = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    updateProduct(product.id, { stock: newStock });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 border border-neutral-200">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2">
            <Layers className="w-5 h-5" />
            จัดการรายการสินค้า (Products Management)
          </h2>
          <p className="text-xs text-neutral-500">
            พบสินค้าทั้งหมด {filteredProducts.length} จาก {products.length} รายการ
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตแคตตาล็อกสินค้าเป็น 10 รายการเริ่มต้นหรือไม่?')) {
                resetCatalog();
              }
            }}
            className="flex-1 sm:flex-initial py-2.5 px-3 border border-neutral-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            title="รีเซ็ตเป็นสินค้าเริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            รีเซ็ตข้อมูล
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสินค้าใหม่
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 border border-neutral-200">
        {/* Search Input */}
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อรุ่น, SKU, หมวดหมู่..."
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 text-xs focus:outline-none focus:border-black"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-black text-white border-black'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            ทุกหมวดหมู่
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stock Filter */}
        <div className="flex items-center justify-end gap-1.5 text-xs">
          <span className="text-neutral-400 font-semibold text-[11px] uppercase">สต็อก:</span>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="border border-neutral-200 px-3 py-2 text-xs font-medium focus:outline-none focus:border-black bg-white"
          >
            <option value="all">สถานะสต็อกทั้งหมด</option>
            <option value="low">ใกล้หมด (≤ 5 ชิ้น)</option>
            <option value="out">หมดสต็อก (0 ชิ้น)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3.5 px-4">รูปภาพ</th>
                <th className="py-3.5 px-4">ชื่อรุ่น & SKU</th>
                <th className="py-3.5 px-4">หมวดหมู่</th>
                <th className="py-3.5 px-4">ราคา</th>
                <th className="py-3.5 px-4">คงเหลือ (สต็อก)</th>
                <th className="py-3.5 px-4">ไซส์ที่เปิดขาย</th>
                <th className="py-3.5 px-4">สถานะพิเศษ</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 text-xs">
                    ไม่พบรายการสินค้าที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Image */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name & SKU */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-black text-sm">{product.name}</div>
                      <div className="text-neutral-400 font-mono text-[10px] mt-0.5">
                        SKU: {product.sku || `MS-${product.id}`}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-black border border-neutral-200">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-black">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock with quick buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStockQuickChange(product, -1)}
                          className="w-6 h-6 border border-neutral-300 hover:border-black flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                          title="ลดสต็อก 1"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono font-bold px-2 py-0.5 min-w-[36px] text-center ${
                            product.stock === 0
                              ? 'bg-red-100 text-red-700'
                              : product.stock <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-neutral-100 text-black'
                          }`}
                        >
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleStockQuickChange(product, 1)}
                          className="w-6 h-6 border border-neutral-300 hover:border-black flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                          title="เพิ่มสต็อก 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Sizes */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {product.sizes.map((s) => (
                          <span
                            key={s}
                            className="inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider">
                            <Star className="w-2.5 h-2.5 fill-current" /> Featured
                          </span>
                        )}
                        {product.isNew && (
                          <span className="inline-block px-1.5 py-0.5 bg-neutral-200 text-neutral-800 text-[9px] font-bold uppercase tracking-wider">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/product/${product.id}`}
                          target="_blank"
                          className="p-1.5 text-neutral-400 hover:text-black border border-transparent hover:border-neutral-300 transition-colors"
                          title="ดูหน้าสินค้าจริง"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-neutral-600 hover:text-black border border-transparent hover:border-neutral-300 transition-colors"
                          title="แก้ไขสินค้า"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 border border-transparent hover:border-red-200 transition-colors"
                          title="ลบสินค้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white max-w-3xl w-full border border-neutral-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="border-b border-neutral-200 pb-3 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                Admin Product Portal
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">
                {editingProduct ? `แก้ไขข้อมูลสินค้า: ${editingProduct.name}` : 'เพิ่มสินค้าใหม่ลงในระบบ'}
              </h3>
            </div>

            <form onSubmit={editingProduct ? handleSubmitEdit : handleSubmitAdd} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    ชื่อรุ่นรองเท้า (Product Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น Nike Air Max Plus TN"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-medium"
                  />
                  {formErrors.name && <p className="text-red-500 text-[11px] mt-1">{formErrors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    หมวดหมู่ (Category) *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    รหัสสินค้า (SKU)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="เว้นว่างเพื่อสร้างให้อัตโนมัติ"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    ราคา (THB) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="2990"
                    min="1"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-bold"
                  />
                  {formErrors.price && <p className="text-red-500 text-[11px] mt-1">{formErrors.price}</p>}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    จำนวนสต็อกเริ่มต้น (Stock) *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    placeholder="20"
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono"
                  />
                  {formErrors.stock && <p className="text-red-500 text-[11px] mt-1">{formErrors.stock}</p>}
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  ไซส์รองเท้าที่เปิดจำหน่าย (EU Sizes) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleToggleSize(size)}
                        className={`w-11 h-9 font-mono text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {formErrors.sizes && <p className="text-red-500 text-[11px] mt-1">{formErrors.sizes}</p>}
              </div>

              {/* Image Selection & Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  รูปภาพสินค้า (Product Image) *
                </label>

                {/* Current / Preview Image */}
                <div className="flex flex-col sm:flex-row gap-4 items-start mb-3">
                  {formData.image ? (
                    <div className="w-24 h-24 border border-neutral-300 bg-neutral-100 overflow-hidden relative shrink-0">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center shrink-0 text-neutral-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="วาง URL รูปภาพสินค้า หรืออัปโหลดไฟล์..."
                      className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                    />

                    <div className="flex items-center gap-2">
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
                        className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        อัปโหลดจากเครื่อง (Local File)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Gallery */}
                <div>
                  <span className="text-[11px] text-neutral-500 font-semibold block mb-1.5">
                    หรือเลือกรูปภาพพรีเซ็ตสำเร็จรูป:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`border h-14 overflow-hidden relative group transition-colors ${
                          formData.image === preset.url ? 'border-black ring-2 ring-black' : 'border-neutral-200'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                {formErrors.image && <p className="text-red-500 text-[11px] mt-1">{formErrors.image}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  รายละเอียดสินค้า (Description) *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="รายละเอียดเทคโนโลยี นวัตกรรม และคุณสมบัติของรองเท้า..."
                  className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                />
                {formErrors.description && <p className="text-red-500 text-[11px] mt-1">{formErrors.description}</p>}
              </div>

              {/* Special Badges Checkboxes */}
              <div className="flex items-center gap-6 border-t border-neutral-200 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded-none border-neutral-300 text-black focus:ring-black accent-black"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    ตั้งเป็นสินค้าไฮไลต์ (Featured)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 rounded-none border-neutral-300 text-black focus:ring-black accent-black"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    ป้ายสินค้ามาใหม่ (New Arrival)
                  </span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="py-2.5 px-5 border border-neutral-300 text-neutral-700 hover:border-black text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  {editingProduct ? 'บันทึกการแก้ไข' : 'ยืนยันเพิ่มสินค้า'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-black mb-2">
              ยืนยันการลบสินค้าออกจากระบบ?
            </h3>
            <p className="text-xs text-neutral-600 mb-6">
              การกระทำนี้จะลบสินค้าออกจากแคตตาล็อกและตะกร้าสินค้าของผู้ใช้ทันที
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 px-4 border border-neutral-300 text-neutral-700 hover:border-black text-xs font-bold uppercase tracking-wider transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                ลบสินค้า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
