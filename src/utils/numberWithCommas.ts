export function numberWithCommas(n: number, decimals = 2) {
    return n.toFixed(decimals).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}