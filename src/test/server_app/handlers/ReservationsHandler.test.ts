import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { Reservation } from "../../../app/server_app/model/ReservationModel";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();
jest.mock("../../../app/server_app/utils/Utils", () => ({
    getRequestBody: () => getRequestBodyMock(),
}));

describe("ReservationsHandler test suite", () => {
    let sut: ReservationsHandler;

    const request = {
        method: undefined,
        headers: {
            authorization: undefined,
        },
        url: undefined,
    };

    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn(),
    };

    const authorizerMock = {
        registerUser: jest.fn(),
        validateToken: jest.fn(),
    };

    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn(),
        updateReservation: jest.fn(),
        deleteReservation: jest.fn(),
    };

    const someReservation: Reservation = {
        id: undefined,
        endDate: new Date().toDateString(),
        startDate: new Date().toDateString(),
        room: "someRoom",
        user: "someUser",
    };

    const someReservationId = "1234";

    beforeEach(() => {
        sut = new ReservationsHandler(
            request as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer,
            reservationsDataAccessMock as any as ReservationsDataAccess
        );
        request.headers.authorization = "abcd";
        authorizerMock.validateToken.mockResolvedValueOnce(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
        request.url = undefined;
        responseMock.statusCode = 0;
    });

    describe("POST requests", () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.POST;
        });

        it("should create reservation from valid request", async () => {
            getRequestBodyMock.mockResolvedValue(someReservation);
            reservationsDataAccessMock.createReservation.mockResolvedValueOnce(
                someReservationId
            );

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
                "Content-Type": "application/json",
            });
            expect(responseMock.write).toHaveBeenCalledWith(
                JSON.stringify({ reservationId: someReservationId })
            );
        });

        it("should not create reservation from invalid request", async () => {
            getRequestBodyMock.mockResolvedValue({});

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(
                JSON.stringify("Incomplete reservation!")
            );
        });

        it("should not create reservation from invalid fields in request", async () => {
            const moreThanAReservation = { ...someReservation, someField: "123" };
            getRequestBodyMock.mockResolvedValueOnce(moreThanAReservation);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(
                JSON.stringify("Incomplete reservation!")
            );
        });
    });

    describe("GET requests", () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.GET;
        });

        it("should return all reservations for /all request", async () => {
            request.url = "/reservations/all";
            reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([
                someReservation,
            ]);

            await sut.handleRequest();

            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
                "Content-Type": "application/json",
            });
            expect(responseMock.write).toHaveBeenCalledWith(
                JSON.stringify([someReservation])
            );
        });

        it("should return reservation for existing id", async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
                someReservation
            );

            await sut.handleRequest();

            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
                "Content-Type": "application/json",
            });
            expect(responseMock.write).toHaveBeenCalledWith(
                JSON.stringify(someReservation)
            );
        });

        it("should return not found for non existing id", async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
            expect(responseMock.write).toHaveBeenCalledWith(
                JSON.stringify(`Reservation with id ${someReservationId} not found`)
            );
        });

        it("should return bad request if no id provided", async () => {
            request.url = `/reservations`;

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(
                JSON.stringify("Please provide an ID!")
            );
        });
    });
});
