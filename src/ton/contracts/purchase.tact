import "@stdlib/deploy";
import "./messages";
import "./marketplaceFee";

contract Purchase with Deployable {
    const deployFee: Int = ton("0.05");
    const walletDev1: Address = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh"); // Online courses test
    const walletDev2: Address = address("0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK"); // Test
    customer: Address;
    seller: Address;
    courseId: String;
    init(customer: Address, seller: Address, courseId: String){
        self.customer = customer;
        self.seller = seller;
        self.courseId = courseId;
    }

    receive(msg: NewPurchase){
        let marketplaceFee: Int = msg.coursePrice * 15 / 100;
        let totalFee: Int = (msg.coursePrice + self.deployFee);
        require(context().value >= totalFee, "Insufficient funds to send money to seller");
        let init: StateInit = initOf MarketplaceFee(self.walletDev1, self.walletDev2);
        let marketplaceFeeAddress: Address = contractAddress(init);
        // Send money to seller
        send(SendParameters{
                to: self.seller,
                value: (msg.coursePrice - marketplaceFee),
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: self.courseId.asComment(),
                bounce: false
            }
        );
        // Send money to marketplaceFee contract
        send(SendParameters{
                to: marketplaceFeeAddress,
                value: (marketplaceFee + self.deployFee),
                mode: SendIgnoreErrors,
                body: TransferToMarketplace{courseId: self.courseId}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }
}
