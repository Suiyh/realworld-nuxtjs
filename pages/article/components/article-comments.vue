<template>
    <div class="col-xs-12 col-md-8 offset-md-2">
        <form class="card comment-form" @submit.prevent="postComments">
            <div class="card-block">
                <textarea v-model="comment" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
                <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                <button class="btn btn-sm btn-primary">
                    Post Comment
                </button>
            </div>
        </form>
        
        <div class="card" v-for="(comment, index) in comments" :key="comment.id">
            <div class="card-block">
                <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
                <nuxt-link class="comment-author" :to="{ name: 'profile', params: { username: comment.author.username } }">
                    <img :src="comment.author.image" class="comment-author-img" />
                </nuxt-link>
                &nbsp;
                <nuxt-link :to="{ name: 'profile', params: { username: comment.author.username } }" class="comment-author">{{ comment.author.username }}</nuxt-link>
                <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
                <span class="mod-options" v-if="comment.author.username === user.username">
                    <i class="ion-trash-a" @click="onDeleteComment(comment.id, index)"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { getComments, addComments, deleteComment } from '@/api/article'
import { mapState } from 'vuex'
export default {
    name: "ArticleComment",
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState(['user'])
    },
    data () {
        return {
            comments: [],
            comment: ''
        }
    },
    async mounted () {
        const { data } = await getComments(this.article.slug)
        this.comments = data.comments
    },
    methods: {
        async postComments() {
            let { data } = await addComments(this.article.slug, {
                comment: {
                    body: this.comment
                }
            })
            this.comment = ''
            this.comments.unshift(data.comment)
        },
        async onDeleteComment(id, index) {
            await deleteComment(this.article.slug, id)
            this.comments.splice(index, 1)
        }
    }
}
</script>

<style>

</style>