import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { tableStyles } from "./styles";

interface TableSkeletonProps {
  columns: number;
  rows: number;
}

export function TableSkeleton({ columns, rows }: TableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className={tableStyles.row}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className={tableStyles.cell}>
              <Skeleton className="h-5 w-full max-w-[200px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
