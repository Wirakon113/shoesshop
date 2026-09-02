import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Category, SortOption } from '../types';
import { Search, SlidersHorizontal, X, RotateCcw, ArrowUpDown } from 'lucide-react';

const CATEGORIES: ('All' | Category)[] = ['All', 'Running', 'Lifestyle', 'Basketball', 'Training'];
const SIZES = [38, 39, 40, 41, 42, 43, 44];

export const Shop: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
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

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setSelectedSize(null);
    setSearchParams(new URLSearchParams());
  };

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // Search Filter (Product Name, Category, Description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) {
            return false;
          }
        }

        // Size Filter
        if (selectedSize !== null && !product.sizes.includes(selectedSize)) {
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
  }, [products, selectedCategory, searchQuery, sortBy, selectedSize]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (selectedSize !== null ? 1 : 0);

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
        {/* Controls Bar: Search, Category Tabs, Sort, Mobile Filter Toggle */}
        <div className="space-y-6 mb-8">
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, category, or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-[#E5E5E5] pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Filter Toggle */}
            <div className="flex items-center gap-3 justify-between md:justify-end">
              {/* Filter toggle button on mobile */}
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`lg:hidden flex items-center gap-2 px-4 py-2.5 text-xs uppercase font-bold tracking-wider border transition-colors ${
                  activeFilterCount > 0 ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 hidden sm:inline">
                  Sort:
                </span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort products"
                    className="appearance-none bg-white border border-[#E5E5E5] pl-4 pr-9 py-2.5 text-xs font-bold uppercase tracking-wider text-black focus:outline-none focus:border-black cursor-pointer hover:border-neutral-400 transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-[#F5F5F5] text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sizes Quick Filter (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-neutral-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mr-1">
                Size:
              </span>
              <button
                onClick={() => setSelectedSize(null)}
                className={`px-2 py-1 text-xs font-bold ${
                  selectedSize === null ? 'underline text-black' : 'text-neutral-400 hover:text-black'
                }`}
              >
                All
              </button>
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                  className={`w-7 h-7 text-xs font-bold transition-colors ${
                    selectedSize === sz
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="text-neutral-400 uppercase font-semibold tracking-wider">Active:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategoryChange('All')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Search: "{searchQuery}"
                  <button onClick={() => handleSearchChange('')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSize !== null && (
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 text-black font-semibold">
                  Size: EU {selectedSize}
                  <button onClick={() => setSelectedSize(null)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-black underline font-semibold ml-2"
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
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">
              No products found.
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              We couldn’t find any sneakers matching your criteria. Try adjusting your search keyword or clearing the filters.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClearFilters}
                className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#222222] transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
