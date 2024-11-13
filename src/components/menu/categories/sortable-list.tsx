import React, { useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableCategoryItem from "@/components/menu/categories/sortable-item";
import { Category } from "@/types";
import useMenuStore from "@/lib/store/menuStore";
import { useCategories } from "@/lib/hooks/useCategories";

interface SortableCategoryListProps {
  categories: Category[];
  openEditDialog: (category: Category) => void;
  handleMoveCategory: (index: number, direction: "up" | "down") => void;
  handleDeleteCategory: (categoryId: string) => void;
}

const SortableCategoryList: React.FC<SortableCategoryListProps> = ({
  openEditDialog,
  handleMoveCategory,
  handleDeleteCategory,
}) => {
  const { setCategories, categories } = useMenuStore();
  useEffect(() => {
    console.log(categories);
  }, [categories]);
  const { updateCategoryOrder } = useCategories();

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat._id === active.id);
      const newIndex = categories.findIndex((cat) => cat._id === over.id);

      const reorderedCategories = arrayMove(categories, oldIndex, newIndex);
      reorderedCategories.forEach((cat, index) => (cat.index = index));
      setCategories(reorderedCategories);

      // Prepare the updated order
      const updatedOrder = reorderedCategories.map((cat) => ({
        _id: cat._id,
        index: cat.index,
      }));

      // Call the function to handle the updated order
      updateCategoryOrder(updatedOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categories.map((cat) => cat._id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {categories
            .sort((a, b) => a.index - b.index)
            .map((category, index) => (
              <SortableCategoryItem
                key={category._id}
                category={category}
                index={index}
                openEditDialog={openEditDialog}
                handleMoveCategory={handleMoveCategory}
                handleDeleteCategory={handleDeleteCategory}
              />
            ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default SortableCategoryList;
