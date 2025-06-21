// src/components/ColumnDroppable.tsx
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  children: React.ReactNode;
};

export default function ColumnDroppable({
  id,
  children,
}: Props) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      status: id,
      type: "column",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-[50px]"
    >
      {children}
    </div>
  );
}
