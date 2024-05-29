import { address, fromNano, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Customer } from '../wrappers/Customer';

describe('Customer', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let customer: SandboxContract<Customer>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        customer = blockchain.openContract(
            await Customer.fromInit(
                'a3253247-21b0-471b-b2ab-11cad1d35d0e',
                address('0:24ee186614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61'),
                8n,
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await customer.send(
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
            to: customer.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and customer are ready to use
    });

    it('should deploy new contract', async () => {
        const result = await customer.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'NewCustomer',
                courseId: '123',
                seller: address('0:36ee186614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61'),
                coursePrice: 6n,
            },
        );

        console.log('result', result.events);
        const balanceOldContract = await customer.getBalance();
        console.log('balanceOldContract', fromNano(balanceOldContract));
    });
});
