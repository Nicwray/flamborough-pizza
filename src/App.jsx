import React, { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Clock, ShoppingBag, Mail, Facebook, ArrowUp, Plus, Minus, X, Trash2, ArrowLeft, ChevronRight, Bike, Store, Search, CheckCircle, AlertCircle, CreditCard, User, Home, Lock, Banknote, Calendar, AlertTriangle, Volume2, VolumeX, Edit2 } from 'lucide-react';

// --- Configuration & Data ---

const BUSINESS_INFO = {
  name: "Flamborough Pizza",
  tagline: "Authentic Sourdough Taste",
  // API URL for creating checkout sessions
  checkoutUrl: "https://www.flamboroughpizza.co.uk/_functions/checkout",
  menuUrl: "https://www.flamboroughpizza.co.uk/_functions/menu",
  // Bridge Page URL (Created in Wix to handle the payment popup)
  paymentBridgeUrl: "https://www.flamboroughpizza.co.uk/app-payment",
  phone: "07990 140214",
  email: "flamboroughpizza@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61583819023188",
  address: "Living Sea Centre, South Sea Road, Flamborough YO15 1AE",
  hours: "Thursday - Saturday: 5pm - 9pm",
  logo: "https://static.wixstatic.com/media/6107d8_9990534191124566887d6e0e61aa1ad0~mv2.png",
  // Correct Wix Video Link
  splashVideo: "https://video.wixstatic.com/video/6107d8_5c4070e48a074075885dc84f2e0611fe/720p/mp4/file.mp4",
  // Fallback image
  splashPoster: "https://images.pexels.com/photos/5644754/pexels-photo-5644754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
};

// This is the "Safety Menu" (Default)
const DEFAULT_CATEGORIES = [
  {
    id: 'pizzas',
    name: "Pizza's",
    description: "All our pizza's are 12\" thin base, using sourdough.",
    items: [
      { name: "Margherita", price: "£8.00", description: "A simple yet satisfying combination of tomato sauce, mozzarella cheese, and fragrant basil." },
      { name: "Vegetarian", price: "£10.00", description: "The veggie lover’s dream! A colourful medley of peppers, onions, and mushrooms." },
      { name: "Ham & Mushroom", price: "£10.00", description: "Savoury and satisfying! A delicious blend of ham & mushrooms." },
      { name: "Pepperoni", price: "£10.00", description: "The pizza lover’s favourite! Generously topped with spicy pepperoni slices. Perfect for those who like a bit of a kick." },
      { name: "Hawaiian", price: "£10.00", description: "Sweet and tangy delight! A tropical twist on the classic pizza, featuring juicy pineapple chunks & ham." },
      { name: "Meat Feast", price: "£11.00", description: "For the serious carnivore! A hearty combination of pepperoni, sausage, ham & seasoned ground beef." }
    ]
  },
  {
    id: 'burgers',
    name: 'Burgers',
    description: "Juicy, perfectly cooked burgers.",
    items: [
      { name: "Steak Burger", price: "£5.00", description: "Savour the simple satisfaction of a perfectly cooked steak burger. A timeless favourite." },
      { name: "Steak Cheese Burger", price: "£5.50", description: "Our classic cheeseburger gets an upgrade with mozzarella cheese melted over a juicy steak burger." }
    ]
  },
  {
    id: 'sides',
    name: 'Sides',
    description: "Perfect companions for your meal.",
    items: [
      { name: "Garlic Bread", price: "£2.00", description: "Crispy and delicious." },
      { name: "Garlic Bread with Cheese", price: "£2.50", description: "Topped with melted cheese." }
    ]
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: "Soft drinks and water.",
    items: [
      { name: "Coke", price: "£1.75", description: "330ml" },
      { name: "Diet Coke", price: "£1.75", description: "330ml" },
      { name: "Lemon Fanta", price: "£1.75", description: "330ml" },
      { name: "Still Water", price: "£1.50", description: "500ml" }
    ]
  }
];

// --- Helper Functions ---
const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  return parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
};

const formatPrice = (amount) => {
  return `£${amount.toFixed(2)}`;
};

const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  // Look ahead 2 weeks
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    // 4 = Thursday, 5 = Friday, 6 = Saturday
    if (day === 4 || day === 5 || day === 6) {
      dates.push(d);
    }
  }
  return dates;
};

const getTimeSlots = () => {
  const slots = [];
  let hour = 17; // 5 PM
  let minute = 30; // Start at 5:30 PM
  
  // Generate slots until 9:00 PM (21:00)
  while (hour < 21 || (hour === 21 && minute === 0)) {
    const timeString = `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;
    slots.push(timeString);
    
    minute += 15;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }
  return slots;
};

// --- Components ---

const WelcomeScreen = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" /> 
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          poster={BUSINESS_INFO.splashPoster}
          className="w-full h-full object-cover"
        >
          <source src={BUSINESS_INFO.splashVideo} type="video/mp4" />
        </video>
      </div>

      {/* Sound Toggle Button */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-30 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="relative z-20 text-center px-6 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif tracking-tight drop-shadow-lg">
          {BUSINESS_INFO.name}
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12 font-light tracking-wide drop-shadow-md">
          {BUSINESS_INFO.tagline}
        </p>
        
        <button 
          onClick={onFinish}
          style={{ backgroundColor: '#3F3D3B' }}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 rounded-full hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 focus:ring-offset-black shadow-xl"
        >
          <span>Order Now</span>
          <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="absolute bottom-8 z-20 text-gray-200 text-sm animate-pulse font-medium drop-shadow-md">
        Open {BUSINESS_INFO.hours}
      </div>
    </div>
  );
};

// --- NEW COMPONENT: Order Setup Screen ---
const OrderSetupView = ({ onConfirm, isShopOpen }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlots();

  const handleStartOrder = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMsg("Please select a date and time to continue.");
      return;
    }
    onConfirm(selectedDate, selectedTime);
  };

  if (!isShopOpen) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                <AlertTriangle size={48} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sorry, we are closed.</h1>
            <p className="text-gray-600 mb-8 max-w-sm">Please check back later during our opening hours.</p>
             <div className="text-sm text-gray-500 font-medium">{BUSINESS_INFO.hours}</div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-in slide-in-from-right duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Order</h2>
            <p className="text-gray-500 text-sm">Select a time slot to see our menu.</p>
        </div>

        <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Select Date</label>
              <div className="relative">
                <select 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none appearance-none font-medium text-gray-700"
                >
                    <option value="" disabled>Choose a date...</option>
                    {availableDates.map((date) => (
                    <option key={date.toISOString()} value={date.toISOString()}>
                        {date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </option>
                    ))}
                </select>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Select Time</label>
              <div className="relative">
                <select 
                    value={selectedTime} 
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={!selectedDate}
                    className="w-full p-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none appearance-none font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="" disabled>Choose a time...</option>
                    {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                    ))}
                </select>
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
        </div>

        {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                <AlertCircle size={16} />
                {errorMsg}
            </div>
        )}

        <button 
            onClick={handleStartOrder}
            style={{ backgroundColor: '#3F3D3B' }}
            className="w-full mt-8 py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
            <span>Start Ordering</span>
            <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
      
      <div className="mt-8 text-center">
         <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Opening Hours</p>
         <p className="text-sm text-gray-600 font-medium mt-1">{BUSINESS_INFO.hours}</p>
      </div>
    </div>
  );
};

const MenuItem = ({ item, onAdd }) => {
  const isOutOfStock = !item.inStock && item.inStock !== undefined;

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between h-full ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}>
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {item.name}
            {isOutOfStock && (
              <span className="ml-2 text-xs font-bold text-red-500 border border-red-500 px-1 rounded align-middle">SOLD OUT</span>
            )}
          </h3>
          <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg text-sm whitespace-nowrap ml-2">{item.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
      </div>
      
      <button 
        onClick={() => onAdd(item)}
        disabled={isOutOfStock}
        style={!isOutOfStock ? { backgroundColor: '#3F3D3B' } : {}}
        className={`w-full py-2 px-4 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
          isOutOfStock
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'text-white hover:opacity-90 active:scale-95'
        }`}
      >
        <Plus size={16} />
        Add to Order
      </button>
    </div>
  );
};

const CategorySection = ({ category, onAddToCart }) => {
  if (!category.items || category.items.length === 0) return null;

  return (
    <section id={category.id} className="py-8 scroll-mt-36">
      <div className="mb-6 px-2">
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
        <p className="text-gray-500 text-sm">{category.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.items.map((item, index) => (
          <MenuItem key={index} item={item} onAdd={onAddToCart} />
        ))}
      </div>
    </section>
  );
};

// --- Checkout Views (CheckoutView, SuccessView) ---

const CheckoutView = ({ cart, total, orderType, onBack, onCompleteOrder, initialDate, initialTime }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postcode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Date and Time are now passed in as props (already selected)
  // We format the date for display
  const dateObj = new Date(initialDate);
  const displayDate = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  useEffect(() => {
    if (orderType === 'delivery') setPaymentMethod('card');
  }, [orderType]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); setErrorMsg('');
    
    // Combine names
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    const fullOrderData = {
        cart: cart, total: total, orderType: orderType, paymentMethod: paymentMethod, 
        customer: { ...formData, name: fullName },
        deliverySlot: { date: displayDate, time: initialTime, rawDate: initialDate }
    };

    try {
      const response = await fetch(BUSINESS_INFO.checkoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(fullOrderData)
      });
      
      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || data.details || `Server Error ${response.status}`);
      }

      if (paymentMethod === 'cash') {
        if (data.success) onCompleteOrder();
        else throw new Error('Server did not confirm cash order');
      } else {
        if (data.paymentId) {
          window.location.href = `${BUSINESS_INFO.paymentBridgeUrl}?paymentId=${data.paymentId}`;
        } else {
          throw new Error('No payment ID returned. Wix Payments may not be active.');
        }
      }
    } catch (err) {
      console.error("Order Error:", err);
      if (err.message.includes('500')) {
          setErrorMsg("Server Error (500): Check if Wix Payments is connected and 'AppOrders' collection exists.");
      } else if (err.message.includes('Failed to fetch')) {
          setErrorMsg("Connection Error: Backend code may not be published or CORS is blocking.");
      } else {
          setErrorMsg(`Order Failed: ${err.message}`);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
          <h1 className="text-lg font-bold">Checkout</h1>
          <div className="w-8" />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          {/* Summary */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Items ({cart.reduce((a,c) => a + c.quantity, 0)})</span>
              <span>{orderType === 'collection' ? 'Collection' : 'Delivery'}</span>
            </div>
            
            {/* Display Selected Slot */}
            <div className="flex justify-between text-sm text-gray-600 mb-1 bg-gray-50 p-2 rounded-lg mt-2 border border-gray-100">
              <span className="font-medium flex items-center gap-1"><Clock size={14}/> {initialTime}</span>
              <span className="font-medium">{displayDate}</span>
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-100 mt-2">
              <span>Total to Pay</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          
          {/* Contact */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold"><User size={18} /><h3>Details</h3></div>
            <div className="flex gap-4">
                <input required name="firstName" placeholder="First Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={handleInputChange} />
                <input required name="lastName" placeholder="Last Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={handleInputChange} />
            </div>
            <input required name="email" type="email" placeholder="Email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={handleInputChange} />
            <input required name="phone" type="tel" placeholder="Phone" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={handleInputChange} />
          </div>
          {/* Address */}
          {orderType === 'delivery' && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
               <div className="flex items-center gap-2 text-gray-900 font-bold"><Home size={18} /><h3>Address</h3></div>
              <input required name="address" placeholder="Street Address" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={handleInputChange} />
              <div className="flex gap-4">
                <input required name="city" placeholder="City/Town" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={handleInputChange} />
                <input required name="postcode" placeholder="Postcode" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={handleInputChange} />
              </div>
            </div>
          )}
          {/* Payment Method */}
          {orderType === 'collection' && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-900">Payment</h3>
              <button type="button" onClick={() => setPaymentMethod('card')} className={`flex items-center gap-3 p-3 rounded-lg border w-full ${paymentMethod === 'card' ? 'border-gray-500 bg-gray-50 text-gray-900' : 'border-gray-200'}`}>
                  <CreditCard size={20} /><div className="text-left flex-1"><p className="font-bold text-sm">Online Card</p></div>{paymentMethod === 'card' && <CheckCircle size={18} />}
              </button>
              <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex items-center gap-3 p-3 rounded-lg border w-full ${paymentMethod === 'cash' ? 'border-gray-500 bg-gray-50 text-gray-900' : 'border-gray-200'}`}>
                  <Banknote size={20} /><div className="text-left flex-1"><p className="font-bold text-sm">Pay Cash or Card at Shop</p></div>{paymentMethod === 'cash' && <CheckCircle size={18} />}
              </button>
            </div>
          )}
          {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex gap-2"><AlertCircle size={16} className="shrink-0 mt-0.5" />{errorMsg}</div>}
          <button type="submit" disabled={isProcessing} style={{ backgroundColor: '#3F3D3B' }} className={`w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-70`}>
            {isProcessing ? <span>Processing...</span> : <><ShoppingBag size={20} /><span>{paymentMethod === 'cash' ? 'Place Order' : `Pay ${formatPrice(total)}`}</span></>}
          </button>
        </form>
        <div className="h-12" />
      </div>
    </div>
  );
};

// --- Success View ---
const SuccessView = ({ onBackHome }) => (
  <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"><CheckCircle size={48} /></div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
    <p className="text-gray-600 mb-8 max-w-sm">Thank you for your order. We are firing up the oven!</p>
    <button onClick={onBackHome} style={{ backgroundColor: '#3F3D3B' }} className="px-8 py-3 text-white font-bold rounded-full hover:opacity-90 transition-opacity">Back to Menu</button>
  </div>
);

// --- Cart View ---
const CartView = ({ cart, onBack, onRemove, onUpdateQuantity, onCheckout, isShopOpen }) => {
  const [orderType, setOrderType] = useState('collection');
  const [postcode, setPostcode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('idle');
  
  const MIN_ORDER_VALUE = 5.00;
  const MIN_DELIVERY_ORDER = 15.00;
  const FREE_DELIVERY_THRESHOLD = 30.00;
  const DELIVERY_CHARGE = 2.50;

  const subtotal = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
  let deliveryCost = 0;
  if (orderType === 'delivery') {
    deliveryCost = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  }
  const total = subtotal + deliveryCost;

  const checkDelivery = () => {
    if (!postcode) return;
    setDeliveryStatus('checking');
    setTimeout(() => {
      const validPrefixes = ['YO15']; 
      const formattedPostcode = postcode.toUpperCase().replace(/\s/g, '');
      const isValid = validPrefixes.some(prefix => formattedPostcode.startsWith(prefix));
      if (isValid) setDeliveryStatus('success'); else setDeliveryStatus('error');
    }, 600);
  };

  let validationMessage = null;
  let isCheckoutDisabled = false;

  if (subtotal < MIN_ORDER_VALUE) {
    isCheckoutDisabled = true; validationMessage = `Minimum order value is ${formatPrice(MIN_ORDER_VALUE)}`;
  } else if (orderType === 'delivery') {
    if (subtotal < MIN_DELIVERY_ORDER) {
      isCheckoutDisabled = true; validationMessage = `Minimum order for delivery is ${formatPrice(MIN_DELIVERY_ORDER)}`;
    } else if (deliveryStatus !== 'success') {
      isCheckoutDisabled = true; validationMessage = "Please check a valid delivery postcode first.";
    }
  }
  if (!isShopOpen) {
      isCheckoutDisabled = true; validationMessage = "Sorry, the shop is currently closed.";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
          <h1 className="text-lg font-bold">Your Order</h1>
          <div className="w-8" /> 
        </div>
        <div className="px-4 pb-4">
          <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
            <button onClick={() => { setOrderType('collection'); setDeliveryStatus('idle'); }} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'collection' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Store size={16} /> Collection</button>
            <button onClick={() => setOrderType('delivery')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'delivery' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Bike size={16} /> Delivery</button>
          </div>
          {orderType === 'delivery' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Check Delivery</h3>
              <div className="flex gap-2">
                <input type="text" placeholder="Postcode (e.g. YO15)" value={postcode} onChange={(e) => { setPostcode(e.target.value); setDeliveryStatus('idle'); }} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase" />
                <button onClick={checkDelivery} disabled={!postcode} style={{ backgroundColor: '#3F3D3B' }} className="text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">Check</button>
              </div>
              {deliveryStatus === 'success' && <div className="mt-2 text-sm text-green-700">✅ We deliver to your area.</div>}
              {deliveryStatus === 'error' && <div className="mt-2 text-sm text-red-700">❌ Sorry, we don't deliver here.</div>}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {cart.length === 0 ? <div className="text-center py-20 text-gray-500"><p>Your basket is empty</p><button onClick={onBack} className="mt-4 text-red-600 font-bold">Browse Menu</button></div> : cart.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="flex-1"><h3 className="font-bold text-gray-900">{item.name}</h3><p className="text-red-600 font-medium">{item.price}</p></div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1"><button onClick={() => onUpdateQuantity(index, -1)} className="p-1"><Minus size={16} /></button><span className="font-bold w-4 text-center text-sm">{item.quantity}</span><button onClick={() => onUpdateQuantity(index, 1)} className="p-1"><Plus size={16} /></button></div>
            </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="bg-white p-4 border-t border-gray-200 shadow-lg">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-gray-600 text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {orderType === 'delivery' && <div className="flex justify-between items-center text-gray-600 text-sm"><span>Delivery Charge</span>{deliveryCost === 0 ? <span className="text-green-600 font-bold">FREE</span> : <span>{formatPrice(deliveryCost)}</span>}</div>}
            <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-gray-100"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <button disabled={isCheckoutDisabled} style={!isCheckoutDisabled ? { backgroundColor: '#3F3D3B' } : {}} className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${isCheckoutDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'text-white hover:opacity-90 active:scale-95 shadow-lg'}`} onClick={() => onCheckout(total, orderType)}><span>Proceed to Checkout</span><ChevronRight size={20} /></button>
          {isCheckoutDisabled && <p className="text-xs text-center text-red-500 mt-2 font-medium">{validationMessage}</p>}
        </div>
      )}
    </div>
  );
};

const Footer = ({ openCart }) => (
  <footer className="bg-gray-900 text-gray-300 py-12 px-4 mt-12">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-white mb-6 font-serif">{BUSINESS_INFO.name}</h2>
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center gap-2"><MapPin size={18} className="text-red-500" /><span>{BUSINESS_INFO.address}</span></div>
        <div className="flex items-center justify-center gap-2"><Phone size={18} className="text-red-500" /><span>{BUSINESS_INFO.phone}</span></div>
        <div className="flex items-center justify-center gap-2"><Mail size={18} className="text-red-500" /><span>{BUSINESS_INFO.email}</span></div>
        <div className="flex items-center justify-center gap-2"><Clock size={18} className="text-red-500" /><span>{BUSINESS_INFO.hours}</span></div>
        
        {BUSINESS_INFO.facebook && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors text-sm font-medium">
              <Facebook size={18} /><span>Follow us on Facebook</span>
            </a>
          </div>
        )}
      </div>
      <div className="border-t border-gray-800 pt-8 text-sm text-gray-500">© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</div>
    </div>
  </footer>
);

const Navbar = ({ activeCategory, onNavigate, categories, cartCount, openCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'}`}>
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 max-w-[65%]">
            <img src={BUSINESS_INFO.logo} alt={BUSINESS_INFO.name} className="w-12 h-12 rounded-full object-cover shadow-sm" onError={(e) => {e.target.style.display = 'none'}} />
            <h1 className="font-serif font-bold text-3xl text-gray-900 leading-tight py-1">{BUSINESS_INFO.name}</h1>
          </div>
          
          <div className="flex items-center gap-2 mt-12">
            <button onClick={openCart} className="relative flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-sm" style={{ backgroundColor: '#3F3D3B' }}><span>Order</span><ShoppingBag size={16} />{cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}</button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar scroll-smooth">
          {categories.map(cat => (cat.items && cat.items.length > 0 && (<button key={cat.id} onClick={() => onNavigate(cat.id)} style={activeCategory === cat.id ? { backgroundColor: '#3F3D3B', borderColor: '#3F3D3B' } : {}} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all border ${activeCategory === cat.id ? 'text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>{cat.name}</button>)))}
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [orderSetupComplete, setOrderSetupComplete] = useState(false); // Track if date/time is picked
  const [selectedSlot, setSelectedSlot] = useState({ date: '', time: '' }); // Store the choice
  
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORIES[0].id);
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu');
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutOrderType, setCheckoutOrderType] = useState('collection');
  
  // -- STORE STATUS STATE --
  const [storeStatus, setStoreStatus] = useState({ open: true, message: "" });

  // --- Cart Functions ---
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);
      if (existingItemIndex >= 0) { const newCart = [...prevCart]; newCart[existingItemIndex].quantity += 1; return newCart; }
      else { return [...prevCart, { ...item, quantity: 1 }]; }
    });
  };
  const updateQuantity = (index, change) => {
    setCart(prevCart => {
      const newCart = [...prevCart]; const item = newCart[index]; const newQuantity = item.quantity + change;
      if (newQuantity <= 0) return newCart.filter((_, i) => i !== index);
      else { item.quantity = newQuantity; return newCart; }
    });
  };
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- WIX DATA FETCHING ---
  useEffect(() => {
    fetch(BUSINESS_INFO.menuUrl)
      .then(response => response.json())
      .then(data => {
        // 1. Handle Menu Items
        if (data.items && data.items.length > 0) {
          const newMenuStructure = DEFAULT_CATEGORIES.map(cat => ({ ...cat, items: [] }));
          data.items.forEach(wixItem => {
            const category = newMenuStructure.find(c => c.id === wixItem.category);
            if (category) {
              category.items.push({
                name: wixItem.title, price: wixItem.price, description: wixItem.description,
                inStock: wixItem.inStock === true || wixItem.inStock === "true"
              });
            }
          });
          setCategories(newMenuStructure);
        }
        // 2. Handle Store Status (Holiday Mode)
        if (data.status) {
            setStoreStatus({ open: data.status.open, message: data.status.message });
        }
      })
      .catch(error => console.error("Could not fetch menu:", error));
  }, []);

  // --- Scroll Spy ---
  useEffect(() => {
    if (currentView !== 'menu') return;
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveCategory(entry.target.id); }); }, { rootMargin: '-160px 0px -20% 0px', threshold: 0 });
    categories.forEach((cat) => { const element = document.getElementById(cat.id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [categories, currentView]);

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // --- FLOW HANDLERS ---
  const handleSplashFinish = () => {
    setShowSplash(false);
    // Instead of going to 'menu', we stay on 'menu' view logic but show OrderSetupView
    // The conditional rendering below handles this.
  };

  const handleOrderSetupConfirm = (date, time) => {
    setSelectedSlot({ date, time });
    setOrderSetupComplete(true);
    // Now the main menu will show
  };

  const handleProceedToCheckout = (total, type) => { setCheckoutTotal(total); setCheckoutOrderType(type); setCurrentView('checkout'); };
  const handleCompleteOrder = () => { setCurrentView('success'); setCart([]); };
  const handleBackHome = () => { setCurrentView('menu'); };

  // --- RENDER LOGIC ---
  if (showSplash) return <WelcomeScreen onFinish={handleSplashFinish} />;

  // NEW: Show Order Setup if splash is done but date isn't picked yet
  if (!orderSetupComplete) {
    return <OrderSetupView onConfirm={handleOrderSetupConfirm} isShopOpen={storeStatus.open} />;
  }

  if (currentView === 'cart') return <CartView cart={cart} onBack={() => setCurrentView('menu')} onUpdateQuantity={updateQuantity} onCheckout={handleProceedToCheckout} isShopOpen={storeStatus.open} />;
  
  if (currentView === 'checkout') {
      return (
        <CheckoutView 
            cart={cart} 
            total={checkoutTotal} 
            orderType={checkoutOrderType} 
            onBack={() => setCurrentView('cart')} 
            onCompleteOrder={handleCompleteOrder}
            // Pass the pre-selected date/time to the checkout so it can send it to Wix
            initialDate={selectedSlot.date}
            initialTime={selectedSlot.time}
        />
      );
  }
  
  if (currentView === 'success') return <SuccessView onBackHome={handleBackHome} />;

  // Main Menu View
  return (
    <div className="min-h-screen font-sans text-gray-900" style={{ backgroundColor: '#FBF5ED' }}>
      <Navbar activeCategory={activeCategory} onNavigate={scrollToCategory} categories={categories} cartCount={cartCount} openCart={() => setCurrentView('cart')} />
      
      {/* Show the selected slot in a nice banner at top of menu */}
      <div className="fixed top-[120px] left-0 right-0 z-30 bg-[#FBF5ED]/95 backdrop-blur px-4 py-2 border-b border-gray-200 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Ordering For</p>
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-800">
              <Calendar size={14} />
              <span>{new Date(selectedSlot.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              <span className="text-gray-300">|</span>
              <Clock size={14} />
              <span>{selectedSlot.time}</span>
              <button 
                onClick={() => setOrderSetupComplete(false)} // Let them change it
                className="ml-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600"
              >
                  <Edit2 size={12} />
              </button>
          </div>
      </div>

      {/* Holiday Mode Banner */}
      {!storeStatus.open && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white p-4 text-center shadow-lg animate-in slide-in-from-bottom">
              <div className="flex items-center justify-center gap-2 font-bold text-lg mb-1">
                  <AlertTriangle />
                  <span>Shop Closed</span>
              </div>
              <p className="text-sm opacity-90">{storeStatus.message}</p>
          </div>
      )}

      {/* Added extra padding-top (pt-48) to account for the new "Ordering For" banner */}
      <main className="pt-48 px-4 max-w-3xl mx-auto min-h-screen pb-12">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} onAddToCart={addToCart} isShopOpen={storeStatus.open} />
        ))}
        <Footer openCart={() => setCurrentView('cart')} />
      </main>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 p-3 bg-white text-gray-400 rounded-full shadow-lg border border-gray-100 hover:text-gray-900 hover:shadow-xl transition-all z-30 opacity-50 hover:opacity-100 hidden sm:flex"><ArrowUp size={20} /></button>
    </div>
  );
}