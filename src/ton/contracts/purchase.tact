import "@stdlib/deploy";
import "./messages";
import "./marketplaceFee";

contract Purchase with Deployable {
    const deployFee: Int = ton("0.05");
    const walletAlina: Address = address("EQBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYc7F"); // Test
    const walletSnezhanna: Address = address("EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u"); // Online courses test
    customer: Address;
    seller: Address;
    courseId: String;
    init(customer: Address, seller: Address, courseId: String){
        self.customer = customer;
        self.seller = seller;
        self.courseId = courseId;
    }

    receive(msg: NewPurchase){
        // пришло 5.13
        let marketplaceFee: Int = msg.coursePrice * 15 / 100; // 0.75
        let totalFee: Int = (msg.coursePrice + self.deployFee); // 5 + 0.05 = 5.05
        require(context().value >= totalFee, "Insufficient funds to send money to seller");
        let init: StateInit = initOf MarketplaceFee(self.walletAlina, self.walletSnezhanna);
        let marketplaceFeeAddress: Address = contractAddress(init);
        // Send money to seller
        send(SendParameters{
                to: self.seller,
                value: (msg.coursePrice - marketplaceFee), // 4.25 + fee 0.02 = 4.27
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: self.courseId.asComment(),
                bounce: false
            }
        );
        // осталось 5.13 - 4.27 = 0.86
        // Send money to marketplaceFee contract
        send(SendParameters{
                to: marketplaceFeeAddress,
                value: (marketplaceFee + self.deployFee), // 0.75 + 0.05 = 0.8
                mode: SendIgnoreErrors,
                body: TransferToMarketplace{courseId: self.courseId}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }
}
