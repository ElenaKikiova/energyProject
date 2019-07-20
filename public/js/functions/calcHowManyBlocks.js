function calcHowManyBlocks(Type, Value){
    return parseFloat((Value / GramsInBlock[Type]).toFixed(1)); // calc how many blocks are in (Value) grams
}
