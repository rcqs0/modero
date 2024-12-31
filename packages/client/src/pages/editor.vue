<template>
  <Layout class="bg-surface-50">
    <RouterView name="nav" />
    <Layout column>
      <Flex class="items-center px-4 py-2">
        <Layout>
          <Breadcrumb
            class="p-0 bg-transparent"
            :home="{ icon: 'ri-function-line', label: 'Clients' }"
            :model="[{ label: 'IBM' }]"
          />
        </Layout>
        <Layout class="justify-end gap-2">
          <!-- <Button
            icon="ri-save-line"
            label="Save Changes"
            severity="contrast"
          /> -->
          <Avatar label="R" class="bg-primary-500 text-white" shape="circle" />
        </Layout>
      </Flex>
      <RouterView />
    </Layout>
  </Layout>
</template>
