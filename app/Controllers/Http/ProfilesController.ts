import Database from "@ioc:Adonis/Lucid/Database";
import Profile from "App/Models/Profile";
import ProfileValidator from "App/Validators/CreateProfileValidator";

export default class ProfilesController {

    // Create profile
    public async store({ auth, request, response }) {
        try {
            // Validate profile input
            const payload = await request.validate(ProfileValidator)
            
            // Check profile is already present or not
            const user = await auth.use('api').user;
            const existingProfile = await Profile.findBy('user_id', user.id);
            
            if(existingProfile) {
                throw new Error(`Profile detail already exists for user ${user.email}`);
            }

            // Create profile
            payload.userId = user.id;
            console.log(payload);
            await Profile.create(payload);
            
            return response.status(201).send({
                message: `Profile added!!`
            })

        } catch (error) {
            response.badRequest({
                message: error.message
            })
        }        
    }

    // View profile
    public async show({ auth, response}) {
        try {
            const user = await auth.use('api').user
            
            const data = await Database.query().select('name', 'email', 'dob', 'gender').from('users').leftJoin('profiles', 'users.id', 'profiles.user_id').where('users.id', user.id).first();
            
            return data;

        } catch (error) {
            response.status(500).send({
                message: error.message
            })
        }
    }

    // Update profile
    public async update({ auth, request, response} ) {
        
        try {
            // Validate the user input
            const payload = await request.validate(ProfileValidator);

            // Check if profile already exits or not
            const user = auth.use('api').user;
            const userProfile = await Profile.findByOrFail('user_id', user.id);

            // Update the existing profile
            await Profile.query().where('id', userProfile.id).update(payload);
            return response.status(200).send({
                message: `Profile detail updated!!`
            })

        } catch (error) {
            response.badRequest({
                message: error.message
            })
        }

    }

    // Delete profile
    public async destroy({request, response}) {
        try {
            // check user input
            console.log(request);
            const mobile = request.input('mobile');
            if(!mobile) {
                throw new Error("mobile number is required to delete profile");                
            }
            console.log(mobile);
            
            // Check profile exists or not
            const profile = await Profile.findBy('mobile', mobile);
            if(!profile) {
                throw new Error("User profile is not present");                
            }

            // Delete the profile
            await profile.delete();
            return response.status(200).send({
                message: `Profile deleted !!`
            })

        } catch (error) {
            response.badRequest({
                message: error.message
            })
        }
    }
}
