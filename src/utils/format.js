export function priceFormat(number) {
    return (
        typeof number === 'number' &&
        number
            .toFixed(3)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    );
}
export const onlyNumber = (input) => {
    var regex = /^(\d+(\.\d*)?|)$/;
    return regex.test(input);
};
export const onlyPhoneNumVN = (input) => {
    const regexPhoneNumber = /^(0|84)(3|5|7|8|9)\d{8}\b/;
    return regexPhoneNumber.test(input);
};
export const phoneFormat = (input) => {
    if (input.startsWith('0')) {
        // Thay thế "0" bằng "84" và thêm dấu cộng vào đầu input
        return '+84' + input.substring(1);
    }
    return '+' + input;
};
