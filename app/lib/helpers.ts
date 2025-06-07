import {Result} from "~/lib/types";


export const safeTry = async <T>(promise: Promise<T>) : Promise<Result<T , Error>>    => {

    try {
        const data = await promise

        return [ true , data , "" ]
    }catch (e) {
        return [ false, e as any , (e as any).message ]
    }
}

/**
 *
 * @param {string} message
 * @param {number} statusCode
 * @returns {Error}
 */
export const generateError = (message: string , statusCode: number) => {

    const error: any = new Error(message)
    error.statusCode = statusCode
    return error
}

export const formatEmail = (text: string) => text.split("").reduce((prev: string, char, idx) => {
    prev += idx > 0 && idx < text.indexOf("@") ? '*' : char

    return prev
}, "")

export const getInitials = (text: string) => text.split(" ").map(n => n[0]).join('').toUpperCase()