import { expect } from 'chai';
import CreateTypePropDto from '../src/dto/Type/CreateTypePropDto';
import EditTypeDto from '../src/dto/Type/EditTypeDto';
import ApiError from '../src/error/ApiError';
import TypeService from '../src/services/TypeService';

describe('TypeService', () => {
    describe('getSuggestions', () => {
        it('should return an empty array if the given property name does not exist', async () => {
            const result = await TypeService.getSuggestions('invalid_prop_name');
            expect(result).to.be.an('array').that.is.empty;
        });

        it('should return an array of objects containing the correct structure', async () => {
            const result = await TypeService.getSuggestions('color');
            expect(result).to.be.an('array');
            expect(result[0]).to.have.property('textPart').that.is.a('string');
            expect(result[0]).to.have.property('count').that.is.a('number');
        });

        // it('should return an array of objects containing the correct data', async () => {
        //   const result = await TypeService.getSuggestions('color');
        //   expect(result).to.have.lengthOf(2);
        //   expect(result[0]).to.have.property('textPart', 'red');
        //   expect(result[0]).to.have.property('count', 3);
        //   expect(result[1]).to.have.property('textPart', 'blue');
        //   expect(result[1]).to.have.property('count', 2);
        // });
    });
    describe('getFilters', () => {
        it('should return correct results when cache is empty', async () => {
            const typeId = 1; // assume typeId 1 exists in the database
            const expected = [
                { str: 'color_red', count: 1 },
                { str: 'size_big', count: 10 },
                // add more expected results for typeId 1
            ];
            const actual = await TypeService.getTypeProps(typeId);

            expect(actual).to.deep.equal(expected);
        });

        it('should return cached results when cache is available', async () => {
            const typeId = 1; // assume typeId 1 exists in the database
            const expected = [
                { str: 'color_red', count: 1 },
                { str: 'size_big', count: 10 },
                // add more expected results for typeId 1
            ];

            // mock the Redis cache to return the expected results
            const mockClient = {
                get: async () => JSON.stringify(expected),
                lRange: async () => [],
                bitOp: async () => { },
                bitCount: async () => 0,
                set: async () => { },
            };
            const actual = await TypeService.getTypeProps(typeId);

            expect(actual).to.deep.equal(expected);
        });

        it('should return empty array when typeId does not exist in the database', async () => {
            const typeId = -1; // assume typeId -1 does not exist in the database
            const expected = [];

            const actual = await TypeService.getTypeProps(typeId);

            expect(actual).to.deep.equal(expected);
        });

        it('should return empty array when there are no characteristics for the typeId', async () => {
            const typeId = 2; // assume typeId 2 exists in the database but has no characteristics
            const expected = [];
            const actual = await TypeService.getTypeProps(typeId);

            expect(actual).to.deep.equal(expected);
        });
    });
    describe("addTypeProp", () => {
        const typePropDto = new CreateTypePropDto({
            title: "color",
            typeId: 0,
            values: ["blue", "red", "white"],
        });

        it("should add filters to Redis based on device info model data", async () => {
            const deviceInfos = [
                { deviceId: 1, title: "color", textPart: "red" },
                { deviceId: 2, title: "color", textPart: "blue" },
                { deviceId: 3, title: "color", textPart: "green" },
                { deviceId: 4, title: "size", textPart: "big" },
                { deviceId: 5, title: "size", textPart: "small" },
            ];

            await expect(TypeService.addTypeProp(typePropDto)).to.deep.equal({
                "color_blue": [2],
                "color_red": [1],
                "color_green": [3],
                "size_big": [4],
                "size_small": [5],
            });
        });

        it("should throw an error if the type prop dto values are empty", async () => {
            const typePropDto = new CreateTypePropDto({
                title: "color",
                typeId: 0,
                values: [],
            });

            await expect(TypeService.addTypeProp(typePropDto)).to.be.throw(
                ApiError
            );
        });

        it("should throw an error if the type prop dto title is invalid", async () => {
            const typePropDto = new CreateTypePropDto({
                title: "",
                typeId: 0,
                values: ["blue", "red", "white"],
            });

            await expect(TypeService.addTypeProp(typePropDto)).to.be.throw(
                ApiError
            );
        });
    });

});