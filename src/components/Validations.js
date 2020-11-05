export default {
    number: (e) => {
        if(! /^\d+$/.test(e.key)){
            e.preventDefault()
        }
    }
}