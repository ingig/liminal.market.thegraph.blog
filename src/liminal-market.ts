import {
    OrderExecuted, OrderFailed, TokenCreated
} from "../generated/LiminalMarket/LiminalMarket"
import {LiminalMarketInfo, Symbol} from "../generated/schema";
import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";
import Helper from "./Helper";

export function handleTokenCreated(event : TokenCreated) : void {
    let symbol = new Symbol(event.params.symbol);
    symbol.contract = event.params.tokenAddress.toHex();
    symbol.logo = "https://app.liminal.market/img/logos/" + event.params.symbol.toUpperCase() + ".png";
    symbol.created = Helper.getJsTimestamp(event.block.timestamp);
    symbol.txCount = BigInt.fromI32(0);
    symbol.save();

    let liminalMarketInfo = getLiminalMarketInfo()
    let symbols = liminalMarketInfo.symbols!;
    symbols.push(symbol.id);
    liminalMarketInfo.symbols = symbols;
    liminalMarketInfo.symbolCount += 1;
    liminalMarketInfo.save();
}

export function handleOrderExecuted(event: OrderExecuted): void {

    let liminalMarketInfo = getLiminalMarketInfo();

    liminalMarketInfo.txCount = liminalMarketInfo.txCount.plus(BigInt.fromI32(1));
    liminalMarketInfo.orderExecutedCount =  liminalMarketInfo.orderExecutedCount.plus(BigInt.fromI32(1))
    if (event.params.side == 'buy') {
        liminalMarketInfo.tslWei = liminalMarketInfo.tslWei.plus(event.params.filledQty);
        liminalMarketInfo.tsl =liminalMarketInfo.tsl.plus(Helper.getDecimal(event.params.filledQty));
    } else {
        liminalMarketInfo.tslWei = liminalMarketInfo.tslWei.minus(event.params.filledQty);
        liminalMarketInfo.tsl =liminalMarketInfo.tsl.minus(Helper.getDecimal(event.params.filledQty));
    }
    liminalMarketInfo.lastOrderAt = event.params.filledAt;
    liminalMarketInfo.save();
}

export function handleOrderFailed(event : OrderFailed) : void {
    let liminalMarketInfo = getLiminalMarketInfo();
    liminalMarketInfo.orderFailedCount = liminalMarketInfo.orderFailedCount.plus(BigInt.fromI32(1))
    liminalMarketInfo.save();
}

export function getLiminalMarketInfo(): LiminalMarketInfo {
    let liminalMarketInfo = LiminalMarketInfo.load("1")
    if (liminalMarketInfo != null) {
        return liminalMarketInfo;
    }

    liminalMarketInfo = new LiminalMarketInfo('1');
    liminalMarketInfo.symbolCount = 0;
    liminalMarketInfo.txCount = BigInt.fromI32(0);
    liminalMarketInfo.orderExecutedCount = BigInt.fromI32(0);
    liminalMarketInfo.orderFailedCount = BigInt.fromI32(0);
    liminalMarketInfo.tslWei = BigInt.fromI32(0)
    liminalMarketInfo.tsl = BigDecimal.fromString("0");
    liminalMarketInfo.lastOrderAt = BigInt.fromI32(0);
    liminalMarketInfo.symbols = new Array<string>();
    return liminalMarketInfo;
}