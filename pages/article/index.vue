<template>
	<div class="article-page">

		<div class="banner">
			<div class="container">
				<h1>{{ article.title }}</h1>
				<article-meta :article="article" />
			</div>
		</div>

		<div class="container page">
			<!-- 文章内容 -->
			<div class="row article-content">
				<div class="col-md-12" v-html="article.body"></div>
			</div>
			<hr />

			<div class="article-actions">
				<article-meta :article="article" />
			</div>

			<div class="row">
				<article-comments :article="article" />
			</div>

		</div>

	</div>
</template>

<script>
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import articleMeta from './components/articleMeta.vue'
import ArticleComments from './components/article-comments.vue'
export default {
  	components: { articleMeta, ArticleComments },
    name: "articlePage",
    async asyncData ({ params }) {
      const { data } = await getArticle(params.slug)
      const { article } = data
      const md = new MarkdownIt()
      article.body = md.render(article.body)
      return {
        article
      }
    },
	head() {
		return {
			title: `${this.article.title} - Realworld`,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: this.article.description
				}
			]
		}
	}
}
</script>

<style>

</style>