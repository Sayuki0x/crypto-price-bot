export const rankToChar = (n: number) => {
    switch (n) {
        case 1:
            return "♚";
        case 2:
            return "♛";
        default:
            if (n >= 3 && n < 11) {
                return "♜";
            }
            if (n >= 11 && n < 100) {
                return "♞";
            }
            return "♟";
    }
};
