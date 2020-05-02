export const displayName = (user) => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`
}