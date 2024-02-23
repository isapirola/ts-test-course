import { v4 } from "uuid";

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

export function toUpperCase(arg: string) {
    return arg.toUpperCase();
}

export function toLowerCaseWithId(arg: string) {
    return arg.toLowerCase() + v4();
}

export function toUpperCaseWithCb(arg: string, callBack: LoggerServiceCallback) {
    if (!arg) {
        callBack("Invalid argument!");
        return;
    }
    callBack(`Called function with ${arg}`);
    return arg.toUpperCase();
}

export class OtherStringUtils {
    public callExternalService() {
        console.log("Calling external service!!!");
    }

    public toUpperCase(arg: string) {
        return arg.toUpperCase();
    }

    public logString(arg: string) {
        console.log(arg);
    }
}
