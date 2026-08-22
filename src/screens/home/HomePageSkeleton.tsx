import {
  HomeAboutSectionSkeleton,
  HomeBenefitsSectionSkeleton,
  HomeCatalogsSectionSkeleton,
  HomeHeroSkeleton,
  HomeProductsSectionSkeleton,
  HomeTechnicalCatalogsSectionSkeleton,
  HomeWorksSectionSkeleton,
} from "@/screens/home/components/HomeSectionSkeletons";

/** Fallback estructural de Home: reproduce las secciones reales y minimiza cambios de layout. */
export function HomePageSkeleton() {
  return (
    <div className="overflow-x-clip">
      <HomeHeroSkeleton />
      <HomeCatalogsSectionSkeleton />
      <HomeTechnicalCatalogsSectionSkeleton />
      <HomeProductsSectionSkeleton variante="promocion" muted />
      <HomeProductsSectionSkeleton variante="destacado" />
      <HomeBenefitsSectionSkeleton />
      <HomeWorksSectionSkeleton />
      <HomeAboutSectionSkeleton />
    </div>
  );
}
