import { cn } from "@/lib/utils";
import Image from "next/image";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  image,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  image?: string;
}) => {
  return (
    <div
      className={cn(
        "group/bento relative row-span-1 overflow-hidden rounded-xl transition duration-300 hover:shadow-xl",
        className,
      )}
    >
      {/* Background Image */}
      {image && (
        <Image
          src={image}
          alt={typeof title === "string" ? title : "Service"}
          fill
          className="object-cover transition-transform duration-500 group-hover/bento:scale-105"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="transition duration-300 group-hover/bento:translate-y-[-4px]">
          <h3 className="mb-1 font-serif text-xl font-bold text-white">
            {title}
          </h3>
          <p className="text-sm text-white/80">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
