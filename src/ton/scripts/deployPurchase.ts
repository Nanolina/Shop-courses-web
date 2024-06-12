import { NetworkProvider } from '@ton/blueprint';
import { address, toNano } from '@ton/core';
import { Purchase } from '../wrappers/Purchase';

export async function run(provider: NetworkProvider) {
    const purchase = provider.open(
        await Purchase.fromInit(
            address('EQCIEEaD_8z6FnkozF6mFaaWNN1E0JiDJBOVOWQPnBgGRTv0'),
            address('EQAVHSfvZ-PsRc8AEJ9iWSnu0lpA_bsL40hyVaKAauyMadek'),
            '123',
        ),
    );

    await purchase.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(purchase.address);

    // run methods on `customer`
}
