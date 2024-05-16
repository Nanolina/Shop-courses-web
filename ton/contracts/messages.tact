// Определение сообщения для передачи права собственности на NFT
message Transfer {
    query_id: Int as uint64;
    new_owner: Address;
}
// Структура данных для коллекции
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}
// Структура данных для элемента NFT
struct ItemData {
    owner: Address;
    collection_address: Address;
    item_index: Int;
    individual_content: Cell;
}
// Структура метаданных коллекции
struct CollectionMetaData {
    image: String;
    name: String;
    description: String;
}
