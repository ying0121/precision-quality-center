
const Stripe = require('stripe');

const Payments = require('../models/Payments');
const Invoices = require('../models/Invoices');
const util_permission = require('../utilities/permission');

// constants
const ORDER_ID = 62018002;
const USER_ID = 121;

const permission_name = ["PAYMENTS"];

exports.paymentsPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('payments');
};

// Payment Transactions routes
exports.readPayments = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const payments = await Payments.findAll();
        res.status(200).json({ status: "success", data: payments });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}
exports.deletePayment = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const payment = await Payments.findOne({ where: { id: req.body.id } });
        if (payment) {
            await Invoices.destroy({ where: { stripe_payment_intent_id: payment.stripe_payment_intent_id } });
            await Payments.destroy({ where: { stripe_payment_intent_id: payment.stripe_payment_intent_id } });
        }
        res.status(200).json({ status: "success", message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}
exports.deleteAllPayments = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await Payments.destroy({ where: {}, truncate: true });
        await Invoices.destroy({ where: {}, truncate: true });
        res.status(200).json({ status: "success", message: "All payments deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

// Invoices routes
exports.getInvoices = async (req, res) => {
    const invoices = await Invoices.findAll();
    res.status(200).json({ status: "success", data: invoices });
}
exports.deleteInvoice = async (req, res) => {
    await Invoices.destroy({ where: { id: req.params.id } });
    res.status(200).json({ status: "success", message: "Invoice deleted successfully" });
}
exports.deleteAllInvoices = async (req, res) => {
    await Invoices.destroy({ where: {} });
    res.status(200).json({ status: "success", message: "All invoices deleted successfully" });
}

// Webhook handlers
async function handlePaymentSucceeded(paymentIntent) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
    const card = paymentMethod.card || {};
    const billing = paymentMethod.billing_details || {};
    // Idempotent insert
    await Payments.create({
        stripe_payment_intent_id: paymentIntent.id,
        stripe_payment_method_id: paymentIntent.payment_method,
        user_id: paymentIntent.metadata.user_id,
        order_id: paymentIntent.metadata.order_id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: "paid",

        name: billing.name || null,
        email: billing.email || null,
        phone: billing.phone || null,
        country: billing.address.country || null,

        card_last4: card.last4 || null,
        card_exp_month: card.exp_month || null,
        card_exp_year: card.exp_year || null,

        failure_reason: null,
    });
    
    // Create PAID invoice
    await createPaidInvoice(paymentIntent);
}
async function handlePaymentFailed(paymentIntent) {
    const reason = paymentIntent.last_payment_error?.message || "unknown reason";
    await Payments.update({
        status: "failed",
        failure_reason: reason,
    }, {
        where: { stripe_payment_intent_id: paymentIntent.id }
    });
}
async function handleInvoicePaid(invoice) {
    await Invoices.create({
        stripe_invoice_id: invoice.id,
        stripe_payment_intent_id: invoice.metadata.payment_intent_id,
        stripe_payment_method_id: null,
        order_id: invoice.metadata.order_id,
        user_id: invoice.metadata.user_id,
        amount: invoice.amount_paid,
        customer_email: invoice.customer_email,
        card_last4: null,
        currency: invoice.currency,
        status: invoice.status,
        invoice_pdf: invoice.invoice_pdf,
    });
}
// Create paid invoice
async function createPaidInvoice(paymentIntent) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    let customerId = paymentIntent.customer;
  
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: paymentIntent.receipt_email,
        });
        customerId = customer.id;
    }

    // 1. create invoice item
    await stripe.invoiceItems.create({
        customer: customerId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        description: "Service payment",
    });
  
    // 2. create invoice
    const invoice = await stripe.invoices.create({
        customer: customerId,
        auto_advance: false,
        collection_method: 'charge_automatically',
        metadata: {
            payment_intent_id: paymentIntent.id,
        }
    });

    // 3. finalize invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    // 4. mark invoice as paid (out-of-band)
    await stripe.invoices.pay(finalizedInvoice.id, { paid_out_of_band: true });

    return finalizedInvoice;
}

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    const calculateOrderAmount = (items) => {
        return items.reduce((acc, item) => acc + item.amount, 0);
    };

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(req.body.items),
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            },
            metadata: {
                order_id: ORDER_ID,
                user_id: USER_ID
            }
        });
        res.json({ clientSecret: paymentIntent.client_secret, status: "success" });
    } catch (error) {
        res.status(500).json({ error: error.message, status: "error" });
    }
}
exports.stripeWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const sig = req.headers["stripe-signature"];
    let event;
  
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');

        switch (event.type) {
            case "payment_intent.succeeded":
                await handlePaymentSucceeded(event.data.object);
                break;
            case "payment_intent.payment_failed":
                await handlePaymentFailed(event.data.object);
                break;
            case "invoice.paid":
                await handleInvoicePaid(event.data.object);
                break;
        }

        return res.json({ received: true });
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
}
