import { IForumSubforum } from "../interfaces/IForumSubforum";
import { ILatestPost } from "../interfaces/ILatestPost";

const parseSubforums = (elem: HTMLSpanElement): IForumSubforum[] => {
    if (elem === null) return []

    const subforums: IForumSubforum[] = []
    for (const subElem of elem.children) {
        if (!(subElem instanceof HTMLAnchorElement)) continue

        subforums.push({
            href: subElem.getAttribute('href'),
            isNew: subElem.children.length > 0,
            name: subElem.textContent
        })
    }

    return subforums
}

const parseLatestPost = (cell: HTMLTableCellElement): ILatestPost => {
    const authorAnchorSelector = 'a[href^="/u/"]'
    const postAnchorSelector = 'a[href^="/f/t/"]'
    const authorElem = cell.querySelector(authorAnchorSelector)
    const postElem = cell.querySelector(postAnchorSelector)

    const author = {
        color: authorElem.children[0].getAttribute('style').replace('color:', ''),
        href: authorElem.getAttribute('href'),
        name: authorElem.textContent
    }

    return {
        author,
        date: cell.innerText.substring(0, cell.innerText.indexOf('\n')),
        href: postElem.getAttribute('href'),
        title: postElem.textContent
    }
}

export { parseLatestPost, parseSubforums };

