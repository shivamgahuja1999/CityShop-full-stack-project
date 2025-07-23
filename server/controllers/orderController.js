import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import CartProductModel from "../models/cartProductModel.js";
import mongoose from "mongoose";
import Stripe from "../config/stripe.js";

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId;
    const { listOfItems, totalAmount, subTotalAmount, addressId } =
      request.body;
    // console.log("list of items",listOfItems)
    // console.log("total Amount",totalAmount)
    // console.log("Sub total amount",subTotalAmount)
    // console.log("addressId",addressId)

    // const gstPercentage = 18;
    // const gstAmount = Math.round((subTotalAmount * gstPercentage) / 100);

    const payload = listOfItems.map((e1) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: e1.productId._id,
        product_details: {
          name: e1.productId.name,
          image: e1.productId.image,
        },
        payment_id: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmount,
        totalAmt: totalAmount,
      };
    });
    const generatedOrder = await OrderModel.insertMany(payload);
    // Remove from the cart
    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });
    const updateUser = await UserModel.updateOne(
      { _id: userId },
      { $set: { shopping_cart: [] } }
    );
    return response.json({
      message: "Order Successfull",
      data: generatedOrder,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

const PriceAfterDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);
  return actualPrice;
};
export async function OnlinePaymentOrderController(request, response) {
  try {
    const userId = request.userId;
    const { listOfItems, totalAmount, subTotalAmount, addressId } =
      request.body;
    const user = await UserModel.findById(userId);
    const line_items = listOfItems.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount:
            PriceAfterDiscount(item.productId.price, item.productId.discount) *
            100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };
    const session = await Stripe.checkout.sessions.create(params);
    console.log("Webhook userId:", session.metadata.userId);
    return response.status(200).json(session);
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

const getOrderProduct = async (lineItems, userId,addressId,paymentId,payment_status) => {
  const productList = [];
  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);
      // console.log("item",item)
      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.image,
        },
        paymentId: paymentId,
        payment_status:payment_status,
        delivery_address: addressId,
        subTotalAmt: item.amount_subtotal / 100,
        totalAmt: item.amount_total / 100, //amount_total
      };
      productList.push(payload);
    }
  }
  return productList;
};

// http://localhost:8080/api/order/webhook
export async function WebhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_KEY;
  console.log("event", event);
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata.userId;
      const orderProduct = await getOrderProduct(
          lineItems,
          userId,
          session.metadata.addressId,
          session.payment_intent,
          session.payment_status
        );
      console.log(orderProduct)
      console.log(lineItems)
      const order = await OrderModel.insertMany(orderProduct);
      if (Boolean(order[0])) {
        const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
          $set: { shopping_cart: [] },
        });
        const removeCartProductDB =await CartProductModel.deleteMany({userId:userId});
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.json({ received: true });
}

export async function GetOrderDetailsController(request,response) {
  try {
    const userId=request.userId
    const orderList=await OrderModel.find({userId:userId}).sort({createdAt:-1}).populate("delivery_address")
    return response.json({
      message:"order-list",
      success:true,
      error:false,
      data:orderList
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error:true,
      success:false
    })
  }
}
