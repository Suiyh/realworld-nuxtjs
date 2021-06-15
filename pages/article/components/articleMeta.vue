<template>
    <div class="article-meta">
        <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }"><img :src="article.author.image" /></nuxt-link>
        <div class="info">
            <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }" class="author">{{ article.author.username }}</nuxt-link>
            <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
        </div>

        <span v-if="user.username === article.author.username" class="ng-scope">
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{name: 'editor', params: { slug: article.slug } }">
                <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm" @click="onDeleteArticle(article.slug)">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </span>

        <span v-else>
            <button class="btn btn-sm btn-outline-secondary" :class="{active: article.author.following}" @click="onFollow(article)" :disabled="article.followDisable">
                <i class="ion-plus-round"></i>
                &nbsp;
                {{article.author.following ? 'Unfollow': 'Follow'}} {{article.author.username}} <span class="counter"></span>
            </button>
            &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary" :class="{active: article.favorited}" @click="onFavorite(article)" :disabled="article.favoriteDisable">
                <i class="ion-heart"></i>
                &nbsp;
                {{article.favorited ? 'Unfavorite': 'Favorite'}} Article <span class="counter">{{article.favoritesCount}}</span>
            </button>
        </span>

    </div>
</template>

<script>
import { followUser, unFollowUser } from '@/api/follow'
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article'
import { mapState } from 'vuex'
export default {
    name: "articleMeta",
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        async onFollow (article) {
			article.followDisable = true
			if (article.author.following) {
				await unFollowUser(article.author.username)
				article.author.following = false
			} else {
				await followUser(article.author.username)
				article.author.following = true
			}
			article.followDisable = false
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
        async onDeleteArticle(slug) {
            await deleteArticle(slug)
            this.$router.push('/')
        }
    }
}
</script>

<style>

</style>