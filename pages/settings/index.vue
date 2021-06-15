<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
            <li v-for="(message, index) in messages" :key="index">
              {{field}} {{message}}
            </li>
          </template>
        </ul>

        <form @submit.prevent="doUpdataUser">
          <fieldset>
              <fieldset class="form-group">
                <input v-model="image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="username" class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="password" class="form-control form-control-lg" type="password" placeholder="New Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
          </fieldset>
        </form>
        <hr>
        <button class="btn btn-outline-danger" @click="logout()">
          Or click here to logout.
        </button>
      </div>

    </div>
  </div>
</div>

</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import { updataUser } from '@/api/user'
export default {
    // 在路由匹配组件渲染之前会先执行中间件进行处理 
    middleware: 'authenticated',
    name: "settingsPage",
    asyncData({ store }) {
      const { user } = store.state
      return {
        email: user.email || '',
        username: user.username || '',
        password: null,
        image: user.image || '',
        bio: user.bio || '',
        errors: {}
      }
    },
    methods: {
      async doUpdataUser() {
        let params = {
          email: this.email,
          username: this.username,
          password: this.password,
          image: this.image,
          bio: this.bio,
        }
        try {
          let { data } = await updataUser(params)
          this.$store.commit('setUser', data.user)
          Cookie.set('user', data.user)
          this.$router.push({
            name: 'profile',
            params: {
              username: data.user.username
            }
          })
        } catch (error) {
          this.errors = error.response.data.errors
        }
      },
      logout() {
        this.$store.commit('setUser', null)
        Cookie.set('user', null)
        this.$router.push('/')
      }
    }
}
</script>

<style>

</style>