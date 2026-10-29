<script setup lang="ts">
import { POSTS, findPost } from '~/data/posts'
import { COMPANY } from '~/data/site'

const route = useRoute()
const post = computed(() => findPost(String(route.params.slug)))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Статья не найдена', fatal: true })
}

const p = post.value!

useSeo({
  title: p.title,

  description: p.description || p.parts.find(x => x.type === 'p')?.text.slice(0, 180) || COMPANY.tagline,
  image: p.cover ?? 'hero-01',
  type: 'article',
})

const config = useRuntimeConfig()
const base = (config.public.siteUrl as string).replace(/\/$/, '')

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.date,
        author: { '@type': 'Organization', name: COMPANY.name },
        publisher: { '@type': 'Organization', name: COMPANY.name },
        mainEntityOfPage: `${base}/blog/${p.slug}/`,
        ...(p.cover ? { image: `${base}/images/${p.cover}.jpg` } : {}),
      }),
    },
  ],
})

const dateFmt = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

const others = computed(() => POSTS.filter(x => x.slug !== p.slug))

const lines = (text: string) => text.split('\n')
</script>

<template>
  <article class="post">
    <div class="post__inner">
      <nav class="post__crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink to="/blog/">Блог</NuxtLink>
      </nav>

      <h1 class="post__title">{{ p.title }}</h1>

      <figure v-if="p.cover" class="post__cover">
        <SmartImage :name="p.cover" :alt="p.title" priority sizes="(min-width: 1201px) 1160px, (min-width: 980px) 940px, 100vw" />
      </figure>

      <div class="post__body">
        <template v-for="(part, i) in p.parts" :key="i">
          <h2 v-if="part.type === 'h2'" class="post__h2">{{ part.text }}</h2>
          <h3 v-else-if="part.type === 'h3'" class="post__h3">{{ part.text }}</h3>
          <h2 v-else-if="part.type === 'hb'" class="post__hb">{{ part.text }}</h2>
          <p v-else class="post__para">
            <template v-for="(ln, j) in lines(part.text)" :key="j">
              <br v-if="j">{{ ln }}
            </template>
          </p>
        </template>
      </div>

      <time class="post__date" :datetime="p.date">{{ dateFmt.format(new Date(p.date)) }}</time>

      <aside v-if="others.length" class="post__more">
        <h2 class="post__more-title">Смотрите также</h2>
        <ul class="post__more-list" role="list">
          <li v-for="o in others" :key="o.slug" class="rel">
            <NuxtLink :to="`/blog/${o.slug}/`" class="rel__link">
              <span v-if="o.cover" class="rel__thumb">
                <SmartImage :name="o.cover" :alt="o.title" cover sizes="100px" />
              </span>
              <span class="rel__text">
                <span class="rel__name">{{ o.title }}</span>
                <span v-if="o.description" class="rel__descr">{{ o.description }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </aside>
    </div>
  </article>
</template>

<style scoped lang="scss">

.post {
  padding-block: clamp(32px, 6vw, 95px) clamp(40px, 6vw, 100px);

  &__inner { @include t-container; }

  &__crumbs {
    display: flex;
    gap: $space-xs;
    margin-bottom: $space-md;
    font-size: $fs-xs;
    color: $c-text-muted;

    a:hover { color: $c-accent-hover; }
  }

  &__title {
    margin: 0;
    font-size: clamp(1.5rem, 1.1rem + 1.6vw, 32px);
    font-weight: $fw-semibold;
    line-height: 1.235;
    color: $c-brown-900;
  }

  &__cover {
    margin: 15px 0 30px;

    :deep(img) { width: 100%; height: auto; }

    @include up(md) {
      aspect-ratio: 16 / 9;
      overflow: hidden;

      :deep(picture) { display: block; width: 100%; height: 100%; }
      :deep(img) { height: 100%; object-fit: cover; }
    }
  }

  &__body { color: $c-black; }

  &__para, &__hb, &__h2, &__h3 { margin: 0 0 12px; color: inherit; }

  &__para { font-size: 18px; line-height: 25.2px; }

  &__hb { font-size: 18px; line-height: 25.2px; font-weight: $fw-bold; }

  &__h2 { font-size: clamp(1.375rem, 1.1rem + 1vw, 28px); line-height: 1.3; font-weight: $fw-bold; }

  &__h3 { margin-top: 32px; font-size: clamp(1.3125rem, 1.05rem + 0.9vw, 26px); line-height: 1.3; font-weight: $fw-bold; }

  &__date {
    display: block;
    margin-top: 45px;
    font-size: 10px;
    font-weight: $fw-semibold;
    color: rgba($c-black, 0.5);
  }

  &__more { margin-top: 100px; }

  &__more-title {
    margin: 0 0 45px;
    font-size: 20px;
    font-weight: $fw-semibold;
    line-height: 1.35;
    color: $c-black;
  }

  &__more-list {
    display: grid;
    gap: 25px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

.rel {
  &__link {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 15px;
    align-items: start;
    @include focus-ring;

    &:hover .rel__name { color: $c-accent-hover; }
  }

  &__thumb {
    display: block;
    height: 75px;
    overflow: hidden;
    background: $c-sand;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__text { display: flex; flex-direction: column; gap: 3px; }

  &__name {
    font-size: 14px;
    font-weight: $fw-semibold;
    line-height: 1.35;
    color: $c-brown-900;
    transition: color $transition;
  }

  &__descr { font-size: 12px; line-height: 1.55; color: rgba($c-black, 0.9); }
}
</style>
