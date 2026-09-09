import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ShopFiltersDrawer } from '../components/ShopFiltersDrawer';
import { Category, SortOption } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ArrowUpDown,
  Sparkles,
  Flame,
  Package,
} from 'lucide-react';

const CATEGORIES: ('All' | Category)[] = ['All', 'Running', 'Lifestyle', 'Basketball', 'Training'];
const SIZES = [38, 39, 40, 41, 42, 43, 44];

export const Shop: React.FC = () => {
  const { products, setIsQuizOpen } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [isNewOnly, setIsNewOnly] = useState<boolean>(false);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam !== null) setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      newParams.delete('search');
    } else {
      newParams.set('search', val.trim());
    }
    setSearchParams(newParams);
  };

  const handleToggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleClearSizes = () => {
    setSelectedSizes([]);
  };

  const handlePriceChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setSelectedSizes([]);
    setMinPrice(null);
    setMaxPrice(null);
    setIsNewOnly(false);
    setIsFeaturedOnly(false);
    setInStockOnly(false);
    setSearchParams(new URLSearchParams());
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: products.length,
      Running: 0,
      Lifestyle: 0,
      Basketball: 0,
      Training: 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [products]);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // Search Filter (Product Name, Category, Description, SKU)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchSku = product.sku ? product.sku.toLowerCase().includes(q) : false;
          if (!matchName && !matchCat && !matchDesc && !matchSku) {
            return false;
          }
        }

        // Sizes Filter (product must have at least one selected size)
        if (selectedSizes.length > 0) {
          const hasSize = selectedSizes.some((sz) => product.sizes.includes(sz));
          if (!hasSize) return false;
        }

        // Price Range Filter
        if (minPrice !== null && product.price < minPrice) {
          return false;
        }
        if (maxPrice !== null && product.price > maxPrice) {
          return false;
        }

        // Specific Product Attributes
        if (isNewOnly && !product.isNew) {
          return false;
        }
        if (isFeaturedOnly && !product.featured) {
          return false;
        }
        if (inStockOnly && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id;
        // Default: featured first, then id
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.id - b.id;
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    sortBy,
    selectedSizes,
    minPrice,
    maxPrice,
    isNewOnly,
    isFeaturedOnly,
    inStockOnly,
  ]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (selectedSizes.length > 0 ? 1 : 0) +
    (minPrice !== null || maxPrice !== null ? 1 : 0) +
    (isNewOnly ? 1 : 0) +
    (isFeaturedOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-[#F5F5F5] border-b border-[#E5E5E5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 block mb-2">
              The Complete Collection
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black font-display">
              ALL SNEAKERS
            </h1>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-neutral-500 mt-2 font-medium">
              Explore our complete lineup of high-performance and streetwear sneakers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search, Category Tabs, Sort, Filter Drawer Toggle */}
        <div className="space-y-6 mb-8">
          {/* Top Row: Search Input + Filters Toggle + Sort Dropdown */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, SKU (e.g. MS-RUN), or keyword..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-[#E5E5E5] pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Controls: Filters Button + Quiz + Sort */}
            <div className="flex items-center gap-3 justify-between md:justify-end flex-wrap sm:flex-nowrap">
              {/* PRIMARY FILTER BUTTON (Desktop & Mobile) */}
              <button
                type="button"
                id="shop-open-filters-btn"
                onClick={() => setIsFilterPanelOpen(true)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase font-bold tracking-wider border transition-all cursor-pointer shadow-xs ${
                  activeFilterCount > 0
                    ? 'bg-black text-white border-black ring-2 ring-black/20'
                    : 'bg-white text-black border-neutral-300 hover:border-black hover:bg-neutral-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters (ตัวกรองสินค้า)</span>
                {activeFilterCount > 0 && (
                  <span className="bg-white text-black text-[10px] font-black px-1.5 py-0.5 rounded-xs leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Shoe Finder Quiz Shortcut */}
              <button
                type="button"
                id="shop-shoe-finder-toolbar-btn"
                onClick={() => setIsQuizOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-xs cursor-pointer border border-neutral-800"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Shoe Finder Quiz</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 hidden lg:inline">
                  Sort:
                </span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort products"
                    className="appearance-none bg-white border border-[#E5E5E5] pl-3 pr-8 py-2.5 text-xs font-bold uppercase tracking-wider text-black focus:outline-none focus:border-black cursor-pointer hover:border-neutral-400 transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs & Quick Size Bar */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 overflow-x-auto no-scrollbar gap-4">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-[#F5F5F5] text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                  <span className="ml-1.5 opacity-60 text-[10px]">
                    ({categoryCounts[cat] ?? 0})
                  </span>
                </button>
              ))}
            </div>

            {/* Sizes Quick Filter (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-neutral-200 shrink-0">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mr-1">
                Size:
              </span>
              <button
                onClick={handleClearSizes}
                className={`px-2 py-1 text-xs font-bold cursor-pointer ${
                  selectedSizes.length === 0
                    ? 'underline text-black'
                    : 'text-neutral-400 hover:text-black'
                }`}
              >
                All
              </button>
              {SIZES.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => handleToggleSize(sz)}
                    className={`w-7 h-7 text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filter Presets Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] uppercase font-bold text-neutral-400 shrink-0 tracking-wider">
              Quick Filters:
            </span>

            {/* Featured toggle */}
            <button
              type="button"
              onClick={() => setIsFeaturedOnly(!isFeaturedOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isFeaturedOnly
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>สินค้าแนะนำ (Featured)</span>
            </button>

            {/* New Arrivals toggle */}
            <button
              type="button"
              onClick={() => setIsNewOnly(!isNewOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isNewOnly
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>สินค้ามาใหม่ (New)</span>
            </button>

            {/* In Stock toggle */}
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                inStockOnly
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-emerald-500" />
              <span>พร้อมส่ง (In Stock)</span>
            </button>

            {/* Under 3K toggle */}
            <button
              type="button"
              onClick={() => {
                if (maxPrice === 3000) {
                  setMaxPrice(null);
                } else {
                  setMinPrice(null);
                  setMaxPrice(3000);
                }
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 border text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                maxPrice === 3000
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              <span>ต่ำกว่า ฿3,000</span>
            </button>

            {/* Open full drawer shortcut */}
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>ตัวกรองเพิ่มเติม +</span>
            </button>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex items-center flex-wrap gap-2 text-xs pt-1">
              <span className="text-neutral-400 uppercase font-semibold tracking-wider">Active:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategoryChange('All')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Search: "{searchQuery}"
                  <button onClick={() => handleSearchChange('')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSizes.length > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Sizes: {selectedSizes.join(', ')}
                  <button onClick={handleClearSizes} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(minPrice !== null || maxPrice !== null) && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Price: {minPrice ? `฿${minPrice.toLocaleString()}` : '0'} - {maxPrice ? `฿${maxPrice.toLocaleString()}` : 'Max'}
                  <button onClick={() => handlePriceChange(null, null)} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {isNewOnly && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  New Arrivals
                  <button onClick={() => setIsNewOnly(false)} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {isFeaturedOnly && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Featured
                  <button onClick={() => setIsFeaturedOnly(false)} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-black underline font-semibold ml-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset all
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium pt-1">
            <span>
              Showing <strong className="text-black">{filteredProducts.length}</strong> of{' '}
              {products.length} sneakers
            </span>
          </div>
        </div>

        {/* Product Grid: 4 cols on Desktop, 2 cols on Tablet, 1 col on Mobile */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State: “No products found.” */
          <div className="py-24 text-center border border-dashed border-neutral-300 bg-[#F5F5F5] p-12 space-y-4">
            <div className="w-16 h-16 bg-neutral-200 text-neutral-500 mx-auto flex items-center justify-center rounded-full">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black font-display">
              No products found.
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              We couldn’t find any sneakers matching your criteria. Try adjusting your search keyword or clearing the filters.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#222222] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(true)}
                className="bg-white text-black border border-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-neutral-100 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>ปรับตัวกรอง (Adjust Filters)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQuizOpen(true)}
                className="bg-white text-neutral-700 border border-neutral-300 px-6 py-3 text-xs uppercase tracking-widest font-bold hover:border-black transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>ทำแบบสอบถามค้นหารองเท้า</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Filters Drawer */}
      <ShopFiltersDrawer
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        categoryCounts={categoryCounts}
        selectedSizes={selectedSizes}
        onToggleSize={handleToggleSize}
        onClearSizes={handleClearSizes}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
        isNewOnly={isNewOnly}
        onToggleNewOnly={() => setIsNewOnly(!isNewOnly)}
        isFeaturedOnly={isFeaturedOnly}
        onToggleFeaturedOnly={() => setIsFeaturedOnly(!isFeaturedOnly)}
        inStockOnly={inStockOnly}
        onToggleInStockOnly={() => setInStockOnly(!inStockOnly)}
        sortBy={sortBy}
        onSortChange={(sort) => setSortBy(sort)}
        totalMatches={filteredProducts.length}
        activeFilterCount={activeFilterCount}
        onResetAll={handleClearFilters}
      />
    </div>
  );
};

