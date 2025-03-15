export const tableStyles = {
  wrapper: "relative overflow-hidden rounded-lg border bg-background shadow-sm",
  table: "w-full border-collapse",
  header: `
    bg-gradient-to-r from-muted/80 to-muted/50
    backdrop-blur-sm sticky top-0 z-10
  `,
  headerRow: "border-b border-border/50",
  headerCell: `
    h-14 px-4 text-left align-middle 
    font-semibold text-muted-foreground tracking-tight 
    hover:text-foreground transition-colors
    first:pl-6 last:pr-6
  `,
  body: "relative",
  row: `
    group border-b border-border/50 
    transition-all duration-200
    hover:bg-muted/50 hover:shadow-md
    data-[state=selected]:bg-muted
    cursor-pointer
  `,
  cell: `
    p-4 align-middle [&:has([role=checkbox])]:pr-0
    text-sm transition-colors
    group-hover:text-foreground/90
    first:pl-6 last:pr-6
  `,
  badge: {
    base: `
      inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 
      text-xs font-semibold transition-all
      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    `,
    primary: `
      bg-primary/10 dark:bg-primary/20 
      text-primary dark:text-primary-foreground
      group-hover:bg-primary/20 dark:group-hover:bg-primary/30
    `,
    secondary: `
      bg-muted/50 dark:bg-muted/20 
      text-muted-foreground dark:text-muted-foreground
      group-hover:bg-muted dark:group-hover:bg-muted/30
    `,
    success: `
      bg-green-50 dark:bg-green-900/20 
      text-green-700 dark:text-green-300
      group-hover:bg-green-100 dark:group-hover:bg-green-900/30
    `,
    danger: `
      bg-red-50 dark:bg-red-900/20 
      text-red-700 dark:text-red-300
      group-hover:bg-red-100 dark:group-hover:bg-red-900/30
    `,
    warning: `
      bg-yellow-50 dark:bg-yellow-900/20 
      text-yellow-700 dark:text-yellow-300
      group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30
    `,
  },
  text: {
    primary: "text-foreground font-medium",
    secondary: "text-muted-foreground",
    success: "text-green-600 dark:text-green-400 font-medium tabular-nums",
    danger: "text-red-600 dark:text-red-400 font-medium tabular-nums",
    warning: "text-yellow-600 dark:text-yellow-400 font-medium tabular-nums",
  },
  icon: {
    base: "h-4 w-4",
    container: "p-2 rounded-md bg-muted/50 group-hover:bg-muted transition-colors",
  },
  actions: {
    button: `
      h-8 w-8 p-0 
      opacity-0 group-hover:opacity-100
      transition-all duration-200
      hover:bg-muted
    `,
    menu: "w-40 shadow-lg border-border/50",
    menuItem: `
      cursor-pointer hover:bg-muted
      transition-colors duration-200
      flex items-center
    `,
    menuItemDanger: `
      cursor-pointer 
      hover:bg-red-50 dark:hover:bg-red-950
      text-red-600 dark:text-red-400
      transition-colors duration-200
      flex items-center
    `,
  },
  emptyState: `
    text-center py-8 text-muted-foreground
    bg-muted/5 border-y border-border/50
  `,
  loadingOverlay: `
    absolute inset-0 
    bg-background/60 backdrop-blur-sm
    flex items-center justify-center
    z-20
  `,
  footer: `
    border-t border-border/50
    bg-muted/5 px-6 py-4
    flex items-center justify-between
  `,
  paginationButton: `
    h-8 w-8 p-0 flex items-center justify-center
    transition-colors duration-200
  `,
}

