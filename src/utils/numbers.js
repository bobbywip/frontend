export const formatNumberToHuman = (number) => {
    let ret

    number = parseFloat(number)

    if(number < 1) {
        return number.toFixed(2)
    }

    ret = number > 999 
        ? 
            Math.sign(number) * ((Math.abs(number)/1000).toFixed(1)) + `k`
        :
            (Math.sign(number) * Math.abs(number)).toFixed(0)

    return ret
}