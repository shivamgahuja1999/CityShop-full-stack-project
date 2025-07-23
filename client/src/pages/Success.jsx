import React from "react";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
    const location=useLocation()
    
  return (
    <section className="min-h-[76vh] flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white p-10 rounded shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">🎉{location?.state?.text ? location.state.text : "Payment"} Successful!</h1>
        <p className="mt-4 text-gray-700">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  )
}

export default Success
