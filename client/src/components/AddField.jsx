import React from "react";
import { IoClose } from "react-icons/io5";

const AddField = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center mt-32 z-40 p-4">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">Add Field</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="my-3 p-2 border w-full bg-blue-50 border-primary-200 outline-none"
          placeholder="Enter field name"
        />
        <button
          onClick={() => {
            submit();
            close();
          }}
          className="bg-primary-200 hover:bg-primary-100 px-4 py-2 rounded mx-auto block"
        >
          Add field
        </button>
      </div>
    </section>
  );
};

export default AddField;
