<template>
  <Layout>
    <ResizableLayout v-if="initialized">
      <Layout
        column
        size="96"
        class="min-w-48 px-3 py-2 shadow-md z-10 text-[12px]"
      >
        <div class="font-semibold p-3 text-base">Uncertainties</div>
        <div v-for="uncertainty in entities.Uncertainty" class="flex flex-col">
          <div
            class="px-3 py-2 flex items-center gap-2 rounded-md hover:bg-neutral-100 hover:shadow-inner hover:shadow-neutral-200/25 transition-colors cursor-pointer"
          >
            <i class="ri-indeterminate-circle-line" />
            <i class="ri-alert-fill text-cyan-500" />
            <div>{{ uncertainty.label }}</div>
          </div>
          <div class="flex flex-col ml-[16px] border-l border-dashed">
            <div
              v-for="cause in Object.values(entities.Cause).filter(
                (cause) => cause.uncertainty === uncertainty,
              )"
              class="flex flex-col ml-0.5"
            >
              <div
                class="px-3 py-2 flex items-center gap-2 rounded-md hover:bg-neutral-100 hover:shadow-inner hover:shadow-neutral-200/25 transition-colors cursor-pointer"
              >
                <i class="ri-indeterminate-circle-line" />
                <i class="ri-git-merge-fill rotate-90 text-cyan-500" />
                <div>{{ cause.event.label }}</div>
              </div>
              <div class="flex flex-col ml-3 ml-[16px] border-l border-dashed">
                <div
                  v-for="control in cause.controls"
                  class="flex flex-col ml-0.5"
                >
                  <div
                    class="px-3 py-2 flex items-center gap-2 rounded-md hover:bg-neutral-100 hover:shadow-inner hover:shadow-neutral-200/25 transition-colors cursor-pointer"
                  >
                    <i class="ri-git-commit-fill" />
                    <div>{{ control.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <Layout>
        <BowtieDiagram :data="state" />
      </Layout>
    </ResizableLayout>
  </Layout>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import {
  uncertaintySchema,
  eventSchema,
  controlSchema,
  causeSchema,
  effectSchema,
} from '@/schemas'
import useDocument from '@/composables/document'

const uncertainties = [
  uncertaintySchema.parse({
    label: 'Lifting operations / Dropped object',
  }),
  // uncertaintySchema.parse({
  //   label: 'Confined space entry / Unsafe atmosphere',
  // }),
]

const events = [
  eventSchema.parse({ label: 'Structural failure of crane' }),
  eventSchema.parse({ label: 'Load too heavy' }),
  eventSchema.parse({ label: 'Incorrect loading / rigging' }),
  eventSchema.parse({ label: 'Strong winds' }),
  eventSchema.parse({ label: 'Snagging of gear / load' }),
  eventSchema.parse({ label: 'Operator overextends load' }),
  eventSchema.parse({ label: 'Personnel hit by object' }),
  eventSchema.parse({ label: 'Object dropped in sea' }),
  eventSchema.parse({ label: 'Object impacts ground' }),
  eventSchema.parse({ label: 'Object impacts live equipment' }),
]

const controls = [
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Check inspection of status of crane',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Pre-lift crane check',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Overload protection',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Check safe working load manifest',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Limited lift stability check',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Monitor and adhere to weather criteria - stop lift if exceeded',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Use lifting plan',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Use a banksman for blind lifts',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Use camera / CCTV monitoring for blind angles',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Check that crane operator is competent for the lift',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Use camera / CCTV monitoring',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'PA warnings',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Restrict access to lifting area',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Use lifting plan',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Use lifting plan',
  }),
  controlSchema.parse({
    effectiveness: _.random(0, 1, true),
    label: 'Isolate vulnerable equipment',
  }),
]

const causes = [
  causeSchema.parse({
    event: events[0],
    uncertainty: uncertainties[0],
    controls: [controls[0], controls[1]],
  }),
  causeSchema.parse({
    event: events[1],
    uncertainty: uncertainties[0],
    controls: [controls[2], controls[3]],
  }),
  causeSchema.parse({
    event: events[2],
    uncertainty: uncertainties[0],
    controls: [controls[4]],
  }),
  causeSchema.parse({
    event: events[3],
    uncertainty: uncertainties[0],
    controls: [controls[5]],
  }),
  causeSchema.parse({
    event: events[4],
    uncertainty: uncertainties[0],
    controls: [controls[6], controls[7], controls[8]],
  }),
  causeSchema.parse({
    event: events[5],
    uncertainty: uncertainties[0],
    controls: [controls[9], controls[10]],
  }),
]

const effects = [
  effectSchema.parse({
    uncertainty: uncertainties[0],
    event: events[6],
    controls: [controls[11], controls[12]],
  }),
  effectSchema.parse({
    uncertainty: uncertainties[0],
    event: events[7],
    controls: [controls[13]],
  }),
  effectSchema.parse({ uncertainty: uncertainties[0], event: events[8] }),
  effectSchema.parse({
    uncertainty: uncertainties[0],
    event: events[9],
    controls: [controls[14], controls[15]],
  }),
]

const { state, entities, initialized } = useDocument(
  {
    uncertainties,
    events,
    controls,
    causes,
    effects,
  },
  { channel: 'main' },
)
</script>
