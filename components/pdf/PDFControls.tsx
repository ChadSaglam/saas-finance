import React from 'react';
import Button from '@/components/ui/Button';
import { 
  PlusIcon,
  FilterIcon,
  ChevronLeftIcon, 
  ChevronRightIcon,
} from '@/components/ui/Icons';

interface PDFControlsProps {
  currentPage: number;
  totalPages: number;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
}

export const PDFControls: React.FC<PDFControlsProps> = ({
  currentPage,
  totalPages,
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPrevPage,
  onNextPage,
  onPageChange
}) => {
  return (
    <div className="bg-gray-100 px-3 py-2 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <Button
          onClick={onZoomOut}
          variant="outline"
          size="xs"
          title="Zoom out (Ctrl -)"
          className="flex items-center p-1"
        >
          <FilterIcon className="h-4 w-4" />
        </Button>
        
        <div className="text-sm font-medium bg-white px-2 py-1 rounded border border-gray-300">
          {Math.round(scale * 100)}%
        </div>
        
        <Button
          onClick={onZoomIn}
          variant="outline"
          size="xs"
          title="Zoom in (Ctrl +)"
          className="flex items-center p-1"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={onResetZoom}
          variant="outline"
          size="xs"
          className="text-xs hidden sm:block"
          title="Reset zoom (Ctrl 0)"
        >
          Reset
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          variant="outline"
          size="xs"
          title="Previous page (Left arrow)"
          className="p-1"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1 text-sm">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= totalPages) {
                onPageChange(value);
              }
            }}
            className="w-10 text-center border border-gray-300 rounded py-0.5"
          />
          <span>/ {totalPages}</span>
        </div>
        
        <Button
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="xs"
          title="Next page (Right arrow)"
          className="p-1"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};