import { IForumBoard } from './IForumBoard'

interface IForumCategory {
    name: string
    boards: IForumBoard[]
}

export { type IForumCategory }
