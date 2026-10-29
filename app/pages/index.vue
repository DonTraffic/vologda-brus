<script setup lang="ts">
import { COMPANY } from '~/data/site'

useSeo({

  title: `Клееный брус в Вологде — производство полного цикла | ${COMPANY.name}`,
  description:
    'Производим клееный брус, балку и домокомплекты в Вологде с 2017 года. Своя лесозаготовка, японский клей OSHIKA, геометрия ±0,5 мм, гарантия 7 лет. Расчёт стоимости — бесплатно.',
})
</script>

<template>

  <SectionsHeroSection />
  <SectionsExpertsSection />
  <SectionsAdvantagesSection />
  <SectionsLeadMagnetsSection />
  <SectionsExcursionSection />
  <SectionsStepsSection />
  <SectionsBinderSection />
  <SectionsProductsSection />
  <SectionsQualitySection />
  <SectionsCalcFormSection />
  <SectionsProjectsSection />
  <SectionsProductionStripSection />
  <SectionsConsultFormSection />
  <SectionsBlogTeaser />
</template>
