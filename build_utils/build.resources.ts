export const electronRelease = process.versions;

export const node = electronRelease.node.split('.')[0];
export const chrome = electronRelease.v8.split('.').splice(0, 2).join('');
