interface ParsedObject {
	key: string | undefined;
	value: string | undefined;
}

export const parseObject = (obje: any = {}): ParsedObject => {
    if(!obje || typeof obje !== "object") return { key: undefined, value: undefined }
    return {
        key: Object.keys(obje)[0],
        value: obje[Object.keys(obje)[0]]
    }
}