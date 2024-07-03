import { address, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { MarketplaceFee } from '../wrappers/MarketplaceFee';

describe('MarketplaceFee', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let customer: SandboxContract<TreasuryContract>;
    let marketplaceFee: SandboxContract<MarketplaceFee>;
    const devWallet1 = address('0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh'); // Online courses test
    const devWallet2 = address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'); // Test

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        marketplaceFee = blockchain.openContract(await MarketplaceFee.fromInit(devWallet1, devWallet2));

        deployer = await blockchain.treasury('deployer');
        customer = await blockchain.treasury('customer');

        const deployResult = await marketplaceFee.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: marketplaceFee.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sellerCotract are ready to use
    });

    it('should send money to developers', async () => {
        const result = await marketplaceFee.send(
            deployer.getSender(),
            {
                value: toNano('0.6'),
            },
            {
                $$type: 'TransferToMarketplace',
                courseId: '123',
            },
        );

        // Filter transactions that go to the addresses of Alina and Snezhanna
        const filteredTransactions = result.events.filter(
            (transaction: any) =>
                // eslint-disable-next-line eqeqeq
                transaction.to == devWallet1.toString() || transaction.to == devWallet2.toString(),
        );

        // Check the number of transactions
        expect(filteredTransactions.length).toBe(2);

        const maxDevPayment = 300000000n;
        const minDevPayment = 200000000n;

        // Check every transaction
        filteredTransactions.forEach((transaction: any) => {
            expect(transaction.value).toBeLessThanOrEqual(maxDevPayment);
            expect(transaction.value).toBeGreaterThanOrEqual(minDevPayment);
        });
    });

    it('should withdraw money to owner', async () => {
        const result = await marketplaceFee.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Withdraw',
        );

        expect(result.transactions).toHaveTransaction({
            from: marketplaceFee.address,
            to: deployer.address,
            success: true,
        });
    });

    it('should throw an error if the withdrawal is not made by the customer', async () => {
        const result: any = await marketplaceFee.send(
            customer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Withdraw',
        );

        expect(result.events[1].from).toEqualAddress(marketplaceFee.address);
        expect(result.events[1].to).toEqualAddress(customer.address);
        expect(result.events[1].bounced).toBe(true);
    });
});
