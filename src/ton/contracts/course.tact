import "@stdlib/deploy";
import "./messages";
import "./marketplaceFee";

contract Course with Deployable {
    const deployFee: Int = ton("0.05");
    const walletDev1: Address = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh"); // Online courses test
    const walletDev2: Address = address("0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK"); // Test
    courseId: String;
    coursePrice: Int as coins;
    seller: Address;
    sellerId: Int as uint64;
    init(courseId: String, coursePrice: Int, sellerId: Int){
        self.courseId = courseId;
        self.coursePrice = coursePrice;
        self.sellerId = sellerId;
        self.seller = newAddress(0, 0);
    }

    receive(msg: NewCourse){
        require(context().value >= self.deployFee, "Insufficient funds to create a course");
        let init: StateInit = initOf Course(msg.courseId, msg.coursePrice, msg.sellerId);
        let address: Address = contractAddress(init);
        // Create new course contract with new data
        send(SendParameters{
                to: address,
                value: 0,
                mode: SendIgnoreErrors | SendRemainingValue,
                body: CreateCourse{seller: sender()}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }

    receive(msg: CreateCourse){
        self.seller = msg.seller;
    }

    receive("Sale"){
        require(context().value >= self.coursePrice, "Insufficient funds to send money to seller");
        let marketplaceFee: Int = self.coursePrice * 15 / 100;
        let init: StateInit = initOf MarketplaceFee(self.walletDev1, self.walletDev2);
        let marketplaceFeeAddress: Address = contractAddress(init);
        // Send money to seller
        send(SendParameters{
                to: self.seller,
                value: (self.coursePrice - marketplaceFee),
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: self.courseId.asComment(),
                bounce: false
            }
        );
        // Send money to marketplaceFee contract
        send(SendParameters{
                to: marketplaceFeeAddress,
                value: marketplaceFee,
                mode: SendIgnoreErrors | SendPayGasSeparately,
                body: TransferToMarketplace{courseId: self.courseId}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }
}
