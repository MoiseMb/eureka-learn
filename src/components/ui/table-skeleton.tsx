export function TableSkeleton({ columns = 4, rows = 5 }) {
  return (
    <div className="w-full animate-pulse">
      <div className="border-b">
        <div className="flex">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="h-12 flex-1 p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex border-b">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 p-4">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-[85%]"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
