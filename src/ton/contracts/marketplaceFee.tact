import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract MarketplaceFee with Deployable, Ownable {
    const minTonForStorage: Int = ton("0.02");
    owner: Address;
    devWallet2: Address;
    init(owner: Address, devWallet2: Address){
        self.owner = owner;
        self.devWallet2 = devWallet2;
    }

    receive(msg: TransferToMarketplace){
        let halfAmount: Int = (context().value - self.minTonForStorage) / 2;
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
                to: self.devWallet2,
                value: halfAmount,
                mode: SendIgnoreErrors,
                body: msg.courseId.asComment(),
                bounce: false
            }
        );
    }

    receive("Withdraw"){
        require(sender() == self.owner, "Only owner is allowed to withdraw");
        send(SendParameters{to: sender(), value: 0, mode: (SendIgnoreErrors + SendRemainingBalance)});
    }

    get fun balance(): Int {
        return myBalance();
    }
}
