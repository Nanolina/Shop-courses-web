import "@stdlib/deploy";
import "./messages";
import "./marketplaceFee";

// Production
contract Course with Deployable {
    const deployFee: Int = ton("0.05");
    const minTonForStorage: Int = ton("0.02");
    const devWallet1: Address = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh"); // Alina
    const devWallet2: Address = address("0QAaB9yd5ORKCKSHStCiNCvsT3eckoW3ddF4hQ6bM4u3Jzs1"); // Snezhanna
    const prodWallet1: Address = address("UQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sYIr"); // Alina
    const prodWallet2: Address = address("UQAaB9yd5ORKCKSHStCiNCvsT3eckoW3ddF4hQ6bM4u3J4C_"); // Snezhanna
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

    receive(msg: Sale){
        require(context().value >= self.coursePrice, "Insufficient funds to send money to seller");
        let marketplaceFee: Int = self.coursePrice * 15 / 100;
        let init: StateInit = initOf MarketplaceFee(self.devWallet1, self.devWallet2);
        if (msg.isProduction) {
            init = initOf MarketplaceFee(self.prodWallet1, self.prodWallet2);
        }
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

    receive("Withdraw"){
        require(sender() == self.seller, "Only seller is allowed to withdraw");
        send(SendParameters{
                to: sender(),
                value: ((myBalance() - context().value) - self.minTonForStorage),
                mode: (SendIgnoreErrors + SendRemainingValue)
            }
        );
    }

    get fun address(courseId: String, coursePrice: Int, sellerId: Int): Address {
        let init: StateInit = initOf Course(courseId, coursePrice, sellerId);
        return contractAddress(init);
    }

    get fun marketplaceFeeAddress(devWallet1: Address, devWallet2: Address): Address {
        let init: StateInit = initOf MarketplaceFee(devWallet1, devWallet2);
        return contractAddress(init);
    }
}
