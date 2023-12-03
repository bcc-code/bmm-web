<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));

const { data: browseSections, pending } = useBrowse();
</script>

<template>
  <div>
    <PageHeading class="mb-6">{{ $t("nav.browse") }}</PageHeading>
    <template v-if="pending">
      <ul>
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
        ></li>
      </ul>
    </template>
    <ul v-else>
      <template v-for="section in browseSections" :key="section.id || 0">
        <PageHeading v-if="section.type === 'section_header'" :level="3">
          <div class="flex items-center justify-between">
            <div>
              <a v-if="typeof section.link === 'string'" :href="section.link">
                {{ section.title }}
              </a>
              <span v-else>{{ section.title }}</span>
            </div>
            <a v-if="section.link" :href="section.link">
              <ButtonStyled intent="secondary" size="small">
                <span class="whitespace-nowrap">
                  {{ t("home.list.see-all") }}
                </span>
              </ButtonStyled>
            </a>
          </div>
        </PageHeading>
        <AlbumItem v-else-if="section.type === 'album'" :album="section" />
        <PlaylistItem
          v-else-if="section.type === 'playlist'"
          :playlist="section"
        />
        <PodcastItem
          v-else-if="section.type === 'podcast'"
          :podcast="section"
        />
        <p v-else style="color: red">This is not implemented yet</p>
      </template>
    </ul>
  </div>
</template>
