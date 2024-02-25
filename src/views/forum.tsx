import { parseLatestPost, parseSubforums } from '../data/parser'
import { BoardCells } from '../enums/board-cells'
import { ForumLinks } from '../enums/forum-links'
import { IForumCategory } from '../interfaces/IForumCategory'
import styles from '../styles/forum.module.css'

interface IProps {
    forumItems: IForumCategory[]
}

function Forum(props: IProps) {
    console.log(props.forumItems)

    return (
        <div style={styles.forumContent}>
            <h1>My Anonamouse - Forum</h1>
            <div style={styles.forumTools}>
                <a href={ForumLinks.AdvancedSearch}>Advanced Search</a>
                <span> | </span>
                <a href={ForumLinks.UnreadPosts}>New Posts</a>
                <span> | </span>
                <a href={ForumLinks.DailyPosts}>Latest Posts (24h.)</a>
                <span> | </span>
                <a href={ForumLinks.Catchup}>Mark all as read</a>
            </div>
        </div>
    )
}

const cloneForum = (): IForumCategory[] => {
    const forumItems: IForumCategory[] = []

    const tableElem = document.querySelector('#mainForum') as HTMLTableElement
    for (const row of tableElem.tBodies[0].rows) {
        const isCategory = row.cells[0].className === 'colhead'
        if (isCategory) {
            forumItems.push({
                name: row.cells[0].textContent,
                boards: []
            })

            continue
        }

        forumItems[forumItems.length - 1].boards.push({
            isRead: row.cells[BoardCells.Icon].children[0].getAttribute('alt') === 'unlocked',
            name: row.cells[BoardCells.Info].querySelector('.forumLink').textContent,
            description: row.cells[BoardCells.Info].querySelector('.forDesc').textContent,
            subforums: parseSubforums(row.cells[BoardCells.Info].querySelector('.subBoard')),
            topicCount: parseInt(row.cells[BoardCells.TopicCount].textContent),
            postCount: parseInt(row.cells[BoardCells.PostCount].textContent),
            latestPost: parseLatestPost(row.cells[BoardCells.LatestPost])
        })
    }

    return forumItems
}

export default Forum
export { cloneForum }
