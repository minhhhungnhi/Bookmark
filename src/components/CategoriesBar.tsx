import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoriesBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative sticky top-14 z-30 flex items-center py-3 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-xs border-b border-neutral-200/50 dark:border-[#272727]/50 select-none">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <div className="absolute left-0 z-10 flex items-center pl-1 bg-gradient-to-r from-white dark:from-[#0f0f0f] via-white/80 dark:via-[#0f0f0f]/80 to-transparent pr-4 h-full">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-[#272727] text-neutral-800 dark:text-neutral-200 shadow-md bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-white/10 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Chips Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex items-center gap-2.5 overflow-x-auto scrollbar-none px-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                  : 'bg-neutral-100 dark:bg-[#272727] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#383838]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <div className="absolute right-0 z-10 flex items-center pr-1 bg-gradient-to-l from-white dark:from-[#0f0f0f] via-white/80 dark:via-[#0f0f0f]/80 to-transparent pl-4 h-full">
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-[#272727] text-neutral-800 dark:text-neutral-200 shadow-md bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-white/10 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
