import { address, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Course, NewCourse } from '../wrappers/Course';
import { Purchase } from '../wrappers/Purchase';

describe('Course', () => {
    let blockchain: Blockchain;
    let seller: SandboxContract<TreasuryContract>;
    let customer: SandboxContract<TreasuryContract>;
    let course: SandboxContract<Course>;
    let purchase: SandboxContract<Purchase>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        course = blockchain.openContract(await Course.fromInit('123', toNano('12')));
        purchase = blockchain.openContract(
            await Purchase.fromInit(
                address('EQCIEEaD_8z6FnkozF6mFaaWNN1E0JiDJBOVOWQPnBgGRTv0'),
                address('EQAVHSfvZ-PsRc8AEJ9iWSnu0lpA_bsL40hyVaKAauyMadek'),
                '123',
            ),
        );

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
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and course are ready to use
    });

    it('should create new course contract with new data', async () => {
        const newCourseAddress = await course.getAddress('345', toNano('3'));
        const message: NewCourse = {
            $$type: 'NewCourse',
            courseId: '345',
            coursePrice: toNano('3'),
        };
        const result = await course.send(
            seller.getSender(),
            {
                value: toNano('1'),
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
        const newCourse = blockchain.openContract(await Course.fromInit('345', toNano('3')));
        const message: NewCourse = {
            $$type: 'NewCourse',
            courseId: '345',
            coursePrice: toNano('3'),
        };
        // Send new transaction to create course to save seller
        await newCourse.send(
            seller.getSender(),
            {
                value: toNano('1'),
            },
            message,
        );

        const newPurchaseAddress = await course.getAddressPurchase(customer.address, seller.address, '345');

        const result = await newCourse.send(
            customer.getSender(),
            {
                value: toNano('4'),
            },
            'New purchase',
        );

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
                value: toNano('5'),
            },
            'New purchase',
        );

        expect(result.transactions).toHaveTransaction({
            from: customer.address,
            to: course.address,
            deploy: false,
            success: false,
        });
    });
});
