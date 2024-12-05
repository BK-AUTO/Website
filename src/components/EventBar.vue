<template>
  <div class="container">
    <div class="calendar">
      <span class="main">{{ date.split('/')[0] }}</span>
      <span class="sub">{{ date.split('/').slice(1).join(', ') }}</span>
    </div>
    <div class="description">
      <div class="title">{{ title }}</div>
      <div class="additional-info">
        <div class="time">
          <span class="me-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1C8.76142 1 11 3.23858 11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1ZM6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2ZM5.5 3.5C5.74546 3.5 5.94961 3.67688 5.99194 3.91012L6 4V6H7.5C7.77614 6 8 6.22386 8 6.5C8 6.74546 7.82312 6.94961 7.58988 6.99194L7.5 7H5.5C5.25454 7 5.05039 6.82312 5.00806 6.58988L5 6.5V4C5 3.72386 5.22386 3.5 5.5 3.5Z"
                fill="#3AC569"
              />
            </svg>
          </span>
          {{ time }}
        </div>
        <div class="place">
          <span class="me-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 0.5C8.48528 0.5 10.5 2.51472 10.5 5C10.5 6.86262 9.0802 8.81485 6.3 10.9C6.12222 11.0333 5.87778 11.0333 5.7 10.9C2.9198 8.81485 1.5 6.86262 1.5 5C1.5 2.51472 3.51472 0.5 6 0.5ZM6 1.5C4.067 1.5 2.5 3.067 2.5 5C2.5 6.35543 3.55905 7.91787 5.72366 9.65342L6 9.87127L6.27634 9.65342C8.44095 7.91787 9.5 6.35543 9.5 5C9.5 3.067 7.933 1.5 6 1.5ZM6 4C6.55228 4 7 4.44772 7 5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5C5 4.44772 5.44772 4 6 4Z"
                fill="#3AC569"
              />
            </svg>
          </span>
          {{ place }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  date: String,
  title: String,
  time: String,
  place: String,
});
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
}
.calendar {
  min-width: 72px;
  min-height: 72px;
  border: 1px solid $color-primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-family: $vietnam-font;
    color: $color-primary;
    font-weight: 600;
  }

  .main {
    font-size: 30px;
  }
  .sub {
  }
}
.additional-info {
  display: flex;
  font-size: 12px;
  .time {
    margin-right: 30px;
  }
}
.description {
  margin-left: 20px;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .title {
    text-wrap: wrap;
    font-family: $vietnam-font-2;
    font-size: 18px;
  }
}
</style>
