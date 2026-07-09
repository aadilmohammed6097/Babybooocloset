import { supabase } from "../lib/supabase";

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export async function createRazorpayOrder(
  amount: number,
  receipt: string
): Promise<RazorpayOrder> {
  const { data, error } = await supabase.functions.invoke(
    "create-razorpay-order",
    {
      body: {
        amount,
        receipt,
      },
    }
  );

  if (error) {
    throw error;
  }

  return data as RazorpayOrder;
}

export async function startPayment(
    amount: number,
    receipt: string
  ) {
    const order = await createRazorpayOrder(amount, receipt);
  
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  
      amount: order.amount,
  
      currency: order.currency,
  
      name: "BabybooCloset",
  
      description: "Baby Clothing Purchase",
  
      order_id: order.id,
  
      handler: function (response: any) {
        console.log("Payment Success");
  
        console.log(response);
      },
  
      prefill: {},
  
      theme: {
        color: "#F97316",
      },
    };
  
    const razorpay = new window.Razorpay(options);
  
    razorpay.open();
  }