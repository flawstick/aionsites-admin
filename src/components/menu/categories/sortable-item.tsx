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
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";

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

  const t = useTranslations("categories");
  const { direction } = useDirection();

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
    >
      <div className="flex flex-row justify-center items-center gap-1 ltr:mr-4 rtl:ml-4">
        <h3 className="font-medium">{category.name}</h3>
        <DropdownMenu dir={direction}>
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
            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                <Edit className="h-4 w-4 ltr:mr-2 rtl:ml-2" /> {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger dir={direction}>
                  <MoveVertical className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{" "}
                  {t("move")}...
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleMoveCategory(index, "up")}
                    >
                      <MoveUp className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{" "}
                      {t("moveUp")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleMoveCategory(index, "down")}
                    >
                      <MoveDown className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{" "}
                      {t("moveDown")}
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
              <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" /> {t("delete")}
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
