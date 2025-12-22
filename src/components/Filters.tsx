import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (category: string) => void;
  dateStart: string;
  setDateStart: (date: string) => void;
  dateEnd: string;
  setDateEnd: (date: string) => void;
  categories: string[];
  clearFilters: () => void;
}

const Filters = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  categories,
  clearFilters,
}: FiltersProps) => {
  return (
    <section className="p-6 border-b bg-gray-50">
      <h2 className="text-lg font-semibold mb-4 text-orange-700">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Merchant
          </label>
          <Input
            type="text"
            placeholder="e.g. Amazon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="capitalize w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {categories.map((c) => (
              <option className="uppercase" key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <Input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={clearFilters}
          className="cursor-pointer text-sm text-white hover:text-gray-300 underline"
        >
          Clear all filters
        </Button>
      </div>
    </section>
  );
};

export default Filters;
