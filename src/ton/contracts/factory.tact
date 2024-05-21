import "@stdlib/deploy";
import "./messages";
import "./seller";

contract Factory with Deployable {
    const gasFee: Int = ton("0.2");
    const storageFee: Int = ton("0.1");
    const marketplaceFee: Int = ton("0.4");
    // Address wallet marketplace
    owner: Address;
    init(){
        self.owner = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh");
    }

    receive(msg: NewSeller){
        let sellerInit: StateInit = self.sellerInit(sender(), msg.courseId);
        let deployFee: Int = (self.gasFee + self.storageFee);
        let totalFee: Int = (deployFee + self.marketplaceFee);
        require(context().value >= totalFee, "Insufficient funds to create course");
        // Deploy Seller
        send(SendParameters{
                to: contractAddress(sellerInit),
                value: deployFee,
                mode: SendIgnoreErrors,
                body: InternalNewSeller{coursePrice: msg.coursePrice}.toCell(),
                code: sellerInit.code,
                data: sellerInit.data
            }
        );
        // Sending marketplaceFee to the address of the FactoryContract owner
        send(SendParameters{to: self.owner, value: self.marketplaceFee, mode: SendIgnoreErrors});
        // Response about success
        self.reply("Course created".asComment());
    }

    fun sellerInit(seller: Address, courseId: String): StateInit {
        return initOf Seller(seller, courseId);
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun sellerAddress(seller: Address, courseId: String): Address {
        return contractAddress(initOf Seller(seller, courseId));
    }
}
