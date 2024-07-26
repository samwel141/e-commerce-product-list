
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './features/products/productsSlice';
import { fetchCategories } from './features/categories/categoriesSlice';

function App() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.categories.items);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const productStatus = useSelector((state) => state.products.status);
  const productError = useSelector((state) => state.products.error);
  const categoryStatus = useSelector((state) => state.categories.status);
  const categoryError = useSelector((state) => state.categories.error);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === selectedCategory));
    }
  }, [products, selectedCategory]);

  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    if (sort === 'price') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'rating') {
      sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    setFilteredProducts(sortedProducts);
  }, [sort, filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (productStatus === 'loading' || categoryStatus === 'loading') {
    return <p>Loading...</p>;
  }

  if (productStatus === 'failed') {
    return <p>Error: {productError}</p>;
  }

  if (categoryStatus === 'failed') {
    return <p>Error: {categoryError}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">E-commerce Product List</h1>
      <div className="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Filter by Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-lg font-bold mb-2">{product.title}</h2>
            <p className="text-gray-700 mb-2">{product.category}</p>
            <p className="text-gray-900 font-bold">${product.price}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
