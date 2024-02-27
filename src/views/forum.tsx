import { createSignal } from 'solid-js'
import { parseLatestPost, parseSubforums } from '../data/parser'
import { BoardCells } from '../enums/board-cells'
import { ForumLinks } from '../enums/forum-links'
import { IForumCategory } from '../interfaces/IForumCategory'
import styles, { stylesheet } from '../styles/forum.module.css'
import CategoryBoard from './forum/category-board'
import CategoryHeader from './forum/category-header'

GM_addStyle(stylesheet)

interface IProps {
    forumItems: IForumCategory[]
}

function Forum(props: IProps) {
    const [searchText, setSearchText] = createSignal('')
    const [isSearching, setIsSearching] = createSignal(false)

    const postSearch = () => {
        if (isSearching()) return
        setIsSearching(true)

        const encodedSearchText = encodeURIComponent(searchText())
        window.location.href = `https://www.myanonamouse.net/f/search.php?text=${encodedSearchText}&searchIn=1&order=default&start=0`
    }

    const theme = document.getElementById('siteMain').getAttribute('class') as
        | 'mp_light'
        | 'mp_dark'

    return (
        <div class={styles.forumContent}>
            <h1>My Anonamouse - Forum</h1>
            <div class={styles.forumTools}>
                <a href={ForumLinks.AdvancedSearch}>Advanced Search</a>
                <span> | </span>
                <a href={ForumLinks.UnreadPosts}>New Posts</a>
                <span> | </span>
                <a href={ForumLinks.DailyPosts}>Latest Posts (24h.)</a>
                <span> | </span>
                <a href={ForumLinks.Catchup}>Mark all as read</a>
            </div>
            <div class={styles.forumSearch}>
                <div class={styles.svgIcon}>
                    <input
                        type="text"
                        placeholder="Search Forums..."
                        value={searchText()}
                        onKeyPress={(event) => {
                            if (event.key !== 'Enter') return

                            postSearch()
                        }}
                        onInput={(event) => {
                            setSearchText(event.target.value)
                        }}
                    />
                    <i class={styles.searchIcon}></i>
                </div>
            </div>
            {props.forumItems.map((forumCategory) => {
                return (
                    <CategoryHeader theme={theme} category={forumCategory}>
                        {forumCategory.boards.map((board) => {
                            return <CategoryBoard theme={theme} board={board} />
                        })}
                    </CategoryHeader>
                )
            })}
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
                boards: [],
            })

            continue
        }

        forumItems[forumItems.length - 1].boards.push({
            isRead:
                row.cells[BoardCells.Icon].children[0].getAttribute('alt') ===
                'unlocked',
            href: row.cells[BoardCells.Info]
                .querySelector('.forumLink')
                .getAttribute('href'),
            name: row.cells[BoardCells.Info].querySelector('.forumLink')
                .textContent,
            description:
                row.cells[BoardCells.Info].querySelector('.forDesc')
                    .textContent,
            subforums: parseSubforums(
                row.cells[BoardCells.Info].querySelector('.subBoard')
            ),
            topicCount: parseInt(row.cells[BoardCells.TopicCount].textContent),
            postCount: parseInt(row.cells[BoardCells.PostCount].textContent),
            latestPost: parseLatestPost(row.cells[BoardCells.LatestPost]),
        })
    }

    return forumItems
}

export default Forum
export { cloneForum }
