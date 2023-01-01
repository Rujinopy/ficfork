import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from "@prisma/client";
import Stripe from 'stripe';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //listen for webhook events
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.log(err);
        
        res.status(400).send(`Webhook Error: ${err}`);
    }
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        console.log("checkout.session.completed");
        
        // Fulfill the purchase...
        
        
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true })

}

async function handleCheckoutSession(session: any) {
console.log(session);

    // const user = await prisma.post.findUnique({
    //     where: {
    //         id: session.client_reference_id
    //     }
    // }).finally(async () => {
    //     await prisma.$disconnect()
    // })
    // if (user?.funding) {
    //     const newFund = user?.funding + session.amount_total;
    //     const updatedUser = await prisma.post.update({
    //         where: {
    //             id: session.client_reference_id
    //         },
    //         data: {
    //             funding: newFund
    //         }
    //     }).then(() => {
    //         console.log('Success')
    //     }).catch((err) => {
    //         console.log(err)
    //     }).finally(async () => {
    //         await prisma.$disconnect()
    //     }

    //     )
    // }
    // if (user?.funding === null) {
    //     const newFund = session.amount_total;
    //     const updatedUser = await prisma.post.update({
    //         where: {
    //             id: session.client_reference_id
    //         },
    //         data: {
    //             funding: newFund
    //         }
    //     }).then(() => {
    //         console.log('Success')
    //     }).catch((err) => {
    //         console.log(err)
    //     }).finally(async () => {
    //         await prisma.$disconnect()
    //     }
    //     )
    // }
}