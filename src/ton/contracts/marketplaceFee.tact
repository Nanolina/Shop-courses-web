import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract MarketplaceFee with Deployable, Ownable {
    const minTonForStorage: Int = ton("0.01"); // 1KB for 2.5 years
    owner: Address;
    walletAlina: Address;
    walletSnezhanna: Address;
    init(walletAlina: Address, walletSnezhanna: Address){
        self.owner = sender();
        self.walletAlina = walletAlina;
        self.walletSnezhanna = walletSnezhanna;
    }

    receive(msg: TransferToMarketplace){
        let halfAmount: Int = (context().value / 2 - self.minTonForStorage); // 0.6 / 2 - 0.01 = 0.29
        // Send money to Alina
        send(SendParameters{
                to: self.walletAlina,
                value: (halfAmount - self.minTonForStorage), // 0.2
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: msg.courseId.asComment(),
                bounce: false
            }
        );
        // Send money to Snezhanna
        send(SendParameters{
                to: self.walletSnezhanna,
                value: (halfAmount - self.minTonForStorage), // 0.2
                mode: SendPayGasSeparately | SendIgnoreErrors,
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
