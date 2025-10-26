export interface Column<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
}
