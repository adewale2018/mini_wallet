import { Badge } from "@/components/ui/badge";

interface AccountCardProps {
  account: any;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
  type: "from" | "to";
}

const AccountCard = ({
  account,
  selected,
  onSelect,
  disabled,
  type,
}: AccountCardProps) => (
  <button
    type="button"
    onClick={onSelect}
    disabled={disabled}
    className={`w-full text-left p-0 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      selected
        ? type === "from"
          ? "border-blue-500 bg-blue-50 focus:ring-blue-500"
          : "border-green-500 bg-green-50 focus:ring-green-500"
        : "border-gray-200 bg-white"
    } ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer hover:border-gray-300"
    }`}
  >
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: account.color }}
          />
          <div>
            <div className="font-medium text-gray-900">{account.name}</div>
            <Badge variant="outline" className="mt-1">
              {account.type}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            ${account.balance.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            {type === "from" ? "Available" : "Current"}
          </div>
        </div>
      </div>
    </div>
  </button>
);

export default AccountCard;
