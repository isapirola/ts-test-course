import { DataBase } from "../../app/server_app/data/DataBase";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

jest.mock("../../app/server_app/data/DataBase");

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
    listen: () => {},
    close: () => {},
};

jest.mock("http", () => ({
    createServer: (cb: Function) => {
        cb(requestWrapper, responseWrapper);
        return fakeServer;
    },
}));

describe("Register requests test suite", () => {});
