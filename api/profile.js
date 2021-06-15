import { request } from '@/plugins/request'

export const getProfile = name => {
    return request({
        method: 'GET',
        url: `/api/profiles/${name}`
    })
}

export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}