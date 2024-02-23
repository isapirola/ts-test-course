export type stringInfo = {
    lowerCase: string;
    upperCase: string;
    characters: string[];
    length: number;
    extraInfo: Object | undefined;
};

export function calculateComplexity(stringInfo: stringInfo) {
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

type LoggerServiceCallback = (arg: string) => void;

export function toUpperCaseWithCb(arg: string, callBack: Function) {
    if (!arg) {
        callBack("Invalid argument!");
        return;
    }
    callBack(`Called function with ${arg}`);
    return arg.toUpperCase();
}
