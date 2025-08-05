import { Progress } from "@/components/ui/progress";

interface BudgetProgressProps {
  value: number;
}

export default function BudgetProgress({ value }: BudgetProgressProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between">
        <p className="text-sm font-medium text-muted-foreground">Monthly Budget</p>
        <p className="text-sm font-medium">{value}% Used</p>
      </div>
      <Progress value={value} aria-label={`${value}% of budget used`} />
    </div>
  );
}
