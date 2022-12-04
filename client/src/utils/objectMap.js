var objectMap = function (obj, callback) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof callback === 'function') {
                result.push(callback(obj[key], key, obj));
            }
        }
    }
    return result;
};

export default objectMap;