import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animate = true,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "bg-muted",
        animate && "skeleton-shimmer",
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      {...props}
    />
  );
}

// Pre-built skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="p-4 space-y-3 border rounded-lg">
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="40%" />
    </div>
  );
}

export function SkeletonMetric() {
  return (
    <div className="p-4 text-center space-y-2">
      <Skeleton height={32} width={80} className="mx-auto" />
      <Skeleton height={14} width={60} className="mx-auto" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between">
        <Skeleton height={16} width={100} />
        <div className="flex gap-2">
          <Skeleton height={24} width={40} />
          <Skeleton height={24} width={40} />
          <Skeleton height={24} width={40} />
        </div>
      </div>
      <Skeleton height={180} className="w-full" />
    </div>
  );
}

export function SkeletonLeadCard() {
  return (
    <div className="p-3 border rounded-lg space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton height={16} width="70%" />
          <Skeleton height={12} width="50%" />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <div className="flex gap-1">
        <Skeleton height={20} width={60} />
        <Skeleton height={20} width={80} />
      </div>
    </div>
  );
}

export function SkeletonMessage() {
  return (
    <div className="flex gap-3">
      <Skeleton variant="circular" width={32} height={32} />
      <div className="space-y-2 flex-1">
        <Skeleton height={14} width="30%" />
        <Skeleton height={40} width="80%" />
      </div>
    </div>
  );
}
