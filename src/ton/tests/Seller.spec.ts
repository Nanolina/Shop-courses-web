import { fromNano, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Seller } from '../wrappers/Seller';

describe('Seller', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let seller: SandboxContract<Seller>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        seller = blockchain.openContract(await Seller.fromInit('456'));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await seller.send(
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
            to: seller.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sellerCotract are ready to use
    });

    it('should deploy new contract', async () => {
        const result = await seller.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'NewSeller',
                courseId: '123',
            },
        );

        // console.log('result', result.events);
        // const balanceOldContract = await seller.getBalance();
        // console.log('balanceOldContract', fromNano(balanceOldContract));
        // console.log('oldAddress', await seller.address);

        // const newSeller: SandboxContract<Seller> = blockchain.openContract(await Seller.fromInit('123'));
        // const newSellerAddress = await newSeller.address;
        // console.log('newSellerAddress', newSellerAddress);
        // const newSellerBalance = await newSeller.getBalance();
        // console.log('newSellerBalance', newSellerBalance);
    });
});
