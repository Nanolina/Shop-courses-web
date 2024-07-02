import { NetworkProvider } from '@ton/blueprint';
import { address, toNano } from '@ton/core';
import { Purchase } from '../wrappers/Purchase';

export async function run(provider: NetworkProvider) {
    const testAddress = address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'); // Test
    const purchase = provider.open(await Purchase.fromInit(5075565141n, testAddress));

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
