import React from 'react'
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <section className="min-h-[76vh]  flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600">❌ Order Cancelled</h1>
        <p className="mt-4 text-gray-700">
          Sorry, something went wrong and your order could not be completed.
        </p>
        <Link
          to="/checkout"
          className="inline-block mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </Link>
      </div>
    </section>
  )
}

export default Cancel
