import { NetworkProvider } from '@ton/blueprint';
import { Address, toNano } from '@ton/core';
import { MarketplaceFee } from '../wrappers/MarketplaceFee';

export async function run(provider: NetworkProvider) {
    const walletAlina = Address.parse('EQBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYc7F'); // Test
    const walletSnezhanna = Address.parse('EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u'); // Online courses test
    const marketplaceFee = provider.open(await MarketplaceFee.fromInit(walletAlina, walletSnezhanna));

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
