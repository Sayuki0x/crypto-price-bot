export function numberWithCommas(n: number) {
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
