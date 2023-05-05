import { appDataSource } from '../db/data-source';
import { Repository } from 'typeorm';
import { User } from '../src/resources/user/user.entity';
import {ServiceResponse} from '../src/utils/service-response'
import { create, findUserByEmail, findUserById, removeById} from '../src/resources/user/user.service';

describe('User service', function() {   
    let userRepo: Repository<User>;
    beforeAll(async () => {
        try {
            await appDataSource.initialize();
            userRepo = appDataSource.getRepository(User);
            return;
        } catch (error) {
            console.log('************* Database initialization failed ******************');
            console.log(error.message);
            return;
        }
    }, 30000);

    afterAll(async () => {
        await userRepo.clear()
        return appDataSource.destroy();
    });

    beforeEach(async () => {
        await userRepo.clear();
        return;
    });

    it('should create a new user', async function() {
        try {
            const response:ServiceResponse = await create({
                firstName: 'Shouvik',
                lastName: 'Mandal',
                email: 'shouvik0013@gmail.com',
                password: 'password@123'
            });

            expect(response).toHaveProperty('success', true);
        } catch (error) {
            
        }
    });

    it(`should not create user with same email id`, async () => {
        //* CREATING first user
        await create({
            firstName: 'Shouvik',
            lastName: 'Mandal',
            email: 'shouvik0013@gmail.com',
            password: 'password@123'
        });

        const response: ServiceResponse = await create({
            firstName: 'Rohon',
            lastName: 'Mandal',
            email: 'shouvik0013@gmail.com',
            password: 'password@123'
        });

        expect(response.success).toEqual(false);
        expect(response.data).toBeInstanceOf(Error)
    })

})