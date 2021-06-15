<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{field}} {{message}}
              </li>
            </template>
          </ul>

          <fieldset>
            <fieldset class="form-group">
              <input v-model="title" type="text" class="form-control form-control-lg" placeholder="Article Title">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="description" type="text" class="form-control" placeholder="What's this article about?">
            </fieldset>
            <fieldset class="form-group">
              <textarea v-model="body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input v-model="tag" type="text" class="form-control" placeholder="Enter tags" @keyup.enter="createTag(tagList, tag)">
              <div class="tag-list">
                <span class="tag-default tag-pill" v-for="item in tagList" :key="item">
                  <i class="ion-close-round" @click="removeTag(tagList, item)"></i>
                  {{ item }}
                </span>
              </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" @click="doCreateArticle">
              Publish Article
            </button>
          </fieldset>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api/article'
export default {
	// 在路由匹配组件渲染之前会先执行中间件进行处理
	middleware: 'authenticated',
	name: "editorPage",
  async asyncData({ params }) {
    const { slug } = params
    const { data } = slug ? await getArticle(slug) : {}
    console.log(data)
    const { article } = data ? data : {}
    const { title, description, body, tagList } = article ? article: {}
    return {
      title: title || '',
      description: description || '',
      body: body || '',
      tagList: tagList || [],
      tag: '',
      errors: {},
      article,
      slug
    }
  },
  methods: {
    createTag(tagList, tag) {
      if (tagList.indexOf(tag) === -1) {
        tagList.push(tag)
        this.tag = ''
      }
    },
    removeTag(tagList, tag) {
      tagList.splice(tagList.indexOf(tag), 1)
    },
    async doCreateArticle() {
      let params = {
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList
      }
      if (this.slug) {
        params = Object.assign(this.article, params);
      }
      try {
        let { data } = this.slug ? await updateArticle(this.slug, params) : await createArticle(params)
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          }
        })
      } catch (error) {
        this.errors = error.response.data.errors
      }
    }
  }
}
</script>

<style>
</style>