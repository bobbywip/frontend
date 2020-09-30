const toFixedDecimals = (number, decimals) => {
    const d = decimals + 1
    const x = Math.pow(10, Number(d) + 1);

    const formattedNumber = ((Number(number) + (1 / x)).toFixed(d)).slice(0, -1)

    if(formattedNumber.slice(-1) === "0") {
        return formattedNumber.split('.')[0]
    }

    return formattedNumber
}

export const formatNumberToHuman = (number) => {
    let ret

    number = parseFloat(number)

    if(number < 1) {
        return toFixedDecimals(number, 5)
    }

    ret = number > 999 
        ? 
            Math.sign(number) * ((Math.abs(number)/1000).toFixed(1)) + `k`
        :
            toFixedDecimals(Math.sign(number) * Math.abs(number), 1)

    return ret
}