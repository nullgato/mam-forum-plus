import { render } from 'solid-js/web'
import { ForumViews } from './enums/forum-views'
import { waitForElem } from './util'
import Forum, { cloneForum } from './views/forum'

//const forumPath = '/f'
//const forumPathAlt = '/f/'
const boardPath = '/f/b'
const threadPath = '/f/t'

const getView = (): ForumViews => {
    const path = window.location.pathname

    if (path.indexOf(threadPath) >= 0) return ForumViews.THREAD
    if (path.indexOf(boardPath) >= 0) return ForumViews.BOARD
    else return ForumViews.FORUM
}

const processRouting = async () => {
    const view = getView()
    const mountingElem = await waitForElem('#mainBody')
    switch (view) {
        case ForumViews.FORUM: {
            if (mountingElem === null) {
                console.warn('#mainBody did not properly load in time')
                return
            }

            const forumItems = cloneForum()
            mountingElem.innerHTML = ''
            render(() => <Forum forumItems={forumItems} />, mountingElem)
            break
        }
        default: {
            break
        }
    }
}

export { processRouting }
