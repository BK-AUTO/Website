<template>
  <div class="row page-content" :wrap="true">
    <div class="content-header">
      <div class="-left">
        <div class="courses-subtitle">
          {{ t('course.subtitle') }}
          <svg width="100" height="2" viewBox="0 0 60 2">
            <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
          </svg>
        </div>
        <div class="courses-title">{{ t('course.title') }}</div>
      </div>
      <div v-if="expandable" class="-right">
        <div class="-more" @click="toggleCourse">
          <span v-if="!showFullCourse">
            {{ t('common.viewAll') }} <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </span>
          <span v-else
            ><font-awesome-icon :icon="['fas', 'arrow-left']" /> {{ t('common.collapse') }}</span
          >
        </div>
      </div>
      <div v-else class="-right">
        <div class="-more" @click="toggleCourse">
          <span>
            {{ t('common.viewAll') }} <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </span>
        </div>
      </div>
    </div>

    <div
      class="profile col-12 col-md-6 col-lg-4"
      v-for="(course, index) in courseList.slice(0, !showFullCourse ? 3 : undefined)"
      :key="index"
    >
      <CourseCard
        :id="course.id"
        :thumbnail="course.thumbnail"
        :title="course.title"
        :category="course.category"
      />
    </div>
  </div>
</template>
<script setup>
import CourseCard from '@/components/CourseCard.vue';
import CourseService from '@/services/CourseService';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  expandable: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const showFullCourse = ref(false);
const toggleCourse = () => {
  if (props.expandable) {
    showFullCourse.value = !showFullCourse.value;
  } else {
    router.push('/course');
  }
};

const courseList = ref([]);

onMounted(() => {
  getCourseList();
});

const getCourseList = async () => {
  try {
    const response = props.expandable
      ? await CourseService.getAllCourse()
      : await CourseService.getTopCourse();
    courseList.value = response;
  } catch (error) {
    console.error('Error getting course:', error);
  }
};
</script>
<style lang="scss" scoped>
.content-header {
  display: flex;
  justify-content: space-between;
  .-right {
    .-more {
      color: $color-primary;
      cursor: pointer;
    }
  }
}

.courses-title {
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 10px;
}
.courses-subtitle {
  color: $color-gray-7;
  font-size: 12px;
  margin-bottom: 20px;
}
</style>
