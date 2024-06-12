import { address, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
// import { Purchase } from '../wrappers/Purchase';

xdescribe('Purchase', () => {
//     let blockchain: Blockchain;
//     let deployer: SandboxContract<TreasuryContract>;
//     let purchase: SandboxContract<Purchase>;

//     beforeEach(async () => {
//         blockchain = await Blockchain.create();

//         purchase = blockchain.openContract(await Purchase.fromInit());

//         deployer = await blockchain.treasury('deployer');

//         const deployResult = await purchase.send(
//             deployer.getSender(),
//             {
//                 value: toNano('0.05'),
//             },
//             {
//                 $$type: 'Deploy',
//                 queryId: 0n,
//             },
//         );

//         expect(deployResult.transactions).toHaveTransaction({
//             from: deployer.address,
//             to: purchase.address,
//             deploy: true,
//             success: true,
//         });
//     });

    xit('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and customer are ready to use
    });

//     xit('should send money to seller', async () => {
//         const BeforeBalance = await purchase.getBalance();
//         console.log('BeforeBalance', BeforeBalance);

//         const result = await purchase.send(
//             deployer.getSender(),
//             {
//                 value: toNano('5'),
//             },
//             {
//                 $$type: 'NewPurchase',
//                 courseId: '123',
//                 seller: address('0:36ee186614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61'),
//                 coursePrice: 4000000000n,
//             },
//         );

//         const AfterBalance = await purchase.getBalance();
//         console.log('AfterBalance', AfterBalance);

//         console.log('result-purchase', result.events);
//     });
});
