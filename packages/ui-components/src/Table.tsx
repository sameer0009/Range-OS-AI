import * as React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  rows: React.ReactNode[][];
  compact?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = '', headers, rows, compact = true, ...props }, ref) => {
    return (
      <div className="w-full overflow-x-auto cyber-border rounded-sm">
        <table
          ref={ref}
          className={`w-full border-collapse font-mono text-left bg-cyber-background/30 ${className}`}
          {...props}
        >
          <thead>
            <tr className="bg-cyber-surface border-b border-cyber-surface-elevated">
              {headers.map((header, idx) => (
                <th key={idx} className="px-3 py-2 text-[10px] uppercase tracking-[.2em] text-gray-500 font-bold border-r last:border-r-0 border-cyber-surface-elevated">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-cyber-surface-elevated/30 hover:bg-cyber-surface-active/50 transition-colors group">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className={`px-3 ${compact ? 'py-1.5' : 'py-3'} text-[12px] text-gray-300 border-r last:border-r-0 border-cyber-surface-elevated/20`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";
