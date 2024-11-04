import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import components from 'unplugin-vue-components/vite'
import { ComponentResolver } from 'unplugin-vue-components'

const primeVueComponents = [
  'Accordion',
  'AccordionTab',
  'AutoComplete',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'BlockUI',
  'Breadcrumb',
  'Button',
  'Calendar',
  'Card',
  'Carousel',
  'CascadeSelect',
  'Chart',
  'Checkbox',
  'Chip',
  'Chips',
  'ColorPicker',
  'Column',
  'ColumnGroup',
  // 'ConfirmDialog',
  // 'ConfirmPopup',
  // These must be registered globally in order for the confirm service to work properly
  'ContextMenu',
  'DataTable',
  'DataView',
  'DataViewLayoutOptions',
  'DatePicker',
  'DeferredContent',
  'Dialog',
  'Divider',
  'Dock',
  'Dropdown',
  'Editor',
  'Fieldset',
  'FileUpload',
  'FloatLabel',
  'FullCalendar',
  'Galleria',
  'IconField',
  'IconField',
  'Image',
  'InlineMessage',
  'Inplace',
  'InputGroup',
  'InputGroupAddon',
  'InputIcon',
  'InputMask',
  'InputNumber',
  'InputOtp',
  'InputSwitch',
  'InputText',
  'Knob',
  'Listbox',
  'MegaMenu',
  'Menu',
  'Menubar',
  'Message',
  'MeterGroup',
  'MultiSelect',
  'OrderList',
  'OrganizationChart',
  'OverlayPanel',
  'Paginator',
  'Panel',
  'PanelMenu',
  'Password',
  'PickList',
  'ProgressBar',
  'ProgressSpinner',
  'RadioButton',
  'Rating',
  'Row',
  'ScrollPanel',
  'ScrollTop',
  'SelectButton',
  'Sidebar',
  'Skeleton',
  'Slider',
  'SpeedDial',
  'SplitButton',
  'Splitter',
  'SplitterPanel',
  'Stepper',
  'StepperPanel',
  'Steps',
  'TabMenu',
  'TabPanel',
  'TabView',
  'Tag',
  'Terminal',
  'TerminalService',
  'Textarea',
  'TieredMenu',
  'Timeline',
  'Timelist',
  // 'Toast',
  // Toast must be registered globally in order for the toast service to work properly
  'ToggleButton',
  'Toolbar',
  // 'Tooltip',
  // Tooltip must be registered globally in order for the tooltip service to work properly
  'Tree',
  'TreeSelect',
  'TreeTable',
  'TriStateCheckbox',
  'VirtualScroller',
]

function PrimeVueResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (primeVueComponents.includes(name)) {
        return `primevue/${name.toLowerCase()}`
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    jsx(),
    components({
      dts: 'src/components.d.ts',
      resolvers: [PrimeVueResolver()],
    }),
  ],

  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
})
