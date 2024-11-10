import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit,
  GripVertical,
  MoreHorizontal,
  MoveUp,
  MoveDown,
  Trash2,
  MoveVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

interface SortableCategoryItemProps {
  category: Category;
  index: number;
  openEditDialog: (category: Category) => void;
  handleMoveCategory: (index: number, direction: "up" | "down") => void;
  handleDeleteCategory: (categoryId: string) => void;
}

const SortableCategoryItem: React.FC<SortableCategoryItemProps> = ({
  category,
  index,
  openEditDialog,
  handleMoveCategory,
  handleDeleteCategory,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category._id,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between p-4 rounded-lg bg-background hover:bg-accent/50"
    >
      <div className="flex flex-row justify-center items-center gap-1 mr-4">
        <h3 className="font-medium">{category.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MoveVertical className="h-4 w-4 mr-2" /> Move...
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleMoveCategory(index, "up")}
                    >
                      <MoveUp className="h-4 w-4 mr-2" /> Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleMoveCategory(index, "down")}
                    >
                      <MoveDown className="h-4 w-4 mr-2" /> Move Down
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => handleDeleteCategory(category._id)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </div>
    </li>
  );
};

export default SortableCategoryItem;
