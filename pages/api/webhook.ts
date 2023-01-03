import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from "@prisma/client";
import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-08-01',
    });

const prisma = new PrismaClient();
const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    }
}

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    //listen for webhook events
 
   if (req.method === "POST") {
    const buf = await buffer(req)
    const sig = req.headers["stripe-signature"]!

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf.toString(), sig!, webhookSecret!)
        // console.log(event);
    }
    catch(err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"

        if (err! instanceof Error) console.log(err.message);
        // console.log(`Error message: ${errorMessage}`);

        res.status(400).send(`Webhook error: ${err}`)
        return
    }
    console.log("Success: ", event.id);
    //handle the checkout.session.completed event
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // console.log("PaymentIntent status: ", paymentIntent.status)
    }
    else {
        // console.warn(`Unhandled event type ${event.type}`)
    }
    
    res.json({received: true})
} else {
        console.log("Method not allowed");
        res.setHeader("Allow", "POST")
        res.status(405).end("Method not allowed")
    }
}

const cors = Cors({
    allowMethods: ['POST', 'HEAD'],
})

export default cors(webhookHandler as any)