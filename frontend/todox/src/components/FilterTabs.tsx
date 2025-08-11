// frontend/src/components/FilterTabs.tsx
type Filter = "all" | "active" | "completed";

interface FilterTabsProps {
  value: Filter;
  activeCount: number;
  completedCount: number;
  onChange: (next: Filter) => void;
}

const tabs: { key: Filter; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "En cours" },
  { key: "completed", label: "Complétées" },
];

export default function FilterTabs({
  value,
  activeCount,
  completedCount,
  onChange,
}: FilterTabsProps) {
  const badges: Record<Filter, number> = {
    all: activeCount + completedCount,
    active: activeCount,
    completed: completedCount,
  };

  return (
    <div role="tablist" aria-label="Filtrer les tâches" className="flex gap-2 mb-3">
      {tabs.map((t) => {
        const selected = value === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={selected}
            className={`px-3 py-1 rounded border text-sm ${
              selected ? "bg-blue-600 text-white border-blue-600" : "bg-white"
            }`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
            <span className="ml-2 inline-block rounded-full px-2 py-0.5 text-xs border">
              {badges[t.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
