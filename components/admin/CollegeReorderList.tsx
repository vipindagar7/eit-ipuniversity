"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type College = {
  _id: string;
  name: string;
  city: string;
  state: string;
  rating?: number;
  isPublished: boolean;
  isFeatured: boolean;
};

function SortableRow({ college, index }: { college: College; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: college._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-indigo-900/30"
    >
      <button
        className="cursor-grab touch-none text-slate-400 active:cursor-grabbing dark:text-slate-500"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      <span className="w-6 shrink-0 text-sm font-semibold text-slate-400 dark:text-slate-500">#{index + 1}</span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-indigo-900 dark:text-white">{college.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {college.city}, {college.state}
          {!college.isPublished && " · Hidden from public site"}
        </p>
      </div>

      {college.rating ? (
        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Star size={12} className="fill-brass-400 text-brass-400" /> {college.rating.toFixed(1)}
        </span>
      ) : null}

      <Link href={`/admin/colleges/${college._id}`} className="text-slate-400 hover:text-indigo-700 dark:text-slate-500 dark:hover:text-white">
        <Pencil size={16} />
      </Link>
    </div>
  );
}

export function CollegeReorderList({ initialColleges }: { initialColleges: College[] }) {
  const [colleges, setColleges] = useState(initialColleges);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = colleges.findIndex((c) => c._id === active.id);
    const newIndex = colleges.findIndex((c) => c._id === over.id);
    const reordered = arrayMove(colleges, oldIndex, newIndex);
    setColleges(reordered);
    setSaved(false);

    setSaving(true);
    try {
      await fetch("/api/colleges/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((c) => c._id) }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (colleges.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400">No colleges yet. Add your first one.</p>;
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={colleges.map((c) => c._id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {colleges.map((college, index) => (
              <SortableRow key={college._id} college={college} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        {saving ? "Saving order..." : saved ? "Order saved ✓" : "Drag any row to change its rank"}
      </p>
    </div>
  );
}
