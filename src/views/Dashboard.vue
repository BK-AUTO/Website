<template>
  <div>
    <Loading :is-loading="isLoading" />
    <div class="page-header minimal-page-header">
      <!-- HeaderV2 is removed to only show logo and countdown -->
      <div class="header-content centered-content">
        <img src="@/assets/img/bkauto-logo.svg" alt="BKAuto Logo" class="bk-logo" />
        <div class="countdown-timer">
          <h2>{{ t('prompt.releaseCountdown') }}</h2>
          <div v-if="timeRemaining.total > 0" class="timer">
            <span>{{ timeRemaining.days }}d </span>
            <span>{{ timeRemaining.hours }}h </span>
            <span>{{ timeRemaining.minutes }}m </span>
            <span>{{ timeRemaining.seconds }}s</span>
          </div>
          <div v-else>
            <p>{{ t('prompt.releasePrompt') }}</p>
          </div>
        </div>
        <!-- Existing row content is removed -->
      </div>
    </div>
    <!-- All other page content is removed -->
    <!--
    <div>
      <Introduction class="pb-0" />
      <OurProjects />
      <Events />
      <HighlightStats class="py-0" />
      <CurrentCourses />
      <Sponsors class="py-0" />
      <ManagerProfiles :title="t('manager.subtitle')" class="pb-0" />
      <CurrentNews class="pb-0" />
      <Milestones />
    </div>
    -->
  </div>
</template>

<script setup>
// import HeaderV2 from '@/layout/AppHeaderV2.vue'; // No longer needed
import Loading from '@/components/Loading.vue';
// Other component imports are removed as they are no longer used in the template
// import Events from './components/Events.vue';
// import OurProjects from './components/OurProjects.vue';
// import ManagerProfiles from './components/ManagerProfiles.vue';
// import CurrentNews from './components/CurrentNews.vue';
// import HighlightStats from '@/views/components/HighlightStats.vue';
// import Sponsors from '@/views/components/Sponsors.vue';
// import CurrentCourses from './components/CurrentCourses.vue';
// import Milestones from './components/Milestones.vue';
// import Introduction from './components/Introduction.vue';
import { useTitle } from '@/composables/common.js';
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
// import { ArrowRightOutlined } from '@ant-design/icons-vue'; // No longer needed
// import router from '@/router'; // No longer needed

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false); // Keep loading state if needed for the page itself

// const redirectToAboutPage = () => { // No longer needed
// router.push('/about-us');
// };

// Countdown Timer Logic
const releaseDate = new Date('2025-06-01T10:00:00+07:00').getTime();
const timeRemaining = ref({
  total: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

let timerInterval = null;

const updateTimer = () => {
  const now = new Date().getTime();
  const distance = releaseDate - now;

  if (distance <= 0) {
    timeRemaining.value.total = 0;
    timeRemaining.value.days = 0;
    timeRemaining.value.hours = 0;
    timeRemaining.value.minutes = 0;
    timeRemaining.value.seconds = 0;
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    return;
  }

  timeRemaining.value.total = distance;
  timeRemaining.value.days = Math.floor(distance / (1000 * 60 * 60 * 24));
  timeRemaining.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  timeRemaining.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  timeRemaining.value.seconds = Math.floor((distance % (1000 * 60)) / 1000);
};

onMounted(() => {
  updateTimer(); // Initial call to set the timer
  timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style lang="scss" scoped>
.minimal-page-header { // New class for the modified header
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; // Make it full screen
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url('@/assets/img/background/bg-default.webp');
  background-size: cover;
  background-position: center;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.bk-logo {
  width: 150px; // Adjust size as needed
  margin-bottom: 30px; // Space between logo and timer
}

.countdown-timer {
  text-align: center;
  color: white;
  // padding-top: 20px; /* Adjust as needed */ Remove or adjust if .centered-content handles padding
  h2 {
    font-size: 2.5em; // Slightly larger
    margin-bottom: 20px;
    font-weight: bold;
  }
  .timer span {
    font-size: 2em; // Slightly larger
    margin: 0 10px;
    font-weight: 500;
  }
  p {
    font-size: 1.5em; // Slightly larger
    margin-top: 20px;
  }
}

// Comment out or remove original .page-header styles if they conflict, or adjust .minimal-page-header
/*
.page-header {
  height: 720px;
  background: #000000a3;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-default.webp');
  background-size: cover;

  .subtitle1 {
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
  }
  .title {
    font-family: $vietnam-font-2;
    font-size: 44px;
    margin-bottom: 14px;
  }
  .subtitle2 {
    line-height: 20px;
    margin-bottom: 32px;
  }
}
*/
</style>
