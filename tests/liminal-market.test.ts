import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll, beforeEach
} from "matchstick-as/assembly/index"
import {TokenCreated} from "../generated/LiminalMarket/LiminalMarket";
import {Address, BigInt, ethereum} from "@graphprotocol/graph-ts";
import {newMockEvent} from "matchstick-as";
import {getOrderExecutedEvent, getOrderFailedEvent, getSymbolAddress, getTokenCreatedEvent} from "./TestHelper";
import {getLiminalMarketInfo, handleOrderExecuted, handleOrderFailed, handleTokenCreated} from "../src/liminal-market";
import Helper from "../src/Helper";


// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Test for liminal-market.ts", () => {
    beforeAll(() => {
        clearStore();
    })

    test("create AAPL token symbol", () => {

        let symbolId = 'AAPL'
        let mockedTokenCreatedEvent = getTokenCreatedEvent(symbolId);

        handleTokenCreated(mockedTokenCreatedEvent)

        let mockSymbol = getSymbolAddress(symbolId)

        assert.addressEquals(mockSymbol.contract, Address.fromString("0x0e51e6281812df31e6474b022139ed4f1a7bb6ac"))
        assert.fieldEquals('Symbol', symbolId, 'contract', mockedTokenCreatedEvent.params.tokenAddress.toHex())
        assert.fieldEquals('Symbol', symbolId, 'logo', "https://app.liminal.market/img/logos/" + symbolId.toUpperCase() + ".png")
        assert.fieldEquals('Symbol', symbolId, 'txCount', "0")
        assert.fieldEquals('Symbol', symbolId, 'created', Helper.getJsTimestamp(mockedTokenCreatedEvent.block.timestamp).toString())

    })

    test("handle buy order executed event", () => {
        let walletAddress = Address.fromString("0x0e51e6281812df31e6474b022139ed4f1a7bb6ac");
        let symbol = 'AAPL';
        let tsl = BigInt.fromString('10' + '0'.repeat(18)); //total stock are 10
        let filledQty = BigInt.fromString('2' + '0'.repeat(18)); //2 stocks bought
        let filledAvgPrice = BigInt.fromString('130' + '0'.repeat(18)) //filled at avg price of $130
        let side = 'buy';
        let filledAt = BigInt.fromString('1673964269000');
        let commission = BigInt.fromString('3' + '0'.repeat(15)) //$0.003
        let aUsdBalance = BigInt.fromString('15612' + '0'.repeat(16)) //aUsdBalance is set to $156.12
        let orderExecutedEvent = getOrderExecutedEvent(walletAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance)

        handleOrderExecuted(orderExecutedEvent);

        assert.fieldEquals('LiminalMarketInfo', '1', 'symbolCount', '1');
        assert.fieldEquals('LiminalMarketInfo', '1', 'txCount', '1');
        assert.fieldEquals('LiminalMarketInfo', '1', 'orderExecutedCount', '1');
        assert.fieldEquals('LiminalMarketInfo', '1', 'orderFailedCount', '0');

        //the filledQty is 2, this is tsl on order event is the user TSL, not the system TSL.
        assert.fieldEquals('LiminalMarketInfo', '1', 'tslWei', '2' + '0'.repeat(18));

        assert.fieldEquals('LiminalMarketInfo', '1', 'tsl', '2');
        assert.fieldEquals('LiminalMarketInfo', '1', 'lastOrderAt', '1673964269000');
        assert.fieldEquals('LiminalMarketInfo', '1', 'symbols', '[AAPL]');
    })

    test("handle sell order executed event", () => {
        let walletAddress = Address.fromString("0x0e51e6281812df31e6474b022139ed4f1a7bb6ac");
        let symbol = 'AAPL';
        let tsl = BigInt.fromString('9' + '0'.repeat(18)); //total stock are 10
        let filledQty = BigInt.fromString('1' + '0'.repeat(18)); //2 stocks bought
        let filledAvgPrice = BigInt.fromString('132' + '0'.repeat(18)) //filled at avg price of $130
        let side = 'sell';
        let filledAt = BigInt.fromString('1673964275132');
        let commission = BigInt.fromString('396' + '0'.repeat(14)) //$0.0396
        let aUsdBalance = BigInt.fromString('18612' + '0'.repeat(16)) //aUsdBalance is set to $156.12
        let orderExecutedEvent = getOrderExecutedEvent(walletAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance)

        handleOrderExecuted(orderExecutedEvent);

        assert.fieldEquals('LiminalMarketInfo', '1', 'symbolCount', '1');
        assert.fieldEquals('LiminalMarketInfo', '1', 'txCount', '2');
        assert.fieldEquals('LiminalMarketInfo', '1', 'orderExecutedCount', '2');
        assert.fieldEquals('LiminalMarketInfo', '1', 'orderFailedCount', '0');

        //the filledQty is 2, this is tsl on order event is the user TSL, not the system TSL.
        assert.fieldEquals('LiminalMarketInfo', '1', 'tslWei', '1' + '0'.repeat(18));

        assert.fieldEquals('LiminalMarketInfo', '1', 'tsl', '1');
        assert.fieldEquals('LiminalMarketInfo', '1', 'lastOrderAt', '1673964275132');
        assert.fieldEquals('LiminalMarketInfo', '1', 'symbols', '[AAPL]');
    })

    test('handleOrderFailed', () => {
        let recipient = Address.fromString("0x0e51e6281812df31e6474b022139ed4f1a7bb6ac");
        let symbol = 'AAPL';
        let message = 'failed to execute'
        let buyingPower = BigInt.fromString('100' + '0'.repeat(18));
        let spender = Address.fromString("0x0e51e6281812df31e6474b022139ed4f1a7bb6ac");
        let event = getOrderFailedEvent(recipient, symbol, message, buyingPower, spender)

        handleOrderFailed(event);
        assert.fieldEquals('LiminalMarketInfo', '1', 'orderFailedCount', '1');
    })
})
