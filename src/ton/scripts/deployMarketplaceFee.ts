import { NetworkProvider } from '@ton/blueprint';
import { address, toNano } from '@ton/core';
import { MarketplaceFee } from '../wrappers/MarketplaceFee';

export async function run(provider: NetworkProvider) {
    const walletDev1 = address('0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh'); // Online courses test
    const walletDev2 = address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'); // Test
    const marketplaceFee = provider.open(await MarketplaceFee.fromInit(walletDev1, walletDev2));

    await marketplaceFee.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(marketplaceFee.address);

    // run methods on `seller`
}
