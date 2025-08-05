
"use client";

import { useState, useTransition, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { suggestPlacesAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const categories = [
  "Coffee Shop",
  "Groceries",
  "Restaurant",
  "Medical",
  "Bookstore",
  "Pharmacy",
  "Recharge",
  "Transport",
  "Online Shopping",
  "Electricity Bill",
  "Stationery",
  "Gym",
  "Tuition",
  "Canteen",
  "Hostel Fees",
  "Streaming Subscription",
  "Fast Food",
  "Salon",
  "Gift Shop",
  "Food",
  "Rent",
  "Entertainment",
  "Utilities",
  "Health",
  "Shopping",
  "Daily",
  "Income",
  "Default",
];

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: {
    place: string;
    amount: number;
    date: string;
    category: string;
  }) => void;
}

export default function AddTransactionDialog({
  isOpen,
  onClose,
  onAddTransaction,
}: AddTransactionDialogProps) {
  const [place, setPlace] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlace = e.target.value;
    setPlace(newPlace);

    if (newPlace.length > 2) {
      startTransition(async () => {
        const result = await suggestPlacesAction({ query: newPlace, count: 3 });
        if (result.success && result.places) {
          setSuggestions(result.places);
        }
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = () => {
    if (!place || !amount || !date || !category) {
        toast({
            variant: "destructive",
            title: "Missing Fields",
            description: "Please fill out all fields to add a transaction.",
        });
        return;
    }
    onAddTransaction({
      place,
      amount: parseFloat(amount),
      date,
      category,
    });
    // Reset form and close
    setPlace("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    setSuggestions([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setSuggestions([]);
      } else {
        // Reset form state when dialog opens
        setPlace("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setCategory("");
        setSuggestions([]);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Manually enter a new expense or income record.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="place" className="text-right">
              Place
            </Label>
            <div className="col-span-3">
              <Input
                id="place"
                value={place}
                onChange={handlePlaceChange}
                className="w-full"
                placeholder="e.g., Coffee shop"
                autoComplete="off"
              />
               {isPending && <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin" />}
               {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-card border rounded-md mt-1 shadow-lg">
                  {suggestions.map((s, i) => (
                    <div 
                      key={i} 
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                      onClick={() => {
                        setPlace(s);
                        setSuggestions([]);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
               )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 150"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.sort().map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
