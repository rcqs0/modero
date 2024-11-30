<template>
  <RouterView />
</template>

<style lang="postcss">
:root {
  font-family: Inter, sans-serif;
  font-feature-settings: 'liga' 1, 'calt' 1; /* fix for Chrome */

  font-size: 14px;
  line-height: normal;
}
@supports (font-variation-settings: normal) {
  :root {
    font-family: InterVariable, sans-serif;
  }
}

#app {
  height: 100vh;
  width: 100vw;
  /* position: relative; */
  /* display: flex; */
  /* flex-direction: column; */
  overflow: auto;
}
</style>
