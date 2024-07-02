import { address, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Course, NewCourse } from '../wrappers/Course';
import { MarketplaceFee } from '../wrappers/MarketplaceFee';
import { Purchase } from '../wrappers/Purchase';

const walletDev1 = address('0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh'); // Test
const walletDev2 = address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'); // Online courses test

describe('Course', () => {
    let blockchain: Blockchain;
    let seller: SandboxContract<TreasuryContract>;
    let customer: SandboxContract<TreasuryContract>;
    let course: SandboxContract<Course>;
    let purchase: SandboxContract<Purchase>;
    let marketplaceFee: SandboxContract<MarketplaceFee>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        course = blockchain.openContract(
            await Course.fromInit('02959e9b-0c30-46a1-961a-fe144ebce033', toNano('1'), 5075565141n),
        );
        purchase = blockchain.openContract(
            await Purchase.fromInit(
                5075565141n,
                address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'), // Test
            ),
        );
        marketplaceFee = blockchain.openContract(await MarketplaceFee.fromInit(walletDev1, walletDev2));

        seller = await blockchain.treasury('seller');
        customer = await blockchain.treasury('customer');

        const deployCourseResult = await course.send(
            seller.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        const deployPurchaseResult = await purchase.send(
            customer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        const deployMarketplaceFeeResult = await marketplaceFee.send(
            seller.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployCourseResult.transactions).toHaveTransaction({
            from: seller.address,
            to: course.address,
            deploy: true,
            success: true,
        });
        expect(deployPurchaseResult.transactions).toHaveTransaction({
            from: customer.address,
            to: purchase.address,
            deploy: true,
            success: true,
        });
        expect(deployMarketplaceFeeResult.transactions).toHaveTransaction({
            from: seller.address,
            to: marketplaceFee.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and course are ready to use
    });

    it('should create new course contract with new data', async () => {
        const newCourseAddress = await course.getAddress('345', toNano('3'), 6015565141n);
        const message: NewCourse = {
            $$type: 'NewCourse',
            courseId: '345',
            coursePrice: toNano('3'),
            sellerId: 6015565141n,
        };
        const result = await course.send(
            seller.getSender(),
            {
                value: toNano('0.07'),
            },
            message,
        );

        expect(result.transactions).toHaveTransaction({
            from: course.address,
            to: newCourseAddress,
            deploy: true,
            success: true,
        });
    });

    it('should throw an error if there is not enough money when creating a course', async () => {
        const message: NewCourse = {
            $$type: 'NewCourse',
            courseId: '345',
            coursePrice: toNano('5'),
            sellerId: 6015565141n,
        };
        const result = await course.send(
            seller.getSender(),
            {
                value: toNano('0.03'),
            },
            message,
        );

        expect(result.transactions).toHaveTransaction({
            from: seller.address,
            to: course.address,
            deploy: false,
            success: false,
        });
    });

    it('should create new purchase contract', async () => {
        const newCourse = blockchain.openContract(
            await Course.fromInit('e43f9999-436a-4417-bfa8-bf2703f73dac', toNano('2'), 1708576552n),
        );
        console.log('newCourse.address', newCourse.address);
        const message: NewCourse = {
            $$type: 'NewCourse',
            courseId: 'e43f9999-436a-4417-bfa8-bf2703f73dac',
            coursePrice: toNano('2'),
            sellerId: 1708576552n,
        };
        // Send new transaction to create course to save seller
        await newCourse.send(
            seller.getSender(),
            {
                value: toNano('0.07'),
            },
            message,
        );

        purchase = blockchain.openContract(await Purchase.fromInit(7041217962n, newCourse.address));
        const newPurchaseAddress = await course.getAddressPurchase(7041217962n, newCourse.address);

        const result = await newCourse.send(
            customer.getSender(),
            {
                value: toNano('3.21'),
            },
            {
                $$type: 'NewPurchase',
                customerId: 7041217962n,
            },
        );

        console.log('purchase.address', purchase.address);
        console.log('newPurchaseAddress', newPurchaseAddress);
        console.log('result', result.events);
        expect(result.transactions).toHaveTransaction({
            from: newCourse.address,
            to: newPurchaseAddress,
            deploy: true,
            success: true,
        });
    });

    it('should throw an error if there is not enough money to buy a course', async () => {
        const result = await course.send(
            customer.getSender(),
            {
                value: toNano('0.4'),
            },
            {
                $$type: 'NewPurchase',
                customerId: 5035565141n,
            },
        );

        expect(result.transactions).toHaveTransaction({
            from: customer.address,
            to: course.address,
            deploy: false,
            success: false,
        });
    });
});
