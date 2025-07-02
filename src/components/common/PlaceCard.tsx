import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Place, ACTIVITY_CATEGORIES } from "@/lib/data";
import { X } from "lucide-react";
import React from 'react';

interface PlaceCardProps {
  place: Place;
  onClick?: (place: Place) => void;
  onRemove?: (id: string) => void;
  isRemovable?: boolean;
  isDragging?: boolean;
  attributes?: any; // For DndContext
  listeners?: any; // For DndContext
  style?: React.CSSProperties; // For DndContext
}

const PlaceCard = React.forwardRef<HTMLDivElement, PlaceCardProps>((
  {
    place,
    onClick,
    onRemove,
    isRemovable = false,
    isDragging = false,
    attributes,
    listeners,
    style,
  },
  ref
) => {
  const handleClick = () => {
    if (onClick) {
      onClick(place);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering onClick when removing
    if (onRemove) {
      onRemove(place.id);
    }
  };

  return (
    <Card
      ref={ref}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300
        ${onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""}
        ${isDragging ? "opacity-50" : ""}
      `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{place.emoji}</span>
        <div>
          <div className="font-semibold text-lg text-gray-900">{place.name}</div>
          <div className="text-sm text-gray-600 line-clamp-1">{place.description}</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {place.activityCategory.main.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className={`${ACTIVITY_CATEGORIES[cat].color} text-xs px-2 py-0.5 rounded-full`}
              >
                {ACTIVITY_CATEGORIES[cat].emoji} {ACTIVITY_CATEGORIES[cat].label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      {isRemovable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-red-500 hover:bg-red-100 p-1 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
});

PlaceCard.displayName = 'PlaceCard';

export default PlaceCard; 