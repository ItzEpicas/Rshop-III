import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCart, User, Plus, Pencil, Trash, X, Store, LayoutGrid, Tag, ChevronLeft, MessageCircle, Save, Send, Edit, Search, CheckCircle, Percent, Package, Phone, MapPin, ImagePlus, Palette } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// --- Constants defined outside the component to prevent re-creation on re-renders ---
const ADMIN_CREDENTIALS = {
  email: 'itzepicas@gmail.com',
  password: 'sagarejo',
  role: 'admin',
  id: 'admin_123'
};

const INITIAL_PRODUCTS = [
  { id: uuidv4(), name: 'ტელეფონი', description: 'თანამედროვე სმარტფონი, შესანიშნავი კამერით.', price: 1500, originalPrice: 1500, onSale: false, category: 'ელექტრონიკა', mainImageUrls: ['https://placehold.co/600x600/3b82f6/ffffff?text=ტელეფონი+1', 'https://placehold.co/600x600/3b82f6/ffffff?text=ტელეფონი+2'], detailImageUrls: [], tags: ['სმარტფონი', 'მობილური'], colors: [{name: 'შავი', hex: '#000000'}, {name: 'თეთრი', hex: '#FFFFFF'}] },
  { id: uuidv4(), name: 'ტელევიზორი', description: '4K რეზოლუციის სმარტ ტელევიზორი.', price: 2500, originalPrice: 2500, onSale: false, category: 'ელექტრონიკა', mainImageUrls: ['https://placehold.co/600x600/3b82f6/ffffff?text=ტელევიზორი'], detailImageUrls: [], tags: ['ტექნიკა', '4k'], colors: [{name: 'შავი', hex: '#222222'}] },
  { id: uuidv4(), name: 'პლანშეტი', description: 'მძლავრი პლანშეტი საუკეთესო ეკრანით.', price: 900, originalPrice: 900, onSale: false, category: 'ელექტრონიკა', mainImageUrls: ['https://placehold.co/600x600/3b82f6/ffffff?text=პლანშეტი'], detailImageUrls: [], tags: ['ტაბლეტი', 'სენსორული'], colors: [] },
  { id: uuidv4(), name: 'ლეპტოპი', description: 'ულტრათხელი ლეპტოპი სწრაფი პროცესორით.', price: 3000, originalPrice: 3000, onSale: false, category: 'ელექტრონიკა', mainImageUrls: ['https://placehold.co/600x600/3b82f6/ffffff?text=ლეპტოპი'], detailImageUrls: [], tags: ['ნოუთბუქი', 'კომპიუტერი'], colors: [{name: 'ვერცხლისფერი', hex: '#C0C0C0'}] },
  { id: uuidv4(), name: 'ყურსასმენი', description: 'ხმაურის დამხშობი უკაბელო ყურსასმენები.', price: 250, originalPrice: 250, onSale: false, category: 'აუდიო', mainImageUrls: ['https://placehold.co/600x600/10b981/ffffff?text=ყურსასმენი'], detailImageUrls: [], tags: ['აუდიო', 'bluetooth'], colors: [] },
  { id: uuidv4(), name: 'სპიკერი', description: 'პორტატული Bluetooth სპიკერი.', price: 120, originalPrice: 120, onSale: false, category: 'აუდიო', mainImageUrls: ['https://placehold.co/600x600/10b981/ffffff?text=სპიკერი'], detailImageUrls: [], tags: ['დინამიკი', 'აუდიო'], colors: [] },
  { id: uuidv4(), name: 'მაუსი', description: 'ერგონომიული უსადენო მაუსი.', price: 50, originalPrice: 50, onSale: false, category: 'აქსესუარები', mainImageUrls: ['https://placehold.co/600x600/6366f1/ffffff?text=მაუსი'], detailImageUrls: [], tags: ['კომპიუტერი', 'აქსესუარი'], colors: [] },
  { id: uuidv4(), name: 'კლავიატურა', description: 'მექანიკური გეიმერული კლავიატურა.', price: 180, originalPrice: 180, onSale: false, category: 'აქსესუარები', mainImageUrls: ['https://placehold.co/600x600/6366f1/ffffff?text=კლავიატურა'], detailImageUrls: [], tags: ['გეიმინგი', 'კომპიუტერი'], colors: [] },
];

// --- Helper function to get item from localStorage ---
const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};


// --- Independent Components ---

const Header = ({
  setActivePage,
  setSelectedCategory,
  setSearchTerm,
  searchTerm,
  cart,
  currentUser,
  isAdmin,
  handleLogout,
}) => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center">
        <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('home'); setSelectedCategory('all'); setSearchTerm(''); }}>
          <img src="/491433009_122104507424832324_7363838094736325337_n__1_-removebg-preview.png" alt="Rshop Logo" className="h-10" />
        </a>
      <div className="hidden md:flex items-center space-x-4">
        <button onClick={() => setActivePage('sales')} className="flex items-center px-4 py-2 text-red-500 font-bold hover:text-red-700 transition">
          <Percent size={20} className="mr-2" /> აქციები
        </button>
        <button onClick={() => { setActivePage('categories'); setSearchTerm(''); }} className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition">
          <LayoutGrid size={20} className="mr-2" /> კატეგორიები
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="ძიება..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button onClick={() => setActivePage('cart')} className="p-2 relative rounded-full hover:bg-gray-100 transition">
          <ShoppingCart size={24} className="text-gray-600" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
        {currentUser ? (
          <div className="relative group">
            <button onClick={() => setActivePage('profile')} className="p-2 rounded-full hover:bg-gray-100 transition">
              <User size={24} className="text-gray-600" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block">
              <div className="p-4">
                <p className="font-semibold truncate">{currentUser.email}</p>
                <p className="text-sm text-gray-500 mb-2">{currentUser.role === 'admin' ? 'ადმინისტრატორი' : 'მომხმარებელი'}</p>
                {isAdmin && (
                  <button onClick={() => setActivePage('admin')} className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md">ადმინ პანელი</button>
                )}
                <button onClick={handleLogout} className="w-full text-left py-2 px-4 text-red-500 hover:bg-red-50 rounded-md">გამოსვლა</button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => setActivePage('login')} className="p-2 bg-blue-600 text-white rounded-lg px-4 hover:bg-blue-700 transition shadow-md">შესვლა</button>
        )}
      </div>
      <div className="md:hidden flex items-center space-x-4">
        <button onClick={() => setActivePage('cart')} className="p-2 relative rounded-full hover:bg-gray-100 transition">
          <ShoppingCart size={24} className="text-gray-600" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
        <button onClick={() => currentUser ? setActivePage('profile') : setActivePage('login')} className="p-2 rounded-full hover:bg-gray-100 transition">
          <User size={24} />
        </button>
      </div>
    </div>
  </header>
);

const BottomNavigation = ({ activePage, setActivePage, setSelectedCategory, currentUser, toggleSearchModal }) => {
    const navRef = useRef(null);
    const indicatorRef = useRef(null);
    const itemsRef = useRef([]);

    // FIX: Memoize navItems to prevent re-creating the array on every render.
    // This makes the useEffect dependency stable and prevents unnecessary re-renders.
    const navItems = useMemo(() => [
        { id: 'home', icon: Store, page: 'home' },
        { id: 'search', icon: Search, page: 'search' },
        { id: 'sales', icon: Percent, page: 'sales' },
        { id: 'categories', icon: LayoutGrid, page: 'categories' },
        { id: 'profile', icon: User, page: currentUser ? 'profile' : 'login' },
    ], [currentUser]);
    
    const pageToFind = currentUser ? activePage : (activePage === 'profile' ? 'login' : activePage);
    const activeItem = navItems.find(item => item.page === pageToFind);
    const ActiveIcon = activeItem ? activeItem.icon : null;

    useEffect(() => {
        const activeIndex = navItems.findIndex(item => item.page === pageToFind);
        if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
            const activeItemElement = itemsRef.current[activeIndex];
            const { offsetLeft, clientWidth } = activeItemElement;
            if (indicatorRef.current) {
                indicatorRef.current.style.left = `${offsetLeft + clientWidth / 2 - 32}px`;
                indicatorRef.current.style.opacity = '1';
            }
        } else if (indicatorRef.current) {
            indicatorRef.current.style.opacity = '0';
        }
    }, [pageToFind, navItems]);

    const handleNavClick = (page) => {
        if (page === 'search') {
            toggleSearchModal();
            return;
        }
        setActivePage(page);
        if (page === 'home') {
            setSelectedCategory('all');
        }
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-transparent z-50 md:hidden">
            <div ref={navRef} className="relative bg-white shadow-lg rounded-[2rem] flex justify-around items-center h-16">
                <div
                    ref={indicatorRef}
                    className="absolute -top-4 w-16 h-16 bg-rose-500 rounded-full transition-all duration-300 ease-in-out shadow-lg flex items-center justify-center"
                    style={{ zIndex: 1, opacity: 0 }}
                >
                   {ActiveIcon && <ActiveIcon size={28} className="text-white" />}
                </div>

                {navItems.map((item, index) => {
                    const isActive = item.page === pageToFind;
                    return (
                        <button
                            key={item.id}
                            ref={el => itemsRef.current[index] = el}
                            onClick={() => handleNavClick(item.page)}
                            className="relative z-10 flex flex-col items-center justify-center w-1/5 h-full"
                        >
                            <div className={`transition-opacity duration-200 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                                <item.icon size={28} className="text-gray-500" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </footer>
    );
};

const ProductCard = ({ product, setSelectedProduct, setActivePage, addToCart }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="relative aspect-w-1 aspect-h-1 w-full">
      <img src={product.mainImageUrls?.[0] || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
      {product.onSale && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">აქცია!</span>
      )}
    </div>
    <div className="p-4 flex-grow flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.description.substring(0, 50)}...</p>
      <div className="mt-auto">
        {product.onSale ? (
          <>
            <p className="text-sm text-gray-400 line-through">₾{product.originalPrice.toFixed(2)}</p>
            <p className="text-2xl font-bold text-blue-600">₾{product.price.toFixed(2)}</p>
            <p className="text-xs text-red-500 mt-1">ვადა: {new Date(product.saleEndDate).toLocaleString('ka-GE')}</p>
          </>
        ) : (
          <p className="text-2xl font-bold text-blue-600">₾{product.price.toFixed(2)}</p>
        )}
      </div>
      <div className="flex space-x-2 mt-4">
        <button onClick={() => { setSelectedProduct(product); setActivePage('product'); }} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition">დეტალები</button>
        <button onClick={() => addToCart(product)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition shadow-md">კალათაში</button>
      </div>
    </div>
  </div>
);

const SearchModal = ({ isOpen, onClose, searchTerm, setSearchTerm, products, setSelectedProduct, setActivePage }) => {
    if (!isOpen) return null;

    const filtered = searchTerm
        ? products.filter(p => {
            const term = searchTerm.toLowerCase();
            const nameMatch = p.name.toLowerCase().includes(term);
            const tagMatch = p.tags && p.tags.some(tag => tag.toLowerCase().includes(term));
            return nameMatch || tagMatch;
          })
        : [];

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setActivePage('product');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col md:hidden">
            <div className="p-4 flex items-center border-b sticky top-0 bg-white">
                <input
                    type="text"
                    placeholder="ძიება..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-2 text-lg border-none focus:ring-0"
                    autoFocus
                />
                <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-900">
                    <X size={28} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filtered.map(product => (
                    <div key={product.id} onClick={() => handleProductClick(product)} className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors">
                        <img src={product.mainImageUrls?.[0] || 'https://placehold.co/100x100/cccccc/ffffff?text=N/A'} alt={product.name} className="w-16 h-16 object-cover rounded-lg mr-4"/>
                        <div>
                            <h4 className="font-semibold text-gray-800">{product.name}</h4>
                            <p className="text-blue-600 font-bold">₾{product.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
                {searchTerm && filtered.length === 0 && (
                    <p className="p-8 text-center text-gray-500">პროდუქტი ვერ მოიძებნა.</p>
                )}
            </div>
        </div>
    );
};

const PageHome = ({ filteredProducts, selectedCategory, setSelectedProduct, setActivePage, addToCart }) => (
  <div className="p-4 md:p-8">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">
      {selectedCategory === 'all' ? 'ყველა პროდუქტი' : selectedCategory}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} setSelectedProduct={setSelectedProduct} setActivePage={setActivePage} addToCart={addToCart} />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 text-lg">
          პროდუქტი ვერ მოიძებნა.
        </div>
      )}
    </div>
  </div>
);

const PageSales = ({ products, setSelectedProduct, setActivePage, addToCart }) => {
  const saleProducts = products.filter(p => p.onSale);
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-amber-500 flex items-center">
        <Percent size={32} className="mr-2" /> აქციები
      </h2>
      {saleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {saleProducts.map(product => (
            <ProductCard key={product.id} product={product} setSelectedProduct={setSelectedProduct} setActivePage={setActivePage} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          ამჟამად აქციები არ არის.
        </div>
      )}
    </div>
  );
};

const PageCategories = ({ allCategories, selectedCategory, setSelectedCategory, setActivePage }) => (
  <div className="p-4 md:p-8">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">კატეგორიები</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {allCategories.map(category => (
        <button
          key={category}
          onClick={() => {
            setSelectedCategory(category);
            setActivePage('home');
          }}
          className={`p-4 rounded-xl text-center font-semibold text-lg transition ${
            selectedCategory === category ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-gray-100 shadow-md'
          }`}
        >
          {category === 'all' ? 'ყველა პროდუქტი' : category}
        </button>
      ))}
    </div>
  </div>
);

const PageProductDetail = ({ selectedProduct, setActivePage, addToCart }) => {
    const [mainImage, setMainImage] = useState(selectedProduct?.mainImageUrls?.[0] || '');
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        setMainImage(selectedProduct?.mainImageUrls?.[0] || '');
        setSelectedColor(null); // Reset color when product changes
    }, [selectedProduct]);

    if (!selectedProduct) return null;

    return (
        <div className="p-4 md:p-8">
            <button onClick={() => setActivePage('home')} className="mb-4 flex items-center text-gray-600 hover:text-blue-600 transition">
                <ChevronLeft size={20} className="mr-1" /> უკან
            </button>
            <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:w-1/2 p-6">
                    <img src={mainImage || 'https://placehold.co/600x600/cccccc/ffffff?text=No+Image'} alt={selectedProduct.name} className="rounded-xl w-full h-auto object-contain aspect-square mb-4 transition-all duration-300" />
                    <div className="flex space-x-2 overflow-x-auto">
                        {selectedProduct.mainImageUrls?.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt={`${selectedProduct.name} ${index + 1}`} 
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="md:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{selectedProduct.category}</p>
                    <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">{selectedProduct.description}</p>
                    
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-700 mb-2">ფერები:</h3>
                            <div className="flex space-x-2">
                                {selectedProduct.colors.map((color, index) => (
                                    <button 
                                        key={index}
                                        title={color.name}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${selectedColor?.hex === color.hex ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-baseline mb-6">
                        {selectedProduct.onSale && (
                            <p className="text-2xl text-gray-400 line-through mr-4">₾{selectedProduct.originalPrice.toFixed(2)}</p>
                        )}
                        <p className="text-5xl font-extrabold text-blue-600">₾{selectedProduct.price.toFixed(2)}</p>
                    </div>
                    {selectedProduct.onSale && (
                        <p className="text-sm text-red-500 mb-4 font-semibold">
                            ფასდაკლების ვადა: {new Date(selectedProduct.saleEndDate).toLocaleString('ka-GE')}
                        </p>
                    )}
                    <button onClick={() => addToCart(selectedProduct, selectedColor)} className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400" disabled={selectedProduct.colors.length > 0 && !selectedColor}>
                        <ShoppingCart size={20} className="inline mr-2" /> {selectedProduct.colors.length > 0 && !selectedColor ? 'აირჩიეთ ფერი' : 'კალათაში დამატება'}
                    </button>
                </div>
            </div>

            {selectedProduct.detailImageUrls && selectedProduct.detailImageUrls.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-2xl font-bold mb-4">დამატებითი სურათები</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedProduct.detailImageUrls.map((img, index) => (
                            <img key={index} src={img} alt={`Detail ${index + 1}`} className="rounded-lg w-full h-auto object-cover aspect-square" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const CheckoutDetailsModal = ({ setIsCheckoutModalOpen, completeCheckout, showNotification }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone && address) {
      completeCheckout(phone, address);
    } else {
      showNotification('გთხოვთ, შეავსოთ ყველა ველი.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full relative">
        <button onClick={() => setIsCheckoutModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">შეკვეთის გაფორმება</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">ტელეფონის ნომერი</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">მისამართი</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
            შეკვეთის დადასტურება
          </button>
        </form>
      </div>
    </div>
  );
};

const OrderConfirmModal = ({ tempOrder, setIsOrderConfirmModalOpen, setTempOrder, setActivePage, showNotification }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // FIX: Use document.execCommand('copy') for better compatibility in iFrames.
  const copyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Make the textarea invisible
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification('ID დაკოპირებულია!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showNotification('კოპირება ვერ მოხერხდა.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center relative">
        <CheckCircle size={64} className="text-blue-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2 text-gray-800">შეკვეთა წარმატებით განხორციელდა!</h3>
        {tempOrder && (
          <>
            <p className="text-gray-600 mb-4">შეკვეთის ID: <span className="font-mono font-bold">{tempOrder.id}</span></p>
            <p className="bg-amber-100 p-3 rounded-lg text-sm text-gray-800 border border-amber-300">
              გთხოვთ, დააკოპიროთ შეკვეთის ID და დაელოდეთ ოპერატორს ჩატში.
            </p>
            <button
              onClick={() => copyToClipboard(tempOrder.id)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
            >
              ID-ის კოპირება
            </button>
          </>
        )}
        <button
          onClick={() => {
            setIsOrderConfirmModalOpen(false);
            setTempOrder(null);
            setActivePage('profile');
          }}
          disabled={countdown > 0}
          className={`mt-6 px-6 py-3 rounded-lg font-bold text-white transition shadow-md w-full ${
            countdown > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {countdown > 0 ? `დახურვა (${countdown})` : 'დახურვა'}
        </button>
      </div>
    </div>
  );
};

const PageCart = ({ cart, updateCartQuantity, currentUser, setActivePage, startCheckout }) => (
  <div className="p-4 md:p-8">
    <h2 className="text-3xl font-bold mb-6">კალათა</h2>
    {cart.length === 0 ? (
      <p className="text-center text-gray-500 text-lg">თქვენი კალათა ცარიელია.</p>
    ) : (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <ul className="divide-y divide-gray-200">
          {cart.map(item => (
            <li key={item.cartItemId} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={item.mainImageUrls?.[0] || 'https://placehold.co/100x100/cccccc/ffffff?text=N/A'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  {item.selectedColor && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-4 h-4 rounded-full mr-2 border" style={{backgroundColor: item.selectedColor.hex}}></span>
                      {item.selectedColor.name}
                    </div>
                  )}
                  <p className="text-blue-600">₾{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartQuantity(item.cartItemId, parseInt(e.target.value))}
                  className="w-16 p-2 border rounded-lg text-center"
                />
                <button onClick={() => updateCartQuantity(item.cartItemId, 0)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t-2 border-gray-200 flex justify-between items-center">
          <span className="text-2xl font-bold">ჯამი: ₾{cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
          {currentUser ? (
            <button onClick={startCheckout} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
              შეკვეთის გაფორმება
            </button>
          ) : (
            <button onClick={() => setActivePage('login')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
              შესვლა შეკვეთისთვის
            </button>
          )}
        </div>
      </div>
    )}
  </div>
);

const PageAuth = ({ handleLogin, handleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister(email, password);
    } else {
      handleLogin(email, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] p-4 md:p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{isRegister ? 'რეგისტრაცია' : 'შესვლა'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="ელ. ფოსტა"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            placeholder="პაროლი"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
            {isRegister ? 'რეგისტრაცია' : 'შესვლა'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-blue-600 hover:underline">
            {isRegister ? 'უკვე გაქვთ ანგარიში? შედით' : 'არ გაქვთ ანგარიში? დარეგისტრირდით'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PageProfile = ({ currentUser, orders, handleLogout, handleUpdateProfile, setActivePage, isAdmin, showNotification }) => {
  const userOrders = orders.filter(o => o.userId === currentUser?.id);
  const [oldPassword, setOldPassword] = useState('');
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleProfileUpdateSubmit = (e) => {
    e.preventDefault();
    if (currentUser.role === 'admin') {
      if (handleUpdateProfile(newEmail, newPassword || currentUser.password)) {
        setIsEditingProfile(false);
        setNewPassword('');
        setConfirmPassword('');
      }
    } else {
      if (newPassword && !oldPassword) {
        showNotification('პაროლის შესაცვლელად აუცილებელია ძველი პაროლის მითითება.');
        return;
      }
      if (newPassword && newPassword !== confirmPassword) {
        showNotification('ახალი პაროლები არ ემთხვევა.');
        return;
      }
      if (handleUpdateProfile(newEmail, newPassword || currentUser.password, oldPassword)) {
        setIsEditingProfile(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6">ჩემი პროფილი</h2>
      {currentUser && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4">
              <User size={32} />
            </div>
            <div>
              <p className="text-xl font-bold">{currentUser.email}</p>
              <p className="text-gray-600">
                {currentUser.role === 'admin' ? 'ადმინისტრატორი' : 'მომხმარებელი'}
              </p>
            </div>
          </div>
          {isAdmin && (
            <button onClick={() => setActivePage('admin')} className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-md">
              ადმინ პანელი
            </button>
          )}
          <button onClick={handleLogout} className="mt-4 ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md">გამოსვლა</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">ანგარიშის მართვა</h3>
          <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="p-2 text-gray-500 hover:text-blue-600 transition">
            {isEditingProfile ? <X size={24} /> : <Edit size={24} />}
          </button>
        </div>
        {isEditingProfile ? (
          <form onSubmit={handleProfileUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">ახალი ელ. ფოსტა</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {!isAdmin && (
              <div>
                <label className="block text-sm font-semibold text-gray-600">ძველი პაროლი</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="შეიყვანეთ ძველი პაროლი"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-600">ახალი პაროლი</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="დატოვეთ ცარიელი თუ არ გსურთ შეცვლა"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">გაიმეორეთ პაროლი</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
              შენახვა
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <p><span className="font-semibold">ელ. ფოსტა:</span> {currentUser.email}</p>
            <p><span className="font-semibold">პაროლი:</span> ************</p>
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-4">ჩემი შეკვეთები</h3>
      {userOrders.length === 0 ? (
        <p className="text-gray-500">შეკვეთები არ არის.</p>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">შეკვეთა #{order.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'დამუშავების პროცესში' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'გაგზავნილია' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'მიწოდებულია' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <ul className="mt-2 text-sm text-gray-600 space-y-2 border-t pt-2">
                  {order.items.map(item => (
                      <li key={item.cartItemId} className="flex justify-between items-center">
                          <div>
                              <span>{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                              {item.selectedColor && (
                                  <div className="flex items-center text-xs text-gray-500">
                                      <span className="w-3 h-3 rounded-full mr-1.5 border" style={{backgroundColor: item.selectedColor.hex}}></span>
                                      {item.selectedColor.name}
                                  </div>
                              )}
                          </div>
                          {item.onSale ? (
                              <span className="text-right">
                                  <span className="line-through text-gray-500">₾{item.originalPrice.toFixed(2)}</span> <span className="font-bold text-red-600">₾{item.price.toFixed(2)}</span>
                              </span>
                          ) : (
                              <span className="font-semibold">₾{item.price.toFixed(2)}</span>
                          )}
                      </li>
                  ))}
              </ul>
              <p className="font-bold text-lg mt-2 text-right border-t pt-2">ჯამი: ₾{order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LiveChat = ({ currentUser, chatMessages, handleSendMessage, setIsChatOpen }) => {
  const [message, setMessage] = useState('');
  const chatWindowRef = useRef(null);
  const messages = chatMessages[currentUser?.id] || [];

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      handleSendMessage(message, 'admin_123');
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col z-[100]">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h5 className="font-bold text-lg">ჩატი ადმინთან</h5>
        <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-gray-800 transition">
          <X size={24} />
        </button>
      </div>
      <div ref={chatWindowRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-3 rounded-lg max-w-[70%] text-sm ${msg.isFromAdmin ? 'bg-blue-100 text-gray-800' : 'bg-blue-600 text-white'}`}>
                <p>{msg.text}</p>
                <span className="block text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-12 text-sm">საუბარი დაიწყეთ ადმინთან.</div>
        )}
      </div>
      <form onSubmit={handleUserSendMessage} className="p-4 border-t border-gray-200 flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="შეიყვანეთ შეტყობინება..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

// --- Admin Panel Components ---

const AdminHeader = ({ adminPage, setAdminPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center relative">
      <h3 className="text-xl font-bold text-gray-800">ადმინ პანელი</h3>
      <div className="hidden md:flex space-x-4">
        <button onClick={() => setAdminPage('dashboard')} className={`text-gray-600 hover:text-blue-600 ${adminPage === 'dashboard' ? 'font-bold text-blue-600' : ''}`}>პროდუქტები</button>
        <button onClick={() => setAdminPage('orders')} className={`text-gray-600 hover:text-blue-600 ${adminPage === 'orders' ? 'font-bold text-blue-600' : ''}`}>შეკვეთები</button>
        <button onClick={() => setAdminPage('users')} className={`text-gray-600 hover:text-blue-600 ${adminPage === 'users' ? 'font-bold text-blue-600' : ''}`}>მომხმარებლები</button>
        <button onClick={() => setAdminPage('categories')} className={`text-gray-600 hover:text-blue-600 ${adminPage === 'categories' ? 'font-bold text-blue-600' : ''}`}>კატეგორიები</button>
        <button onClick={() => setAdminPage('chats')} className={`text-gray-600 hover:text-blue-600 ${adminPage === 'chats' ? 'font-bold text-blue-600' : ''}`}>ჩატები</button>
      </div>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg bg-gray-200">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      </button>
      {isMenuOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 md:hidden">
          <button onClick={() => { setAdminPage('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left py-2 px-4 hover:bg-gray-100">პროდუქტები</button>
          <button onClick={() => { setAdminPage('orders'); setIsMenuOpen(false); }} className="block w-full text-left py-2 px-4 hover:bg-gray-100">შეკვეთები</button>
          <button onClick={() => { setAdminPage('users'); setIsMenuOpen(false); }} className="block w-full text-left py-2 px-4 hover:bg-gray-100">მომხმარებლები</button>
          <button onClick={() => { setAdminPage('categories'); setIsMenuOpen(false); }} className="block w-full text-left py-2 px-4 hover:bg-gray-100">კატეგორიები</button>
          <button onClick={() => { setAdminPage('chats'); setIsMenuOpen(false); }} className="block w-full text-left py-2 px-4 hover:bg-gray-100">ჩატები</button>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ products, handleEditProduct, deleteProduct, removeSale, handleApplySale, setAdminPage, setProductForm }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h4 className="text-2xl font-bold">პროდუქტების მართვა</h4>
      <button onClick={() => { setProductForm({ id: null, name: '', description: '', price: '', mainImageUrls: [], detailImageUrls: [], category: '', tags: [], colors: [] }); setAdminPage('addProduct'); }} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
        <Plus size={20} className="mr-2" /> პროდუქტის დამატება
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">დასახელება</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ფასი</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">კატეგორია</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">აქციები</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">მოქმედება</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="py-3 px-4 text-sm text-gray-800">{product.name}</td>
              <td className="py-3 px-4 text-sm text-gray-800">
                {product.onSale && <span className="text-gray-400 line-through mr-2">₾{product.originalPrice.toFixed(2)}</span>}
                <span className="font-bold">₾{product.price.toFixed(2)}</span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-800">{product.category}</td>
              <td className="py-3 px-4 text-sm text-gray-800">
                {product.onSale ? (
                  <span className="text-red-500 font-semibold">
                    დიახ ({new Date(product.saleEndDate).toLocaleDateString('ka-GE')})
                  </span>
                ) : 'არა'}
              </td>
              <td className="py-3 px-4 flex space-x-2">
                <button onClick={() => handleEditProduct(product)} className="text-amber-500 hover:text-amber-700 transition" title="რედაქტირება">
                  <Pencil size={18} />
                </button>
                <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700 transition" title="წაშლა">
                  <Trash size={18} />
                </button>
                {product.onSale ? (
                  <button onClick={() => removeSale(product.id)} className="text-blue-500 hover:text-blue-700 transition" title="ფასდაკლების მოხსნა">
                    <Tag size={18} />
                  </button>
                ) : (
                  <button onClick={() => handleApplySale(product)} className="text-blue-500 hover:text-blue-700 transition" title="ფასდაკლების დამატება">
                    <Tag size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AddProductForm = ({ productForm, setProductForm, handleProductFormSubmit, setAdminPage, showNotification }) => {
    const [tagInput, setTagInput] = useState('');
    const [colorName, setColorName] = useState('');
    const [colorHex, setColorHex] = useState('#000000');
    const [mainImageUrlInput, setMainImageUrlInput] = useState('');
    const [detailImageUrlInput, setDetailImageUrlInput] = useState('');

    const handleImageUpload = (e, target) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const filePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises)
            .then(base64Images => {
                setProductForm(prev => ({ ...prev, [target]: [...prev[target], ...base64Images] }));
            })
            .catch(error => {
                console.error("Error reading files:", error);
                showNotification("ფაილების წაკითხვისას მოხდა შეცდომა.");
            });
    };
    
    const addImageUrl = (target, url, setUrlInput) => {
        if(url.trim()){
            setProductForm(prev => ({ ...prev, [target]: [...prev[target], url.trim()] }));
            setUrlInput('');
        }
    }

    const removeImage = (index, target) => {
        setProductForm(prev => ({ ...prev, [target]: prev[target].filter((_, i) => i !== index) }));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !productForm.tags.includes(newTag)) {
                setProductForm({ ...productForm, tags: [...productForm.tags, newTag] });
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setProductForm({
            ...productForm,
            tags: productForm.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const addColor = () => {
        if (colorName.trim() && !productForm.colors.some(c => c.name === colorName.trim())) {
            setProductForm({ ...productForm, colors: [...productForm.colors, { name: colorName.trim(), hex: colorHex }] });
            setColorName('');
        } else {
            showNotification("გთხოვთ, შეიყვანოთ უნიკალური ფერის სახელი.");
        }
    };

    const removeColor = (colorNameToRemove) => {
        setProductForm({
            ...productForm,
            colors: productForm.colors.filter(c => c.name !== colorNameToRemove)
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-2xl font-bold mb-4 text-gray-800">{productForm.id ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტის დამატება'}</h4>
            <form onSubmit={handleProductFormSubmit} className="space-y-4">
                {/* Basic Info */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600">დასახელება</label>
                    <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full p-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600">აღწერა</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full p-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600">ფასი (₾)</label>
                    <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full p-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600">კატეგორია</label>
                    <input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full p-2 border rounded-lg" required />
                </div>

                {/* Main Image Upload */}
                <fieldset className="p-4 border rounded-lg bg-gray-50">
                    <legend className="text-sm font-semibold text-gray-700 px-2">მთავარი სურათები</legend>
                    <div className="flex space-x-2 mb-2">
                        <input type="text" placeholder="სურათის URL" value={mainImageUrlInput} onChange={(e) => setMainImageUrlInput(e.target.value)} className="flex-1 p-2 border rounded-lg"/>
                        <button type="button" onClick={() => addImageUrl('mainImageUrls', mainImageUrlInput, setMainImageUrlInput)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">URL-ით დამატება</button>
                    </div>
                    <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'mainImageUrls')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                        {productForm.mainImageUrls.map((img, index) => (
                            <div key={index} className="relative group">
                                <img src={img} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeImage(index, 'mainImageUrls')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* Detail Image Upload */}
                <fieldset className="p-4 border rounded-lg bg-gray-50">
                    <legend className="text-sm font-semibold text-gray-700 px-2">დეტალების სურათები</legend>
                    <div className="flex space-x-2 mb-2">
                        <input type="text" placeholder="სურათის URL" value={detailImageUrlInput} onChange={(e) => setDetailImageUrlInput(e.target.value)} className="flex-1 p-2 border rounded-lg"/>
                        <button type="button" onClick={() => addImageUrl('detailImageUrls', detailImageUrlInput, setDetailImageUrlInput)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">URL-ით დამატება</button>
                    </div>
                    <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'detailImageUrls')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                        {productForm.detailImageUrls.map((img, index) => (
                            <div key={index} className="relative group">
                                <img src={img} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeImage(index, 'detailImageUrls')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* Color Management */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">ფერები</label>
                    <div className="flex items-center space-x-2">
                        <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="p-1 h-10 w-10 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none" />
                        <input type="text" placeholder="ფერის სახელი" value={colorName} onChange={(e) => setColorName(e.target.value)} className="flex-1 p-2 border rounded-lg" />
                        <button type="button" onClick={addColor} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><Plus size={20} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {productForm.colors.map((color, index) => (
                            <div key={index} className="bg-gray-200 text-gray-800 text-sm font-medium pl-2 pr-1 py-0.5 rounded-full flex items-center">
                                <span className="w-3 h-3 rounded-full mr-1.5 border border-gray-400" style={{backgroundColor: color.hex}}></span>
                                {color.name}
                                <button type="button" onClick={() => removeColor(color.name)} className="ml-2 text-gray-600 hover:text-gray-800">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tag Management */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <label className="block text-sm font-semibold text-gray-600">თეგები (დააჭირეთ Enter-ს დასამატებლად)</label>
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="w-full p-2 border rounded-lg" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {productForm.tags.map((tag, index) => (
                            <div key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-blue-600 hover:text-blue-800">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button type="submit" className="flex-1 p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
                        <Save size={20} className="inline mr-2" /> {productForm.id ? 'განახლება' : 'დამატება'}
                    </button>
                    <button type="button" onClick={() => setAdminPage('dashboard')} className="flex-1 p-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition">
                        <X size={20} className="inline mr-2" /> გაუქმება
                    </button>
                </div>
            </form>
        </div>
    );
};

const AdminOrders = ({ orders, users, updateOrderStatus }) => {
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    return (
        <div>
            <h4 className="text-2xl font-bold mb-4">შეკვეთების მართვა</h4>
            {orders.length === 0 ? (
                <p className="text-gray-500">შეკვეთები არ არის.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg">
                            <div className="p-4 cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="font-bold text-gray-800">შეკვეთა #{order.id.substring(0, 8)}</p>
                                        <p className="text-sm text-gray-500">{users.find(u => u.id === order.userId)?.email || 'უცნობი'}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg font-bold text-blue-600">₾{order.total.toFixed(2)}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            order.status === 'დამუშავების პროცესში' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'გაგზავნილია' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'მიწოდებულია' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {expandedOrderId === order.id && (
                                <div className="p-4 border-t bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h6 className="font-semibold text-sm mb-2 text-gray-700">კლიენტის ინფორმაცია</h6>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p className="flex items-center"><Phone size={14} className="mr-2 text-gray-400"/> {order.phone}</p>
                                                <p className="flex items-center"><MapPin size={14} className="mr-2 text-gray-400"/> {order.address}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="font-semibold text-sm mb-2 text-gray-700">შეკვეთის დეტალები</h6>
                                            <ul className="space-y-1 text-sm text-gray-600">
                                                {order.items.map(item => (
                                                    <li key={item.cartItemId} className="flex justify-between">
                                                        <div>
                                                            <span>{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                                                            {item.selectedColor && (
                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    <span className="w-3 h-3 rounded-full mr-1.5 border" style={{backgroundColor: item.selectedColor.hex}}></span>
                                                                    {item.selectedColor.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {item.onSale ? (
                                                            <span className="text-right">
                                                                <span className="line-through text-gray-500">₾{item.originalPrice.toFixed(2)}</span> <span className="font-bold text-red-600">₾{item.price.toFixed(2)}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="font-semibold">₾{item.price.toFixed(2)}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t flex items-center space-x-4">
                                        <label className="text-sm font-semibold text-gray-700">სტატუსის შეცვლა:</label>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className="p-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="დამუშავების პროცესში">დამუშავების პროცესში</option>
                                            <option value="გაგზავნილია">გაგზავნილია</option>
                                            <option value="მიწოდებულია">მიწოდებულია</option>
                                            <option value="გაუქმებულია">გაუქმებულია</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const UserPasswordUpdateModal = ({ user, onClose, showNotification, handleAdminPasswordUpdate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('პაროლები არ ემთხვევა.');
      return;
    }
    handleAdminPasswordUpdate(user.id, newPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">პაროლის განახლება</h3>
        <p className="mb-4 text-gray-600">მომხმარებელი: <span className="font-semibold">{user.email}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">ახალი პაროლი</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">გაიმეორეთ პაროლი</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
            განახლება
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminUsers = ({ users, showNotification, handleAdminPasswordUpdate }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);

  const handleOpenPasswordModal = (user) => {
    setUserToUpdate(user);
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setUserToUpdate(null);
  };

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">მომხმარებლების სია</h4>
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ელ. ფოსტა</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">როლი</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">მოქმედება</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="py-3 px-4 text-sm text-gray-800">{user.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{user.email}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{user.role}</td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  <button onClick={() => handleOpenPasswordModal(user)} className="text-amber-500 hover:text-amber-700 transition" title="პაროლის განახლება">
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isPasswordModalOpen && <UserPasswordUpdateModal user={userToUpdate} onClose={handleClosePasswordModal} showNotification={showNotification} handleAdminPasswordUpdate={handleAdminPasswordUpdate} />}
    </div>
  );
};

const AdminCategories = ({ categories, updateCategory, addCategory, deleteCategory }) => {
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '' });

  const handleCategoryFormSubmit = (e) => {
    e.preventDefault();
    if (categoryForm.id) {
      updateCategory(categoryForm.id, categoryForm.name);
    } else {
      addCategory(categoryForm.name);
    }
    setCategoryForm({ id: null, name: '' });
  };

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">კატეგორიების მართვა</h4>
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h5 className="text-xl font-semibold mb-4">{categoryForm.id ? 'კატეგორიის რედაქტირება' : 'ახალი კატეგორიის დამატება'}</h5>
        <form onSubmit={handleCategoryFormSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="კატეგორიის სახელი"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            className="flex-1 p-2 border rounded-lg"
            required
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            {categoryForm.id ? <Save size={20} /> : <Plus size={20} />}
          </button>
          {categoryForm.id && (
            <button type="button" onClick={() => setCategoryForm({ id: null, name: '' })} className="p-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
              <X size={20} />
            </button>
          )}
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h5 className="text-xl font-semibold mb-4">არსებული კატეგორიები</h5>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span>{cat.name}</span>
              <div className="flex space-x-2">
                <button onClick={() => setCategoryForm(cat)} className="text-amber-500 hover:text-amber-700 transition" title="რედაქტირება">
                  <Pencil size={18} />
                </button>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:text-red-700 transition" title="წაშლა">
                  <Trash size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AdminChats = ({ users, chatMessages, handleSendMessage }) => {
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);
  const messageInputRef = useRef(null);
  const chatUsers = users.filter(u => u.role === 'user');

  const handleAdminSendMessage = (e) => {
    e.preventDefault();
    const text = messageInputRef.current.value;
    if (text && selectedChatUserId) {
      handleSendMessage(text, selectedChatUserId);
      messageInputRef.current.value = '';
    }
  };

  const ChatList = () => (
    <div className="w-full md:w-1/3 bg-white rounded-xl p-4 md:p-6 shadow-inner">
      <h5 className="text-xl font-bold mb-4">მომხმარებლები</h5>
      {chatUsers.length > 0 ? (
        <ul className="space-y-2">
          {chatUsers.map(user => (
            <li
              key={user.id}
              onClick={() => setSelectedChatUserId(user.id)}
              className={`p-3 rounded-lg cursor-pointer transition ${selectedChatUserId === user.id ? 'bg-blue-100 shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <p className="font-semibold">{user.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">მომხმარებლები არ არიან.</p>
      )}
    </div>
  );

  const ChatWindow = () => {
    const messages = chatMessages[selectedChatUserId] || [];
    const chatWindowRef = useRef(null);

    useEffect(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, [messages]);

    return (
      <div className="w-full md:w-2/3 h-[500px] flex flex-col bg-white rounded-xl shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h5 className="font-bold text-lg">{users.find(u => u.id === selectedChatUserId)?.email || 'აირჩიეთ ჩატი'}</h5>
        </div>
        <div ref={chatWindowRef} className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length > 0 ? (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-3 rounded-lg max-w-[70%] text-sm ${msg.isFromAdmin ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}>
                  <p>{msg.text}</p>
                  <span className="block text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 mt-12">აირჩიეთ ჩატი საუბრის დასაწყებად.</div>
          )}
        </div>
        <form onSubmit={handleAdminSendMessage} className="p-4 border-t border-gray-200 flex space-x-2">
          <input
            type="text"
            ref={messageInputRef}
            placeholder="შეიყვანეთ შეტყობინება..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedChatUserId}
          />
          <button type="submit" disabled={!selectedChatUserId} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            <Send size={20} />
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <ChatList />
      <ChatWindow />
    </div>
  );
};

const SaleModal = ({ selectedProductForSale, setIsSaleModalOpen, handleSaleModalSubmit, showNotification }) => {
  const [discount, setDiscount] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const selectedEndDate = new Date(endDate);
    if (discount && !isNaN(discount) && discount > 0 && discount <= 100 && endDate && selectedEndDate > now) {
      handleSaleModalSubmit(discount, endDate);
    } else {
      showNotification('გთხოვთ, შეიყვანოთ სწორი პროცენტული მნიშვნელობა და ვადა, რომელიც მომავალშია.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full relative">
        <button onClick={() => setIsSaleModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">ფასდაკლების დამატება</h3>
        <p className="mb-4 text-gray-600">პროდუქტი: <span className="font-semibold">{selectedProductForSale?.name}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">ფასდაკლება (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="1"
              max="100"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">ვადის გასვლის თარიღი</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="flex-1 p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
              დამატება
            </button>
            <button type="button" onClick={() => setIsSaleModalOpen(false)} className="flex-1 p-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition">
              გაუქმება
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PageAdmin = ({
  products,
  orders,
  users,
  categories,
  chatMessages,
  addProduct,
  updateProduct,
  deleteProduct,
  applySale,
  removeSale,
  updateOrderStatus,
  addCategory,
  updateCategory,
  deleteCategory,
  handleAdminPasswordUpdate,
  handleSendMessage,
  showNotification
}) => {
  const [adminPage, setAdminPage] = useState('dashboard');
  const [productForm, setProductForm] = useState({ id: null, name: '', description: '', price: '', mainImageUrls: [], detailImageUrls: [], category: '', tags: [], colors: [] });
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedProductForSale, setSelectedProductForSale] = useState(null);

  const handleProductFormSubmit = (e) => {
    e.preventDefault();
    if (productForm.id) {
      updateProduct(productForm);
    } else {
      addProduct(productForm);
    }
    setProductForm({ id: null, name: '', description: '', price: '', mainImageUrls: [], detailImageUrls: [], category: '', tags: [], colors: [] });
    setAdminPage('dashboard');
  };

  const handleEditProduct = (product) => {
    setProductForm({ ...product, price: product.originalPrice.toString(), tags: product.tags || [], colors: product.colors || [], mainImageUrls: product.mainImageUrls || [], detailImageUrls: product.detailImageUrls || [] });
    setAdminPage('addProduct');
  };

  const handleApplySale = (product) => {
    setSelectedProductForSale(product);
    setIsSaleModalOpen(true);
  };

  const handleSaleModalSubmit = (discount, endDate) => {
    if (selectedProductForSale && discount) {
      applySale(selectedProductForSale.id, parseFloat(discount), endDate);
    }
    setIsSaleModalOpen(false);
    setSelectedProductForSale(null);
  };

  const renderAdminPage = () => {
    switch (adminPage) {
      case 'dashboard':
      case 'products':
        return <AdminDashboard products={products} handleEditProduct={handleEditProduct} deleteProduct={deleteProduct} removeSale={removeSale} handleApplySale={handleApplySale} setAdminPage={setAdminPage} setProductForm={setProductForm} />;
      case 'addProduct':
        return <AddProductForm productForm={productForm} setProductForm={setProductForm} handleProductFormSubmit={handleProductFormSubmit} setAdminPage={setAdminPage} showNotification={showNotification} />;
      case 'orders':
        return <AdminOrders orders={orders} users={users} updateOrderStatus={updateOrderStatus} />;
      case 'users':
        return <AdminUsers users={users} showNotification={showNotification} handleAdminPasswordUpdate={handleAdminPasswordUpdate} />;
      case 'categories':
        return <AdminCategories categories={categories} updateCategory={updateCategory} addCategory={addCategory} deleteCategory={deleteCategory} />;
      case 'chats':
        return <AdminChats users={users} chatMessages={chatMessages} handleSendMessage={handleSendMessage} />;
      default:
        return <AdminDashboard products={products} handleEditProduct={handleEditProduct} deleteProduct={deleteProduct} removeSale={removeSale} handleApplySale={handleApplySale} setAdminPage={setAdminPage} setProductForm={setProductForm} />;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <AdminHeader adminPage={adminPage} setAdminPage={setAdminPage} />
      <div className="mt-6 p-4 bg-gray-50 rounded-xl min-h-[70vh]">
        {renderAdminPage()}
      </div>
      {isSaleModalOpen && <SaleModal selectedProductForSale={selectedProductForSale} setIsSaleModalOpen={setIsSaleModalOpen} handleSaleModalSubmit={handleSaleModalSubmit} showNotification={showNotification} />}
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  // --- State Initialization with Lazy Loading from localStorage ---
  const [products, setProducts] = useState(() => getStorageItem('products', INITIAL_PRODUCTS));
  const [users, setUsers] = useState(() => {
    const storedUsers = getStorageItem('users', []);
    if (!storedUsers.some(user => user.email === ADMIN_CREDENTIALS.email)) {
      return [...storedUsers, ADMIN_CREDENTIALS];
    }
    return storedUsers;
  });
  const [currentUser, setCurrentUser] = useState(() => getStorageItem('currentUser', null));
  const [cart, setCart] = useState(() => getStorageItem('cart', []));
  const [orders, setOrders] = useState(() => getStorageItem('orders', []));
  const [chatMessages, setChatMessages] = useState(() => getStorageItem('chatMessages', {}));
  const [categories, setCategories] = useState(() => getStorageItem('categories', []));
  
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState(false);
  const [tempOrder, setTempOrder] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // --- Effects to save state changes to localStorage ---
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('chatMessages', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);

  // --- Effect for checking sale expiration ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let changed = false;
      const updatedProducts = products.map(p => {
        if (p.onSale && p.saleEndDate && new Date(p.saleEndDate) < now) {
          changed = true;
          return { ...p, price: p.originalPrice, onSale: false, saleEndDate: null };
        }
        return p;
      });
      if (changed) {
        setProducts(updatedProducts);
        showNotification('ფასდაკლების ვადა ამოიწურა ზოგიერთ პროდუქტზე.');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [products]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setActivePage(user.role === 'admin' ? 'admin' : 'home');
      showNotification(`მოგესალმებით, ${email}!`);
      return true;
    }
    showNotification('არასწორი ელ. ფოსტა ან პაროლი.');
    return false;
  };

  const handleRegister = (email, password) => {
    if (users.some(u => u.email === email)) {
      showNotification('მომხმარებელი ამ ელ. ფოსტით უკვე არსებობს.');
      return false;
    }
    const newUser = { id: uuidv4(), email, password, role: 'user' };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setActivePage('home');
    showNotification('რეგისტრაცია წარმატებით დასრულდა.');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActivePage('home');
    setNotification(null);
    setIsChatOpen(false);
  };

  const addToCart = (product, selectedColor = null) => {
    const cartItemId = `${product.id}-${selectedColor ? selectedColor.hex : 'default'}`;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, selectedColor, cartItemId }];
    });
    showNotification(`${product.name} ${selectedColor ? `(${selectedColor.name})` : ''} დაემატა კალათაში.`);
  };

  const updateCartQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.cartItemId !== cartItemId));
    } else {
      setCart(cart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      ));
    }
  };

  const startCheckout = () => {
    if (cart.length === 0) {
      showNotification('კალათა ცარიელია!');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const completeCheckout = (phone, address) => {
    const newOrder = {
      id: uuidv4(),
      userId: currentUser?.id,
      items: cart,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'დამუშავების პროცესში',
      phone,
      address,
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    setTempOrder(newOrder);
    setIsCheckoutModalOpen(false);
    setIsOrderConfirmModalOpen(true);
  };

  const handleSendMessage = (text, recipientId) => {
    if (!text.trim()) return;
    const senderId = currentUser?.id;
    const isUserSending = currentUser?.role !== 'admin';
    const chatId = isUserSending ? senderId : recipientId;
    const newChatMessages = { ...chatMessages };
    if (!newChatMessages[chatId]) {
      newChatMessages[chatId] = [];
    }
    newChatMessages[chatId].push({
      id: uuidv4(),
      sender: senderId,
      text,
      timestamp: new Date().toISOString(),
      isFromAdmin: !isUserSending
    });
    setChatMessages(newChatMessages);
  };

  const addProduct = (product) => {
    const priceAsNumber = parseFloat(product.price);
    if (isNaN(priceAsNumber)) {
        showNotification('ფასი არასწორია.');
        return;
    }
    setProducts([...products, { ...product, id: uuidv4(), price: priceAsNumber, originalPrice: priceAsNumber, onSale: false, tags: product.tags || [], colors: product.colors || [], mainImageUrls: product.mainImageUrls || [], detailImageUrls: product.detailImageUrls || [] }]);
    showNotification('პროდუქტი წარმატებით დაემატა.');
  };

  const updateProduct = (updatedProductFromForm) => {
    const newPrice = parseFloat(updatedProductFromForm.price);
    if (isNaN(newPrice)) {
        showNotification('ფასი არასწორია.');
        return;
    }
    
    const fullUpdatedProduct = { 
        ...updatedProductFromForm, 
        price: newPrice, 
        originalPrice: newPrice, // Editing a product sets a new base price
        onSale: false, // Editing a product removes any existing sale
        saleEndDate: null,
        tags: updatedProductFromForm.tags || [], 
        colors: updatedProductFromForm.colors || [], 
        mainImageUrls: updatedProductFromForm.mainImageUrls || [], 
        detailImageUrls: updatedProductFromForm.detailImageUrls || [] 
    };

    setProducts(products.map(p =>
      p.id === fullUpdatedProduct.id ? fullUpdatedProduct : p
    ));

    // FIX: Correctly update items in the cart. This preserves cart-specific properties
    // like quantity and selectedColor while updating the product details.
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === fullUpdatedProduct.id) {
          return {
            ...item, // Keep quantity, selectedColor, cartItemId
            // Update with new product data
            name: fullUpdatedProduct.name,
            description: fullUpdatedProduct.description,
            price: fullUpdatedProduct.price,
            originalPrice: fullUpdatedProduct.originalPrice,
            onSale: fullUpdatedProduct.onSale,
            saleEndDate: fullUpdatedProduct.saleEndDate,
            category: fullUpdatedProduct.category,
            mainImageUrls: fullUpdatedProduct.mainImageUrls,
            detailImageUrls: fullUpdatedProduct.detailImageUrls,
            tags: fullUpdatedProduct.tags,
            colors: fullUpdatedProduct.colors,
          };
        }
        return item;
      })
    );

    showNotification('პროდუქტი განახლდა.');
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    showNotification('პროდუქტი წაიშალა.');
  };

  const applySale = (productId, discountPercent, endDate) => {
    let updatedProduct = null;
    const newProducts = products.map(p => {
      if (p.id === productId) {
        const newPrice = p.originalPrice * (1 - discountPercent / 100);
        updatedProduct = { ...p, price: parseFloat(newPrice.toFixed(2)), onSale: true, saleEndDate: endDate };
        return updatedProduct;
      }
      return p;
    });

    setProducts(newProducts);

    if (updatedProduct) {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, ...updatedProduct } : item
        )
      );
    }
    showNotification(`ფასდაკლება წარმატებით დაემატა.`);
  };

  const removeSale = (productId) => {
    let updatedProduct = null;
    const newProducts = products.map(p => {
      if (p.id === productId) {
        updatedProduct = { ...p, price: p.originalPrice, onSale: false, saleEndDate: null };
        return updatedProduct;
      }
      return p;
    });
    
    setProducts(newProducts);
    
    if (updatedProduct) {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, ...updatedProduct } : item
        )
      );
    }
    showNotification('ფასდაკლება მოხსნილია.');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    showNotification('შეკვეთის სტატუსი შეიცვალა.');
  };

  const addCategory = (categoryName) => {
    const trimmedName = categoryName.trim();
    if (trimmedName && !categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      setCategories([...categories, { id: uuidv4(), name: trimmedName }]);
      showNotification('კატეგორია წარმატებით დაემატა.');
    } else {
      showNotification('ასეთი კატეგორია უკვე არსებობს.');
    }
  };

  const updateCategory = (categoryId, newName) => {
    const trimmedName = newName.trim();
    if (trimmedName && !categories.some(cat => cat.id !== categoryId && cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      setCategories(categories.map(cat => cat.id === categoryId ? { ...cat, name: trimmedName } : cat));
      showNotification('კატეგორია წარმატებით განახლდა.');
    } else {
      showNotification('ასეთი კატეგორია უკვე არსებობს.');
    }
  };

  const deleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    showNotification('კატეგორია წაიშალა.');
  };

  const handleUpdateProfile = (newEmail, newPassword, oldPassword = null) => {
    if (currentUser.role !== 'admin' && oldPassword && currentUser.password !== oldPassword) {
      showNotification('ძველი პაროლი არასწორია.');
      return false;
    }
    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, email: newEmail, password: newPassword } : u);
    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, email: newEmail, password: newPassword });
    showNotification('პროფილი წარმატებით განახლდა.');
    return true;
  };

  const handleAdminPasswordUpdate = (userId, newPassword) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, password: newPassword } : u);
    setUsers(updatedUsers);
    showNotification(`მომხმარებლის ID:${userId.substring(0, 8)} პაროლი წარმატებით განახლდა.`);
  };

  const toggleSearchModal = () => setIsSearchModalOpen(prev => !prev);

  const isAdmin = currentUser?.role === 'admin';
  const isUser = currentUser?.role === 'user';

  const productCategories = [...new Set(products.map(p => p.category))];
  const adminCategories = categories.map(c => c.name);
  const allCategories = ['all', ...new Set([...productCategories, ...adminCategories])];

  const filteredProducts = products.filter(product => {
      const term = searchTerm.toLowerCase();
      if (!term) {
          return selectedCategory === 'all' || product.category === selectedCategory;
      }
      const nameMatch = product.name.toLowerCase().includes(term);
      const tagMatch = product.tags && product.tags.some(tag => tag.toLowerCase().includes(term));
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      return (nameMatch || tagMatch) && categoryMatch;
  });

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <PageHome filteredProducts={filteredProducts} selectedCategory={selectedCategory} setSelectedProduct={setSelectedProduct} setActivePage={setActivePage} addToCart={addToCart} />;
      case 'sales': return <PageSales products={products} setSelectedProduct={setSelectedProduct} setActivePage={setActivePage} addToCart={addToCart} />;
      case 'categories': return <PageCategories allCategories={allCategories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setActivePage={setActivePage} />;
      case 'product': return <PageProductDetail selectedProduct={selectedProduct} setActivePage={setActivePage} addToCart={addToCart} />;
      case 'cart': return <PageCart cart={cart} updateCartQuantity={updateCartQuantity} currentUser={currentUser} setActivePage={setActivePage} startCheckout={startCheckout} />;
      case 'profile': return <PageProfile currentUser={currentUser} orders={orders} handleLogout={handleLogout} handleUpdateProfile={handleUpdateProfile} setActivePage={setActivePage} isAdmin={isAdmin} showNotification={showNotification} />;
      case 'login':
      case 'register': return <PageAuth handleLogin={handleLogin} handleRegister={handleRegister} />;
      case 'admin': return isAdmin ? <PageAdmin products={products} orders={orders} users={users} categories={categories} chatMessages={chatMessages} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} applySale={applySale} removeSale={removeSale} updateOrderStatus={updateOrderStatus} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} handleAdminPasswordUpdate={handleAdminPasswordUpdate} handleSendMessage={handleSendMessage} showNotification={showNotification} /> : <PageHome filteredProducts={filteredProducts} selectedCategory={selectedCategory} setSelectedProduct={setSelectedProduct} setActivePage={setActivePage} addToCart={addToCart} />;
      default: return <PageHome filteredProducts={filteredProducts} selectedCategory={selectedCategory} setSelectedProduct={setSelectedProduct} setActivePage={setActivePage} addToCart={addToCart} />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen text-gray-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;700&display=swap');
        body { font-family: 'Noto Sans Georgian', sans-serif; }
      `}</style>
      <Header
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        cart={cart}
        currentUser={currentUser}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
      />
      <main className="container mx-auto pb-24 md:pb-8">
        {renderPage()}
      </main>
      <BottomNavigation
        activePage={activePage}
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
        currentUser={currentUser}
        toggleSearchModal={toggleSearchModal}
      />
       <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={toggleSearchModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        products={products}
        setSelectedProduct={setSelectedProduct}
        setActivePage={setActivePage}
      />
      {notification && (
        <div className="fixed bottom-24 md:bottom-4 left-1/2 -translate-x-1/2 p-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl z-[101] transition-all duration-300">
          {notification}
        </div>
      )}
      {isCheckoutModalOpen && <CheckoutDetailsModal setIsCheckoutModalOpen={setIsCheckoutModalOpen} completeCheckout={completeCheckout} showNotification={showNotification} />}
      {isOrderConfirmModalOpen && <OrderConfirmModal tempOrder={tempOrder} setIsOrderConfirmModalOpen={setIsOrderConfirmModalOpen} setTempOrder={setTempOrder} setActivePage={setActivePage} showNotification={showNotification} />}

      {isUser && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-24 md:bottom-4 right-4 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
          title="ჩატი ადმინთან"
        >
          <MessageCircle size={28} />
        </button>
      )}
      {isUser && isChatOpen && <LiveChat currentUser={currentUser} chatMessages={chatMessages} handleSendMessage={handleSendMessage} setIsChatOpen={setIsChatOpen} />}
    </div>
  );
};

export default App;
