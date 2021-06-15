import { request } from '@/plugins/request'

export const followUser = name => {
    return request({
        method: 'POST',
        url: `/api/profiles/${name}/follow`
    })
}

export const unFollowUser = name => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${name}/follow`
    })
}