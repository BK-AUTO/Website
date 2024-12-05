<template>
  <div class="row page-content" :wrap="true">
    <div class="content-header">
      <div class="-left">
        <div class="projects-subtitle">
          {{ t('project.subtitle') }}
          <svg width="100" height="2" viewBox="0 0 60 2">
            <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
          </svg>
        </div>
        <div class="projects-title">{{ t('project.title') }}</div>
      </div>
    </div>
    <div
      class="profile col-12 col-md-6 col-lg-4"
      v-for="(project, index) in projectList.slice(0, showFullProjects ? projectList.length : 6)"
      :key="index"
    >
      <ProjectCard
        :id="project.id"
        :thumbnail="project.thumbnail"
        :title="project.title"
        :variant="index % 2"
      />
    </div>
    <div class="content-header">
      <div class="-left"></div>
      <div v-if="expandable" class="-right">
        <div class="-more" @click="toggleProjects">
          <span v-if="!showFullProjects">
            {{ t('common.viewAll') }} <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </span>
          <span v-else
            ><font-awesome-icon :icon="['fas', 'arrow-left']" /> {{ t('common.collapse') }}</span
          >
        </div>
      </div>
      <div v-else class="-right">
        <div class="-more" @click="toggleProjects">
          <span>
            {{ t('common.viewAll') }} <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ProjectCard from '@/components/ProjectCard.vue';
import ProjectService from '@/services/ProjectService';
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

const showFullProjects = ref(false);
const toggleProjects = () => {
  if (props.expandable) {
    showFullProjects.value = !showFullProjects.value;
  } else {
    router.push('/research');
  }
};

const projectList = ref([]);

onMounted(() => {
  getProjectList();
});

const getProjectList = async () => {
  try {
    const response = props.expandable
      ? await ProjectService.getAllProject()
      : await ProjectService.getTopProject();
    projectList.value = response;
  } catch (error) {
    console.error('Error getting project:', error);
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
      font-weight: 500;
      cursor: pointer;
    }
  }
}

.projects-title {
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 10px;
}
.projects-subtitle {
  color: $color-gray-7;
  font-size: 12px;
  margin-bottom: 16px;
}
</style>
