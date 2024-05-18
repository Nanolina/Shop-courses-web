import "@stdlib/deploy"; // Библиотека для деплоя контрактов
import "@stdlib/ownable"; // Библиотека для управления владельцем контракта
import "./nft_item";
import "./messages";

contract NftCollection with Deployable, Ownable {
    // Комиссия за хранение контракта (аренда)
    const minTonForStorage: Int = ton("0.03");
    // Комиссия за выполнение транзакций
    const gasConsumption: Int = ton("0.03");
    // Адрес владельца коллекции
    owner: Address;
    // Счетчик для генерации уникальных ID NFT
    next_item_index: Int as uint32 = 0;
    // Содержимое коллекции (описание)
    collection_content: String;
    // Инициализация контракта
    // выполняется при деплое контракта и устанавливает начальные значения переменных
    init(){
        // Установка владельца контракта
        self.owner = sender();
        // Установка содержимого коллекции
        self.collection_content = "First Course NFT Collection";
    }

    // Обработка сообщения "Mint" для создания нового NFT
    receive("Mint"){
        // Проверка, что отправитель является владельцем
        self.requireOwner();
        // Создание нового NFT и присвоение его отправителю
        self.mint(sender());
    }

    // Метод для создания новой NFT-коллекции
    fun mint(receiver: Address) {
        // Проверка, что индекс следующего элемента не отрицательный
        require(self.next_item_index >= 0, "non-sequential NFTs");
        // Значение сообщения
        let msgValue: Int = context().value;
        // Проверка, что достаточное количество TON для создания NFT
        require(msgValue >= (self.minTonForStorage + self.gasConsumption), "Insufficient funds for minting");
        // Инициализация состояния нового NFT
        let nft_init: StateInit = self.nftItemInit(self.next_item_index);
        // Количество TON coins на балансе до транзакции
        let tonBalanceBeforeMsg: Int = (myBalance() - msgValue);
        // Комиссия за хранение (аренда)
        let storageFee: Int = (self.minTonForStorage - min(tonBalanceBeforeMsg, self.minTonForStorage));
        // Итоговое значение, которое отправится дальше
        msgValue = (msgValue - (storageFee + self.gasConsumption));
        // Отправка сообщения для создания нового NFT
        send(SendParameters{
                to: contractAddress(nft_init), // Адрес нового контракта NFT
                value: msgValue, // Значение для отправки
                mode: SendIgnoreErrors, // Режим отправки (игнорирование ошибок)
                body: Transfer{query_id: 0, new_owner: receiver}.toCell(), // Тело сообщения
                code: nft_init.code, // Код нового контракта
                data: nft_init.data // Данные нового контракта
            }
        );
        // Увеличение индекса для следующего NFT
        self.next_item_index = (self.next_item_index + 1);
    }

    // Метод для получения initial state нового NFT контракта

    get fun nftItemInit(item_index: Int): StateInit {
        let b: StringBuilder = beginString();
        b.append("Item # - "); // Добавление текста к строке
        b.append(item_index.toString()); // Преобразование индекса в строку и добавление
        // Возвращение инициализации состояния NFT
        return initOf NftItem(self.owner, myAddress(), item_index, b.toString());
    }

    // Метод для получения адреса NFT по его индексу

    get fun nftAddressByIndex(item_index: Int): Address {
        // Получение инициализации состояния NFT
        let initCode: StateInit = self.nftItemInit(item_index);
        // Возвращение адреса контракта NFT
        return contractAddress(initCode);
    }

    // Метод для получения данных коллекции

    get fun collectionData(): CollectionData {
        return
            CollectionData{
                next_item_index: self.next_item_index, // Следующий индекс элемента
                // формат строки преобразуем в формат ячейки
                // через slice мы можем читать данные ячейки
                collection_content: self.collection_content.asSlice().asCell(), // Содержимое коллекции преобразованное в ячейку
                owner_address: self.owner // Адрес владельца коллекции
            };
    }
}
