import { Account } from "../../../app/server_app/model/AuthModel";
import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

const insertMock = jest.fn();
const updateMock = jest.fn();
const getByMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                update: updateMock,
                getBy: getByMock,
            };
        }),
    };
});

const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
};

describe("SessionTokenDataAccess test suite", () => {
    let sut: SessionTokenDataAccess;

    const someId = "1234";

    beforeEach(() => {
        sut = new SessionTokenDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        jest.spyOn(global.Date, "now").mockReturnValue(0);
        jest.spyOn(IdGenerator, "generateRandomId").mockReturnValueOnce(someId);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should generate token for valid credentials", async () => {
        insertMock.mockResolvedValueOnce(someId);

        const actual = await sut.generateToken(someAccount);

        expect(actual).toBe(someId);
        expect(insertMock).toHaveBeenCalledWith({
            id: "",
            userName: someAccount.userName,
            valid: true,
            expirationDate: new Date(1000 * 60 * 60),
        });
    });

    it("should invalidate token", async () => {
        await sut.invalidateToken(someId);

        expect(updateMock).toHaveBeenCalledWith(someId, "valid", false);
    });

    it("should check validate token", async () => {
        getByMock.mockResolvedValueOnce({ valid: true });

        const actual = await sut.isValidToken({} as any);

        expect(actual).toBe(true);
    });

    it("should check invalid token", async () => {
        getByMock.mockResolvedValueOnce({ valid: false });

        const actual = await sut.isValidToken({} as any);

        expect(actual).toBe(false);
    });

    it("should check inexistent token", async () => {
        getByMock.mockResolvedValueOnce(undefined);

        const actual = await sut.isValidToken({} as any);

        expect(actual).toBe(false);
    });
});
