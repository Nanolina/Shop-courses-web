import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract NftItem with Deployable, Ownable {
    // Адрес владельца NFT
    owner: Address;
    // Адрес коллекции, к которой принадлежит NFT
    collection_address: Address;
    // Индекс элемента в коллекции
    item_index: Int;
    // Индивидуальное содержимое (описание) для NFT
    individual_content: String;
    // Инициализация контракта
    init(owner: Address, collection_address: Address, item_index: Int, individual_content: String){
        // Установка
        self.owner = owner;
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.individual_content = individual_content;
    }

    // Обработка сообщения Transfer для передачи права собственности на NFT
    receive(msg: Transfer){
        // Проверка, что отправитель является владельцем
        self.requireOwner();
        // Обновление владельца NFT
        self.owner = msg.new_owner;
    }

    // Метод для получения данных об NFT
    get fun itemData(): ItemData {
        return
            ItemData{
                // Возвращение адреса владельца NFT
                owner: self.owner,
                // Возвращение адреса коллекции
                collection_address: self.collection_address,
                // Возвращение индекса элемента в коллекции
                item_index: self.item_index,
                // Возвращение индивидуального содержимого NFT, преобразованного в ячейку
                individual_content: self.individual_content.asSlice().asCell()
            };
    }
}
