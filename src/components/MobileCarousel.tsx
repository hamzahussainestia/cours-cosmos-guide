import { useEffect, useState, type ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type MobileCarouselProps<T> = {
  items: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Classes de la grille affichée à partir de `md`. */
  gridClassName?: string;
  /** Classes appliquées à chaque élément, dans les deux dispositions. */
  itemClassName?: string;
  /** Étiquette accessible du carrousel. */
  label: string;
};

/**
 * Carrousel tactile sous `md`, grille classique au-delà.
 *
 * Les deux dispositions sont rendues et l'une est masquée en CSS, plutôt
 * que de choisir en JavaScript : un choix au montage provoquerait un saut
 * de mise en page, puisque le serveur ne connaît pas la largeur de l'écran.
 * `display: none` retire aussi la copie masquée de l'arbre d'accessibilité,
 * donc aucun contenu n'est annoncé deux fois.
 *
 * Les points de navigation sont indispensables, pas décoratifs : sans eux,
 * le contenu ne serait atteignable qu'au glissement tactile — inaccessible
 * à qui navigue au clavier ou ne devine pas le geste.
 */
export function MobileCarousel<T>({
  items,
  renderItem,
  gridClassName,
  itemClassName,
  label,
}: MobileCarouselProps<T>) {
  const [api, setApi] = useState<CarouselApi>();
  const [actif, setActif] = useState(0);

  useEffect(() => {
    if (!api) return;
    const maj = () => setActif(api.selectedScrollSnap());
    maj();
    api.on("select", maj);
    return () => {
      api.off("select", maj);
    };
  }, [api]);

  return (
    <>
      <div className="md:hidden">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", containScroll: "trimSnaps" }}
          aria-label={label}
        >
          <CarouselContent className="-ml-3">
            {items.map((item, i) => (
              <CarouselItem key={i} className={cn("basis-[85%] pl-3", itemClassName)}>
                {renderItem(item, i)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-5 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === actif ? "true" : undefined}
              aria-label={`Élément ${i + 1} sur ${items.length}`}
              onClick={() => api?.scrollTo(i)}
              /* La cible fait 44 x 44 px ; le point visible reste petit.
                 On ne sacrifie pas l'accessibilité au style. */
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === actif ? "bg-gold" : "bg-gold/30",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={cn("hidden md:grid", gridClassName)}>
        {items.map((item, i) => (
          <div key={i} className={itemClassName}>
            {renderItem(item, i)}
          </div>
        ))}
      </div>
    </>
  );
}
