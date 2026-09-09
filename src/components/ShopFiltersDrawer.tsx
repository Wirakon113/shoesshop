import React, { useEffect } from 'react';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Search,
  Sparkles,
  Tag,
  Package,
  ArrowUpDown,
} from 'lucide-react';
import { Category, SortOption } from '../types';

interface ShopFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Search & Targeted SKU
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Category
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  // Sizes (multi-select)
  selectedSizes: number[];
  onToggleSize: (size: number) => void;
  onClearSizes: () => void;
  // Price
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  // Attributes
  isNewOnly: boolean;
  onToggleNewOnly: () => void;
  isFeaturedOnly: boolean;
  onToggleFeaturedOnly: () => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  // Sorting
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  // Summary
  totalMatches: number;
  activeFilterCount: number;
  onResetAll: () => void;
}

const CATEGORIES: ('All' | Category)[] = ['All', 'Running', 'Lifestyle', 'Basketball', 'Training'];
const AVAILABLE_SIZES = [38, 39, 40, 41, 42, 43, 44];

const POPULAR_KEYWORDS = [
  'Running',
  'Streetwear',
  'Cushion',
  'High-Top',
  'Lightweight',
  'Court',
  'Gym',
  'Mesh',
];

const PRICE_PRESETS = [
  { label: 'ทุกช่วงราคา', min: null, max: null },
  { label: 'ต่ำกว่า ฿2,500', min: null, max: 2500 },
  { label: '฿2,500 - ฿3,200', min: 2500, max: 3200 },
  { label: 'มากกว่า ฿3,200', min: 3200, max: null },
];

export const ShopFiltersDrawer: React.FC<ShopFiltersDrawerProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  selectedSizes,
  onToggleSize,
  onClearSizes,
  minPrice,
  maxPrice,
  onPriceChange,
  isNewOnly,
  onToggleNewOnly,
  isFeaturedOnly,
  onToggleFeaturedOnly,
  inStockOnly,
  onToggleInStockOnly,
  sortBy,
  onSortChange,
  totalMatches,
  activeFilterCount,
  onResetAll,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isCurrentPricePreset = (presetMin: number | null, presetMax: number | null) => {
    return minPrice === presetMin && maxPrice === presetMax;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="filters-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 id="filters-drawer-title" className="text-sm font-black uppercase tracking-wider text-black font-display">
                  ตัวกรองเฉพาะสินค้า
                </h2>
                <p className="text-[11px] text-neutral-500 font-medium">
                  {activeFilterCount > 0
                    ? `ใช้งานอยู่ ${activeFilterCount} ตัวกรอง • พบ ${totalMatches} รายการ`
                    : 'ค้นหาและเลือกดูรองเท้าตามสเปกที่ต้องการ'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onResetAll}
                  className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:underline px-2 py-1 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>ล้างค่า</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Filter Options */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7 divide-y divide-neutral-100 text-left">
            {/* 1. Specific Search & Keyword Tagging */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-black flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-neutral-500" />
                  <span>ค้นหาเฉพาะชื่อสินค้า / SKU / คุณสมบัติ</span>
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="text-[10px] text-neutral-400 hover:text-black font-bold uppercase"
                  >
                    ล้าง
                  </button>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="เช่น MONO RUNNER, MS-RUN, Cushion..."
                  className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-xs text-black font-medium placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Keyword Quick Tags */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  คำค้นหายอดนิยม:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_KEYWORDS.map((kw) => {
                    const isSelected = searchQuery.toLowerCase().includes(kw.toLowerCase());
                    return (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => onSearchChange(isSelected ? '' : kw)}
                        className={`text-[11px] px-2.5 py-1 transition-colors border ${
                          isSelected
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
                        }`}
                      >
                        #{kw}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Categories */}
            <div className="pt-6 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-black flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-neutral-500" />
                  <span>หมวดหมู่สินค้า</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-bold">
                  {selectedCategory === 'All' ? 'ทุกหมวดหมู่' : selectedCategory}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = categoryCounts[cat] ?? 0;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onSelectCategory(cat)}
                      className={`flex items-center justify-between p-2.5 border text-xs transition-all ${
                        isSelected
                          ? 'bg-black text-white border-black font-bold shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-xs ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-200'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Specific Shoe Sizes (Multi-Select) */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  ไซส์รองเท้า (EU Sizes)
                </label>
                {selectedSizes.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearSizes}
                    className="text-[10px] text-neutral-400 hover:text-black font-bold uppercase"
                  >
                    ล้าง ({selectedSizes.length})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {AVAILABLE_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onToggleSize(sz)}
                      className={`h-10 text-xs font-bold transition-all border flex items-center justify-center ${
                        isSelected
                          ? 'bg-black text-white border-black ring-1 ring-black'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-neutral-400">
                * เลือกได้หลายไซส์พร้อมกัน ระบบจะแสดงรุ่นที่มีไซส์อย่างน้อยหนึ่งไซส์ที่คุณเลือก
              </p>
            </div>

            {/* 4. Price Range & Presets */}
            <div className="pt-6 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                ช่วงราคา (บาท)
              </label>

              {/* Presets */}
              <div className="grid grid-cols-2 gap-2">
                {PRICE_PRESETS.map((preset, idx) => {
                  const active = isCurrentPricePreset(preset.min, preset.max);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onPriceChange(preset.min, preset.max)}
                      className={`text-xs py-2 px-2.5 border transition-all text-center ${
                        active
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Min/Max Inputs */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  ระบุราคาเอง:
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                      ฿
                    </span>
                    <input
                      type="number"
                      placeholder="ต่ำสุด"
                      value={minPrice ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : Math.max(0, Number(e.target.value));
                        onPriceChange(val, maxPrice);
                      }}
                      className="w-full bg-neutral-50 border border-neutral-200 pl-7 pr-2.5 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
                    />
                  </div>
                  <span className="text-neutral-400 text-xs">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                      ฿
                    </span>
                    <input
                      type="number"
                      placeholder="สูงสุด"
                      value={maxPrice ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : Math.max(0, Number(e.target.value));
                        onPriceChange(minPrice, val);
                      }}
                      className="w-full bg-neutral-50 border border-neutral-200 pl-7 pr-2.5 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Specific Product Badges & Stock Status */}
            <div className="pt-6 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
                <span>สถานะและสเปกเฉพาะสินค้า</span>
              </label>

              <div className="space-y-2">
                {/* In Stock Only */}
                <button
                  type="button"
                  onClick={onToggleInStockOnly}
                  className={`w-full flex items-center justify-between p-3 border text-xs transition-colors ${
                    inStockOnly
                      ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-emerald-500" />
                    <span>เฉพาะสินค้าที่มีในสต็อกพร้อมส่ง</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                      inStockOnly ? 'bg-white text-black border-white' : 'border-neutral-400'
                    }`}
                  >
                    {inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* New Arrivals Only */}
                <button
                  type="button"
                  onClick={onToggleNewOnly}
                  className={`w-full flex items-center justify-between p-3 border text-xs transition-colors ${
                    isNewOnly
                      ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black px-1.5 py-0.5">
                      NEW
                    </span>
                    <span>เฉพาะสินค้ามาใหม่ล่าสุด (New Arrivals)</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                      isNewOnly ? 'bg-white text-black border-white' : 'border-neutral-400'
                    }`}
                  >
                    {isNewOnly && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Featured Only */}
                <button
                  type="button"
                  onClick={onToggleFeaturedOnly}
                  className={`w-full flex items-center justify-between p-3 border text-xs transition-colors ${
                    isFeaturedOnly
                      ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 border border-neutral-700">
                      HOT
                    </span>
                    <span>เฉพาะสินค้ายอดนิยม / แนะนำ (Featured)</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                      isFeaturedOnly ? 'bg-white text-black border-white' : 'border-neutral-400'
                    }`}
                  >
                    {isFeaturedOnly && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* 6. Sorting */}
            <div className="pt-6 space-y-3 pb-2">
              <label className="block text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <span>จัดเรียงลำดับสินค้า</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'featured', label: 'แนะนำ (Featured)' },
                  { value: 'price-asc', label: 'ราคา: ต่ำไปสูง' },
                  { value: 'price-desc', label: 'ราคา: สูงไปต่ำ' },
                  { value: 'newest', label: 'สินค้าใหม่ล่าสุด' },
                ].map((s) => {
                  const isSelected = sortBy === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => onSortChange(s.value as SortOption)}
                      className={`text-xs p-2.5 border transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black'
                      }`}
                    >
                      <span>{s.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 border-t border-neutral-200 bg-white flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onResetAll}
              disabled={activeFilterCount === 0}
              className="flex-1 border border-neutral-300 py-3 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              ล้างค่าทั้งหมด
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-2 bg-black text-white py-3 text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>แสดงสินค้า ({totalMatches})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
