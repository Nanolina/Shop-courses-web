import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract MarketplaceFee with Deployable, Ownable {
    const minTonForStorage: Int = ton("0.01"); // 1KB for 2.5 years
    const deployFee: Int = ton("0.05");
    owner: Address;
    walletDev2: Address;
    init(owner: Address, walletDev2: Address){
        self.owner = owner;
        self.walletDev2 = walletDev2;
    }

    receive(msg: TransferToMarketplace){
        let halfAmount: Int = (context().value - self.deployFee) / 2;
        // Send money to Developer 1
        send(SendParameters{
                to: self.owner,
                value: halfAmount,
                mode: SendIgnoreErrors,
                body: msg.courseId.asComment(),
                bounce: false
            }
        );
        // Send money to Developer 2
        send(SendParameters{
                to: self.walletDev2,
                value: halfAmount,
                mode: SendIgnoreErrors,
                body: msg.courseId.asComment(),
                bounce: false
            }
        );
    }

    receive("Withdraw"){
        require(sender() == self.owner, "Only owner is allowed to withdraw");
        send(SendParameters{
                to: sender(),
                value: ((myBalance() - context().value) - self.minTonForStorage),
                mode: (SendIgnoreErrors + SendRemainingValue)
            }
        );
    }

    get fun balance(): Int {
        return myBalance();
    }
}
