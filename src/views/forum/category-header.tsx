import { createSignal } from 'solid-js'
import {
    getIsCategoryCollapsed,
    setIsCategoryCollapsed,
} from '../../data/storage'
import { IForumCategory } from '../../interfaces/IForumCategory'
import styles from '../../styles/forum.module.css'

interface IProps {
    theme: 'mp_light' | 'mp_dark'
    category: IForumCategory
    children: Node
}

const CategoryHeader = (props: IProps) => {
    const [isCollapsed, setIsCollapsed] = createSignal(
        getIsCategoryCollapsed(props.category.name)
    )

    const toggleIsCollapsed = () => {
        const newState = !isCollapsed()
        setIsCollapsed(newState)
        setIsCategoryCollapsed(props.category.name, newState)
    }

    return (
        <div class={styles.forumCategory}>
            <div
                style={{
                    'background-color':
                        props.theme === 'mp_light' ? '#ddd' : '#111',
                }}
                class={styles.forumCategoryHeader}
            >
                <button onClick={toggleIsCollapsed}>
                    {isCollapsed() ? '+' : '-'}
                </button>
                <h1>{props.category.name}</h1>
                <h1>Topics</h1>
                <h1>Posts</h1>
                <h1>Latest Post</h1>
            </div>
            <div class={isCollapsed() ? styles.collapsed : ''}>
                {props.children}
            </div>
        </div>
    )
}

export default CategoryHeader
