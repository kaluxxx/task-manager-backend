exports.generatePromise = () => {
    let resolve
    let reject
    let promise = new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
    })

    return { resolve, reject, promise }
}