import React from "react";

const CategoryButtons = ({ categories, setCategory }) => {
  return (
    <div>
      {categories.map((cat, index) => (
        <button
          key={index}
          title={`${cat.name}`}
          onClick={() => setCategory(cat.icon)}
        >
          {cat.icon}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;
