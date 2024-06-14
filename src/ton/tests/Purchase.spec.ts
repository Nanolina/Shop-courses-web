import { address, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { MarketplaceFee } from '../wrappers/MarketplaceFee';
import { NewPurchase, Purchase } from '../wrappers/Purchase';

describe('Purchase', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let purchase: SandboxContract<Purchase>;
    let marketplaceFee: SandboxContract<MarketplaceFee>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        purchase = blockchain.openContract(
            await Purchase.fromInit(
                address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'),
                address('EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u'),
                '123',
            ),
        );
        marketplaceFee = blockchain.openContract(
            await MarketplaceFee.fromInit(
                address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'),
                address('EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u'),
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployPurchaseResult = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        const deployMarketplaceFeeResult = await marketplaceFee.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployPurchaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: purchase.address,
            deploy: true,
            success: true,
        });
        expect(deployMarketplaceFeeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: marketplaceFee.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and customer are ready to use
    });

    it('should send money to seller', async () => {
        const message: NewPurchase = {
            $$type: 'NewPurchase',
            coursePrice: toNano('12'),
        };
        const result = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('14'),
            },
            message,
        );

        expect(result.transactions).toHaveTransaction({
            from: purchase.address,
            to: address('EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u'),
            value: 10200000000n,
        });

        // Filter transactions that go to the seller address
        const filteredTransaction = result.events.filter(
            (transaction: any) =>
                // eslint-disable-next-line eqeqeq
                transaction.from == purchase.address.toString() &&
                transaction.to == 'EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u',
        );

        // Check the number of transactions
        expect(filteredTransaction.length).toBe(1);

        const maxMarketplaceFee = toNano(11.05);
        const minMarketplaceFee = toNano(10);
        // Check every transaction
        filteredTransaction.forEach((transaction: any) => {
            expect(transaction.value).toBeLessThan(maxMarketplaceFee);
            expect(transaction.value).toBeGreaterThan(minMarketplaceFee);
        });
    });
});
