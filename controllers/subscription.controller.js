// controllers/subscription.controller.js
import Subscription from '../models/subscription.model.js';

const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            userId: req.user._id,  // Ensure it's 'userId' as per model
        });

        return res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};


const getUserSubscriptions = async (req, res, next) =>{
     
    try {
        console.log(req.user.id, req.params.userId);
        if(req.user.id !== req.params.userId){
            return res.status(403).json({
                success: false,
                message: 'You are not the owner of this account',
            });
        }
        const subscriptions = await Subscription.find({ userId: req.params.userId });
        res.status(200).json({success: true, data: subscriptions});
    } catch (error) {
        next(error);
    }
} 

export { createSubscription, getUserSubscriptions };
