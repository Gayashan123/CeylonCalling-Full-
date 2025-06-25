// UpdateShop.jsx
const UpdateShop = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold">Update Shop Details</h2>
      <input className="input" placeholder="New Shop Name" />
      <input className="input" placeholder="New Location" />
      <input className="input" placeholder="New Active Time" />
      <button className="btn mt-2">Update Shop</button>
    </div>
  );
};

// UpdateFood.jsx
const UpdateFood = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold">Update Food Details</h2>
      <input className="input" placeholder="Update Food Name" />
      <input className="input" placeholder="Update Food Price" />
      <button className="btn mt-2">Update Food</button>
    </div>
  );
};
