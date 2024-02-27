import { IForumSubforum } from './IForumSubforum'
import { ILatestPost } from './ILatestPost'

interface IForumBoard {
    isRead: boolean
    href: string
    name: string
    description: string
    subforums: IForumSubforum[]
    topicCount: number
    postCount: number
    latestPost: ILatestPost
}

export { type IForumBoard }
