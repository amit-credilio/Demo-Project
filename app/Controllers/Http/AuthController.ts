import User from "App/Models/User";
import userValidator from "App/Validators/CreateUserValidator";

export default class AuthController {

    public async register({ request, response }) {
        try {
            // Validate request
            const payload = await request.validate(userValidator);

            // Check user already exists
            const { email } = payload;
            const userExists = await User.findBy('email', email)
            if(userExists) {
                return response.status(403).send({
                    message: `Email ${email} already registered. Please try diffrent email id`
                });
            }

            // create new user
            await User.create(payload)
            response.status(201).send({
                message: `${email} registered !!`
            })

        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async login({ auth, request, response }) {
        
        try {
            // Check user data
            const payload = await request.validate(userValidator);

            const { email, password } = payload;

            try {
                // verify the use and password  
                const token = await auth.use('api').attempt(email, password);
                
                // return the api token
                return response.status(200).send({
                    message: `login successful`,
                    token: token
                });    
            } catch {
                return response.status('401').send({
                    message: `Invalid credentials`
                });
            }
        } catch (error) {
            response.badRequest(error.messages)
        }        
    }

    public async logout({ auth, request ,response}) {
        try {
            if(!request.header('authorization')) {
                throw new Error("Token is not present in request header!!");
            }
            
            await auth.use('api').revoke();
            return response.status(200).send({
                message: `User logout!!`
            })    
        } catch (error) {
            response.badRequest(error.message)
        }
        
    } 
}
