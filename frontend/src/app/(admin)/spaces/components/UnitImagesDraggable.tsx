"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { SortableItem } from "../../../shared/components/SortableItem";
import UnitImage from "../../../shared/components/UnitImage";

interface IImagesDraggable {
  sources: { id: string; src: string }[];
  activeImage?: string | null;
  onHandleActiveImage: (id: string) => void;
  onSetSources: (movedArray: any[]) => void;
}

export default function UnitImagesDraggable({
  sources,
  activeImage,
  onHandleActiveImage,
  onSetSources,
}: IImagesDraggable) {
  const [items, setItems] = useState<IImagesDraggable["sources"]>([]);

  const parentContainerRef = useRef<null | HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(sources.length);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const movedArray = arrayMove(items, oldIndex, newIndex);

        onSetSources(movedArray);
        return movedArray;
      });
    }
  }

  function handeActiveImage(id: string) {
    onHandleActiveImage(id);
  }

  const handleScrollParentCont = () => {
    if (!parentContainerRef.current) return;

    const container = parentContainerRef.current;

    container.scrollTo({
      left: container.scrollWidth - container.clientWidth,
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setItems(sources);
  }, [sources]);

  useEffect(() => {
    if (!items.length) return;

    const prevLength = prevLengthRef.current;
    const currLength = items.length;

    if (currLength > prevLength && prevLength !== 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          handleScrollParentCont();
        });
      });
    }

    prevLengthRef.current = currLength;
  }, [items.length]);

  return (
    <div className="w-full overflow-x-auto" ref={parentContainerRef}>
      <div
        ref={containerRef}
        className="w-max flex gap-x-3 overflow-x-hidden py-[0.75rem]"
      >
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
          sensors={sensors}
          autoScroll={{
            canScroll: (element) => element !== containerRef.current,
          }}
        >
          <SortableContext
            strategy={horizontalListSortingStrategy}
            items={items.map((item) => ({ item, id: item.id }))}
          >
            {items.map((item) => {
              const isActive = item.id === activeImage;

              return (
                <SortableItem key={item.id} id={item.id}>
                  <button
                    type="button"
                    onClick={() => handeActiveImage(item.id)}
                    className={
                      isActive
                        ? "outline-3 outline-primary-normal rounded-lg"
                        : undefined
                    }
                  >
                    <UnitImage src={item.src} style="w-[7rem] h-[4rem]" />
                  </button>
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
