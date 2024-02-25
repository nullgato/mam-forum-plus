interface ILatestPost {
    date: string
    author: {
        name: string
        href: string
        color: string
    }
    href: string
    title: string
}

export { type ILatestPost }
