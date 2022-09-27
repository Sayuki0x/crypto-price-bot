export function sleep(ms: number) {
    return new Promise((res, rej) => {
        setTimeout(res, ms);
    });
}
