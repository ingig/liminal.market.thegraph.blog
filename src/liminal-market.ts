import {
  OrderExecuted
} from "../generated/LiminalMarket/LiminalMarket"
import {LiminalMarketInfo} from "../generated/schema";
import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";



export function handleOrderExecuted(event: OrderExecuted): void {
  let liminalMarketInfo = LiminalMarketInfo.load("1")
  if (liminalMarketInfo == null) {
    liminalMarketInfo = getNewLiminalMarketInfo()
  }


  liminalMarketInfo.save()
}

function getNewLiminalMarketInfo() : LiminalMarketInfo {
  let liminalMarketInfo = new LiminalMarketInfo('1');
  liminalMarketInfo.symbolCount = 0;
  liminalMarketInfo.txCount = BigInt.fromI32(0);
  liminalMarketInfo.orderExecutedCount = BigInt.fromI32(0);
  liminalMarketInfo.orderFailedCount = BigInt.fromI32(0);
  liminalMarketInfo.balanceWei = BigInt.fromI32(0)
  liminalMarketInfo.balance = BigDecimal.fromString("0");
  liminalMarketInfo.lastOrderAt = BigInt.fromI32(0);
  liminalMarketInfo.symbols = new Array<string>();
  return liminalMarketInfo;
}