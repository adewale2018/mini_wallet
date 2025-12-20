import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TransferRequest } from "../types/transfer";
import { useState } from "react";
import useStore from "../store/useStore";

const TransferForm = () => {
  const { accounts, transferMoney } = useStore();
  const [formData, setFormData] = useState<TransferRequest>({
    fromAccountId: "",
    toAccountId: "",
    amount: 0,
    description: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
    setError("");
    setSuccess(false);
  };

  const handleAccountSelect = (type: "from" | "to", accountId: string) => {
    setFormData((prev) => {
      const newData = { ...prev };

      if (type === "from") {
        newData.fromAccountId = accountId;
        // If selecting same as "to", clear "to"
        if (accountId === prev.toAccountId) {
          newData.toAccountId = "";
        }
      } else {
        newData.toAccountId = accountId;
        // If selecting same as "from", clear "from"
        if (accountId === prev.fromAccountId) {
          newData.fromAccountId = "";
        }
      }
      return newData;
    });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.fromAccountId || !formData.toAccountId) {
      setError("Please select both accounts");
      return;
    }

    if (formData.fromAccountId === formData.toAccountId) {
      setError("Cannot transfer to the same account");
      return;
    }

    if (formData.amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
    if (fromAccount && formData.amount > fromAccount.balance) {
      setError(
        `Insufficient funds. Available: $${fromAccount.balance.toFixed(2)}`
      );
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(formData.amount.toString())) {
      setError("Amount can have up to 2 decimal places");
      return;
    }

    setIsSubmitting(true);

    try {
      await transferMoney(formData);
      setSuccess(true);
      // Reset amount and description only
      setFormData((prev) => ({
        ...prev,
        amount: 0,
        description: "",
      }));

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Transfer failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
  const toAccount = accounts.find((a) => a.id === formData.toAccountId);

  // Account Card Component with button element
  const AccountCard = ({
    account,
    selected,
    onSelect,
    disabled,
    type,
  }: {
    account: any;
    selected: boolean;
    onSelect: () => void;
    disabled: boolean;
    type: "from" | "to";
  }) => (
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded-lg mr-3">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Move Money</CardTitle>
            <CardDescription>
              Transfer funds between your accounts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From Account Selection */}
          <div className="space-y-3">
            <Label>From Account</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((account) => (
                <AccountCard
                  key={`from-${account.id}`}
                  account={account}
                  selected={formData.fromAccountId === account.id}
                  onSelect={() => handleAccountSelect("from", account.id)}
                  disabled={account.id === formData.toAccountId || isSubmitting}
                  type="from"
                />
              ))}
            </div>
            {fromAccount && (
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Available balance:</span>
                <span className="font-medium">
                  ${fromAccount.balance.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* To Account Selection */}
          <div className="space-y-3">
            <Label>To Account</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((account) => (
                <AccountCard
                  key={`to-${account.id}`}
                  account={account}
                  selected={formData.toAccountId === account.id}
                  onSelect={() => handleAccountSelect("to", account.id)}
                  disabled={
                    account.id === formData.fromAccountId || isSubmitting
                  }
                  type="to"
                />
              ))}
            </div>
            {toAccount && (
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Current balance:</span>
                <span className="font-medium">
                  ${toAccount.balance.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                max={fromAccount?.balance || 0}
                value={formData.amount || ""}
                onChange={handleInputChange}
                className="pl-8"
                placeholder="0.00"
                disabled={isSubmitting || !formData.fromAccountId}
              />
            </div>
            <div className="text-sm text-gray-600 flex justify-between">
              <span>Transaction limit:</span>
              <span>Up to ${fromAccount?.balance.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add a note for this transfer"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert variant="default" className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Transfer successful! The funds have been moved.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              !formData.fromAccountId ||
              !formData.toAccountId ||
              formData.amount <= 0 ||
              formData.fromAccountId === formData.toAccountId
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transfer...
              </>
            ) : (
              "Transfer Money"
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500">
            <p>Transfers are processed instantly.</p>
            <p className="text-xs mt-1">
              A small delay may occur during peak times.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
