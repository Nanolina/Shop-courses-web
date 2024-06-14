import { address, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { MarketplaceFee } from '../wrappers/MarketplaceFee';

describe('MarketplaceFee', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let marketplaceFee: SandboxContract<MarketplaceFee>;
    const walletAlina = address('EQBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYc7F'); // Test
    const walletSnezhanna = address('EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u'); // Online courses

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        marketplaceFee = blockchain.openContract(await MarketplaceFee.fromInit(walletAlina, walletSnezhanna));

        deployer = await blockchain.treasury('deployer');

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
                transaction.to == walletAlina.toString() || transaction.to == walletSnezhanna.toString(),
        );

        // Check the number of transactions
        expect(filteredTransactions.length).toBe(2);

        const maxDevPayment = 300000000n;
        const minDevPayment = 200000000n;
        // Check every transaction
        filteredTransactions.forEach((transaction: any) => {
            expect(transaction.value).toBeLessThan(maxDevPayment);
            expect(transaction.value).toBeGreaterThan(minDevPayment);
        });
    });

    it('should withdraw', async () => {
        await marketplaceFee.send(
            deployer.getSender(),
            {
                value: toNano('10'),
            },
            {
                $$type: 'TransferToMarketplace',
                courseId: '123',
            },
        );
        const balanceBeforeTransaction = await marketplaceFee.getBalance();

        const result = await marketplaceFee.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Withdraw',
        );
        const balanceAfterTransaction = await marketplaceFee.getBalance();

        expect(balanceAfterTransaction).toBeLessThan(balanceBeforeTransaction);
        expect(balanceAfterTransaction).toBe(10000000n);
        expect(result.transactions).toHaveTransaction({
            from: marketplaceFee.address,
            to: deployer.address,
            success: true,
        });
    });
});
