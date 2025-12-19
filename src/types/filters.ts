export interface Filters {
  category: string;
  dateRange: { start: Date | null; end: Date | null };
  searchTerm: string;
  accountId: string | 'all';
}
