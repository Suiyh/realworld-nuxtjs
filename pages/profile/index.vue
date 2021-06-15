<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{ profile.username }}</h4>
          <p>
            {{ profile.bio }}
          </p>

          <button v-if="user.username !== profile.username" class="btn btn-sm btn-outline-secondary action-btn" @click="onFollow(profile)" :disabled="profile.followDisable">
            <i class="ion-plus-round"></i>
            &nbsp;
            {{profile.following ? 'Unfollow': 'Follow'}} {{ profile.username }}
          </button>

          <nuxt-link v-else class="btn btn-sm btn-outline-secondary action-btn" to="/settings">
            <i class="ion-gear-a"></i> Edit Profile Settings
          </nuxt-link>
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
							<nuxt-link class="nav-link" :class="{ active: tab === 'myArticles' }" :to="{ name: 'profile', query: { tab: 'myArticles' } }" exact>My Articles</nuxt-link>
						</li>
						<li class="nav-item">
							<nuxt-link class="nav-link" :class="{ active: tab === 'favoritedArticles' }" :to="{ name: 'profile', query: { tab: 'favoritedArticles' } }" exact>Favorited Articles</nuxt-link>
						</li>
          </ul>
        </div>


        <div class="article-preview" v-for="article in articles" :key="article.slug">
					<div class="article-meta">
						<nuxt-link :to="{name: 'profile', params: { username: article.author.username }}">
							<img :src="article.author.image" />
						</nuxt-link>
						<div class="info">
							<nuxt-link :to="{name: 'profile', params: { username: article.author.username }}" class="author">
								{{article.author.username}}
							</nuxt-link>
							<span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
						</div>
						<button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{ active: article.favorited }" @click="onFavorite(article)" :disabled="article.favoriteDisable">
							<i class="ion-heart"></i> {{ article.favoritesCount }}
						</button>
					</div>
					<nuxt-link :to="{name: 'article', params: { slug: article.slug }}" class="preview-link">
						<h1>{{ article.title }}</h1>
						<p>{{ article.description }}</p>
						<span>Read more...</span>
					</nuxt-link>
				</div>

        <nav>
					<ul class="pagination">
						<li class="page-item" :class="{ active: item === page }" v-for="item in totalPage" :key="item">
							<nuxt-link class="page-link" :to="{ name: 'profile', query: { page: item, tab: tab } }">{{item}}</nuxt-link>
						</li>
					</ul>
				</nav>

      </div>

    </div>
  </div>

</div>
</template>

<script>
import { mapState } from 'vuex'
import { followUser, unFollowUser } from '@/api/follow'
import { getProfile, getArticles } from '@/api/profile'
import { addFavorite, deleteFavorite } from '@/api/article'
export default {
    // 在路由匹配组件渲染之前会先执行中间件进行处理
    middleware: 'authenticated',
    name: 'profilePage',
    computed: {
      ...mapState(['user']),
      totalPage () {
        return Math.ceil(this.articlesCount / this.limit)
      }
    },
    watchQuery: ['tab', 'page'],
    async asyncData({ query, params }) {
      const page = Number.parseInt(query.page || 1)
      const limit = 5
      const offset = 0
      const tab = query.tab || 'myArticles'
      let data = {
          limit,
          offset: (page -1) * limit,
          author: params.username,
          favorited: params.username
      }
      if (tab === 'myArticles') {
        delete data.favorited
      }else{
        delete data.author
      }
      let [ profileRes, articleRes ] = await Promise.all([
        getProfile(params.username),
        getArticles(data)
      ])
      let { profile } = profileRes.data
      let { articles, articlesCount } = articleRes.data
      return {
        profile,
        limit,
        offset,
        articles,
        tab,
        page,
        articlesCount
      }
    },
    methods: {
      async onFollow (profile) {
        profile.followDisable = true
        if (profile.following) {
          await unFollowUser(profile.username)
          profile.following = false
        } else {
          await followUser(profile.username)
          profile.following = true
        }
        profile.followDisable = false
      },
      async onFavorite (article) {
        article.favoriteDisable = true
        if (article.favorited) {
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount += -1
        } else {
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount += 1
        }
        article.favoriteDisable = false
      },
    }
}
</script>

<style>

</style>