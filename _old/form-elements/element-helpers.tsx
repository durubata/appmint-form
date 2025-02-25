
export const dotPathToDash = (path, name) => {
    let uPath = path || '';
    uPath = uPath.replaceAll('.', '-');
    if (uPath && name) return `${uPath}-${name}`;
    if (!uPath && name) return name;
    return uPath;
}
