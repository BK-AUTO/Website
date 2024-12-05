<template>
  <div class="highlight-stats page-content">
    <div class="row">
      <div :class="columnClass">
        <img src="/src/assets/img/logo/honda.png" alt="honda" width="200px" height="auto" />
      </div>
      <div :class="columnClass">
        <img src="/src/assets/img/logo/vinfast.png" alt="vinfast" width="auto" height="120px" />
      </div>
      <div :class="columnClass">
        <img src="/src/assets/img/logo/huyndai.png" alt="huyndai" width="160px" height="auto" />
      </div>
      <div :class="columnClass">
        <img src="/src/assets/img/logo/toyota.png" alt="toyota" width="auto" height="100px" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.highlight-stats {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg2.jpeg');
  background-position: center;
  background-size: cover;
  .stat {
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>

<script>
export default {
  setup() {
    const columnClass = 'stat col-6 col-md-3';
    return { columnClass };
  },
};
</script>
