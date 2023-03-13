

function GetPropToDeviceKey(typeId: number) {
    return 'typeD_' + typeId;
}

function GetTypePropsKey(typeId: number) {
    return 'type_' + typeId;
}

function GetTypePropsCacheKey(typeId: number) {
    return `*_type${typeId}Props`;
}

export { GetPropToDeviceKey, GetTypePropsKey, GetTypePropsCacheKey };