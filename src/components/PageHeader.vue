<template>
  <div class="page-header">
    <HeaderV2></HeaderV2>
    <div class="header-content">
      <div class="row">
        <div class="col-12 breadcrumb-container">
          <a-breadcrumb separator="">
            <a-breadcrumb-item
              v-for="(subLink, index) in subLinks"
              v-bind:key="index"
              href="/"
              class="sub-link"
            >
              <span>{{ subLink }}</span>
              <span class="breadcrumb-separator">/</span>
            </a-breadcrumb-item>

            <a-breadcrumb-item class="main-link">
              <span>{{ mainLink }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="col-12 page-title">
          <span>{{ title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderV2 from '@/layout/AppHeaderV2.vue';

defineProps({
  subLinks: Array,
  mainLink: String,
  title: String,
});
</script>
<style lang="scss" scoped>
.page-header {
  height: 480px;
  .header-content {
    display: flex;
    justify-content: center;
  }
}
</style>
