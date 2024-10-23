module.exports = async function(fn, onError){
    try{
        const data = await fn()
        return [null, data]
    }catch(error){
        onError?.(error)
        return [error, null]
    }
}