//structure of unit test (AAA principles)
//-arrange
//-act
//-assert

//SUT = system under test

//tests should be independent

import { StringUtils, getStringInfo, toUpperCase } from "../app/Utils";

describe("Utils test suite", () => {
    describe("StringUtils tests", () => {
        let sut: StringUtils;

        beforeEach(() => {
            sut = new StringUtils();
        });
        afterEach(() => {
            //clearing mocks
        });
        it("Should return correct upperCase", () => {
            const actual = sut.toUpperCase("abc");
            expect(actual).toBe("ABC");
        });
        it("Should throw error on invalid argument - function", () => {
            function expectError() {
                sut.toUpperCase("");
            }
            expect(expectError).toThrow();
        });

        it("Should throw error on invalid argument - arrow function", () => {
            expect(() => {
                sut.toUpperCase("");
            }).toThrow();
        });
        it("Should throw error on invalid argument - try catch block", (done) => {
            try {
                sut.toUpperCase("");
                done("GetStringInfo should throw error or invalid arg!");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty("message", "Invalid Argument!");
                done();
            }
        });
    });

    it("should return uppercase of a valid string", () => {
        //arrange:
        const sut = toUpperCase;
        const expected = "ABC";

        //act:
        const actual = sut("abc");

        //assert:
        expect(actual).toBe(expected);
    });

    describe("ToUpperCase examples", () => {
        it.each([
            { input: "abc", expected: "ABC" },
            { input: "My-String", expected: "MY-STRING" },
            { input: "def", expected: "DEF" },
        ])("$input toUpperCase should be $expected", ({ input, expected }) => {
            const actual = toUpperCase(input);
            expect(actual).toBe(expected);
        });
    });

    describe("getStringInfo for arg My-String should", () => {
        test("return right length", () => {
            const actual = getStringInfo("My-String");
            expect(actual.characters).toHaveLength(9);
        });
        test("return right lower case", () => {
            const actual = getStringInfo("My-String");
            expect(actual.lowerCase).toBe("my-string");
        });
        test("return right upper case", () => {
            const actual = getStringInfo("My-String");
            expect(actual.upperCase).toBe("MY-STRING");
        });
        test("return right characters", () => {
            const actual = getStringInfo("My-String");
            expect(actual.characters).toEqual(["M", "y", "-", "S", "t", "r", "i", "n", "g"]);
            expect(actual.characters).toContain<string>("M");
            expect.arrayContaining(["t", "r", "i", "n", "g", "M", "y", "-", "S"]);
        });
        test("return defined extra info", () => {
            const actual = getStringInfo("My-String");
            expect(actual.extraInfo).toBeDefined();
        });
        test("return right extra info", () => {
            const actual = getStringInfo("My-String");
            expect(actual.extraInfo).toEqual({});
        });
    });
});
