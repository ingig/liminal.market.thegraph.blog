import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";

export default class Helper {

    public static getJsTimestamp(timestamp : BigInt) : BigInt {
        return BigInt.fromI64(timestamp.times(BigInt.fromI32(1000)).toI64());
    }

    public static getDecimal(value: BigInt): BigDecimal {
        return BigDecimal.fromString(value.toString()).div(BigDecimal.fromString("1" + "0".repeat(18)))
    }

}

