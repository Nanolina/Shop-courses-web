import "@stdlib/deploy";
import "./messages";
import "./seller";

contract Factory with Deployable {
    // Address wallet marketplace
    owner: Address;
    init(){
        self.owner = address("0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK");
    }

    receive(msg: NewSeller){
        let sellerInit: StateInit = self.sellerInit(sender(), msg.courseId);
        let gasFee: Int = ton("0.1");
        let storageFee: Int = ton("0.4");
        let marketplaceFee: Int = ton("0.5");
        let deployFee: Int = (gasFee + storageFee);
        let totalFee: Int = (deployFee + marketplaceFee);
        dump(deployFee);
        dump(totalFee);
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
        send(SendParameters{to: self.owner, value: marketplaceFee, mode: SendIgnoreErrors});
        // Response about success
        self.reply("Course created".asComment());
    }

    fun sellerInit(seller: Address, courseId: String): StateInit {
        return initOf Seller(seller, courseId);
    }

    get fun myAddress(): Address {
        return myAddress();
    }
}
