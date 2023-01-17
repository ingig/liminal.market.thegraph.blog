import {Address, BigInt, ethereum} from "@graphprotocol/graph-ts";
import {OrderExecuted, OrderFailed, TokenCreated} from "../generated/LiminalMarket/LiminalMarket";
import {newMockEvent} from "matchstick-as";

export class MockSymbol {
    id: string;
    contract: Address;

    constructor(id: string, address: Address) {
        this.id = id;
        this.contract = address;
    }
}

export function getSymbols(): Array<MockSymbol> {
    let MockSymbols = new Array<MockSymbol>();
    MockSymbols.push(new MockSymbol("AAPL", Address.fromString("0x0e51e6281812df31e6474b022139ed4f1a7bb6ac")))
    return MockSymbols;
}

export function getSymbolAddress(key: string): MockSymbol {
    let symbols = getSymbols();
    for (let i = 0; i < symbols.length; i++) {
        if (symbols[i].id == key) {
            return symbols[i]
        }
    }
    throw new Error('Could not find symbol: ' + key)
}
export function getSymbolAddressParam(key: string, value: string): ethereum.EventParam {
    let mockSymbol = getSymbolAddress(value);
    let param = new ethereum.EventParam(key, ethereum.Value.fromAddress(mockSymbol.contract));
    return param;
}

export function getStringParam(key: string, value: string): ethereum.EventParam {
    return new ethereum.EventParam(key, ethereum.Value.fromString(value));
}

export function getAddressParam(key: string, value: Address): ethereum.EventParam {
    return new ethereum.EventParam(key, ethereum.Value.fromAddress(value));
}
export function getBigIntParam(key: string, value: BigInt): ethereum.EventParam {
    return new ethereum.EventParam(key, ethereum.Value.fromUnsignedBigInt(value));
}

export function getTokenCreatedEvent(symbol: string): TokenCreated {
    // @ts-ignore
    let tokenCreated = changetype<TokenCreated>(newMockEvent());

    tokenCreated.parameters = new Array();
    tokenCreated.parameters.push(getSymbolAddressParam('tokenAddress', symbol));
    tokenCreated.parameters.push(getStringParam('symbol', symbol));
    return tokenCreated;
}

export function getOrderExecutedEvent(walletAddress: Address, symbol: string, tsl: BigInt, filledQty: BigInt,
                                      filledAvgPrice: BigInt, side: string, filledAt: BigInt, commission: BigInt, aUsdBalance: BigInt,
                                      spender: Address = Address.fromString('0x2BFb0207BC88BA9e2Ac74F19c9e88EdCcdBbC2a9')): OrderExecuted {
    // @ts-ignore
    let orderExecuted = changetype<OrderExecuted>(newMockEvent());
    orderExecuted.parameters = new Array<ethereum.EventParam>();
    orderExecuted.parameters.push(getAddressParam('recipient', walletAddress));

    orderExecuted.parameters.push(getStringParam('symbol', symbol));
    orderExecuted.parameters.push(getBigIntParam('tsl', tsl));
    orderExecuted.parameters.push(getBigIntParam('filledQty', filledQty));
    orderExecuted.parameters.push(getBigIntParam('filledAvgPrice', filledAvgPrice));
    orderExecuted.parameters.push(getStringParam('side', side));
    orderExecuted.parameters.push(getBigIntParam('filledAt', filledAt))
    orderExecuted.parameters.push(getBigIntParam('commission', commission));
    orderExecuted.parameters.push(getBigIntParam('aUsdBalance', aUsdBalance));
    orderExecuted.parameters.push(getAddressParam('spender', spender));

    return orderExecuted;
}

export function getOrderFailedEvent(recipient: Address, symbol: string, message: string, buyingPower: BigInt, spender: Address): OrderFailed {
    // @ts-ignore
    let orderFailed = changetype<OrderFailed>(newMockEvent());

    orderFailed.parameters = new Array();

    orderFailed.parameters.push(getAddressParam('recipient', recipient));
    orderFailed.parameters.push(getStringParam('symbol', symbol));
    orderFailed.parameters.push(getBigIntParam('buyingPower', buyingPower));
    orderFailed.parameters.push(getStringParam('message', message));
    orderFailed.parameters.push(getAddressParam('spender', spender));
    orderFailed.parameters.push(getBigIntParam('created', BigInt.fromI32(1)));
    return orderFailed;
}
