// src/constants/tableColumns.ts
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import type { Column } from '@/types/dtos/table';

// Text column
export const textColumn = <T,>(header: string, accessor: (item: T) => string, className?: string): Column<T> => ({
  header,
  render: (item: T) => accessor(item),
  className,
});

// Image column
export const imageColumn = <T,>(
  header: string,
  accessor: (item: T) => string | undefined,
  className?: string
): Column<T> => ({
    header,
    render: (item: T) =>
      accessor(item) ? (
        <div className="flex justify-start min-w-[40px]">
          <img src={accessor(item)} alt="img" className="w-8 h-8 rounded-full object-cover border border-gray-600" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-800" />
      ),
    className,
  });

// Button / Action column
export const actionColumn = <T,>(
  header: string,
  callback: (item: T) => void,
  labelOrIcon: ((item: T) => string) | ((item: T) => React.ReactNode),
  className?: string,                    
  getClass?: (item: T) => string     
): Column<T> => ({
    header,
    render: (item: T) => {
      const content = labelOrIcon(item);

      return (
        <button
          onClick={() => callback(item)}
          className={`flex items-center justify-center gap-2 py-1 px-3 rounded-full ${
            getClass ? getClass(item) : ''
          }`}
        >
          {content}
        </button>
      );
    },
    className,
  });

export const getCloudinaryUrlSafe = (url?: string | null): string | undefined => {
  const result = url ? getCloudinaryUrl(url) : undefined;
  return result ?? undefined;
};
