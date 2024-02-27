import { IForumBoard } from '../../interfaces/IForumBoard'
import styles from '../../styles/forum.module.css'

interface IProps {
    theme: 'mp_light' | 'mp_dark'
    board: IForumBoard
}

const CategoryBoard = (props: IProps) => {
    return (
        <div class={styles.forumCategoryBoard}>
            {props.board.isRead ? (
                <img src="/pic/unlocked.png" alt="unlocked" />
            ) : (
                <img src="/pic/unlockednew.png" alt="unlocked and new post" />
            )}

            <div class={styles.forumBoardDescription}>
                <a
                    style={{
                        color: props.theme === 'mp_light' ? 'black' : '#ddd',
                    }}
                    href={props.board.href}
                >
                    {props.board.name}
                </a>
                <p>{props.board.description}</p>
            </div>

            <p>{props.board.topicCount}</p>

            <p>{props.board.postCount}</p>

            <div class={styles.forumBoardLatestPost}>
                <p>{props.board.latestPost.date}</p>
                <p>
                    by{' '}
                    <a
                        style={{ color: props.board.latestPost.author.color }}
                        href={props.board.latestPost.author.href}
                    >
                        {props.board.latestPost.author.name}
                    </a>
                </p>
                <p>
                    <a href={props.board.latestPost.href}>
                        {props.board.latestPost.title}
                    </a>
                </p>
            </div>
        </div>
    )
}

export default CategoryBoard
