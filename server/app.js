const express = require("express");
const path = require('path');
// Load env from server/.env then fallback to project root .env
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const fileUpload = require("express-fileupload");
const compression = require('compression');
const productsRouter = require("./routes/products");
const productImagesRouter = require("./routes/productImages");
const categoryRouter = require("./routes/category");
const searchRouter = require("./routes/search");
const mainImageRouter = require("./routes/mainImages");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/customer_orders");
const slugRouter = require("./routes/slugs");
const brandsRouter = require("./routes/brands");
const sliderRouter = require("./routes/slider");
const clientLogosRouter = require("./routes/clientLogos");
const bannersRouter = require("./routes/banners");
const messengerRouter = require("./routes/messenger");
const statsRouter = require("./routes/stats");
const orderProductRouter = require('./routes/customer_order_product');
const paymentMethodsRouter = require("./routes/paymentMethods");
const popupsRouter = require("./routes/popups");
// const wishlistRouter = require('./routes/wishlist');
const notificationsRouter = require('./routes/notifications');
const merchantRouter = require('./routes/merchant'); // Add this line
const bulkUploadRouter = require('./routes/bulkUpload');
const settingsRouter = require('./routes/settings');
var cors = require("cors");

// Import logging middleware
const {
  addRequestId,
  requestLogger,
  errorLogger,
  securityLogger
} = require('./middleware/requestLogger');

// Import rate limiting middleware
const {
  generalLimiter,
  authLimiter,
  registerLimiter,
  userManagementLimiter,
  uploadLimiter,
  searchLimiter,
  orderLimiter
} = require('./middleware/rateLimiter');


const {
  handleServerError
} = require('./utills/errorHandler');

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Add request ID to all requests
app.use(addRequestId);

// Security logging (check for suspicious patterns)
app.use(securityLogger);

// Standard request logging
app.use(requestLogger);

// Error logging (only logs 4xx and 5xx responses)
app.use(errorLogger);

// Enable gzip compression for faster responses
app.use(compression());

const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies and authorization headers
};

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Increase JSON/body size limits to support base64 images
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cors(corsOptions));
app.use(fileUpload());

// Serve static files from the 'public' directory (project root)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Apply specific rate limiters to different route groups
app.use("/api/users", userManagementLimiter);
app.use("/api/search", searchLimiter);
app.use("/api/orders", orderLimiter);
app.use("/api/order-product", orderLimiter);
app.use("/api/images", uploadLimiter);
app.use("/api/main-image", uploadLimiter);
app.use("/api/payment-methods", uploadLimiter);
app.use("/api/popups", uploadLimiter);
// app.use("/api/wishlist", wishlistLimiter);
// app.use("/api/products", productLimiter);
// app.use("/api/merchants", productLimiter);
app.use("/api/bulk-upload", uploadLimiter);
app.use("/api/settings", userManagementLimiter);

// Apply stricter rate limiting to authentication-related routes
app.use("/api/users/email", authLimiter); // For login attempts via email lookup 

// Apply admin rate limiting to admin routes


app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/images", productImagesRouter);
app.use("/api/main-image", mainImageRouter);
app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/orders", orderRouter);
app.use('/api/order-product', orderProductRouter);
app.use("/api/slugs", slugRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/slider", sliderRouter);
app.use("/api/client-logos", clientLogosRouter);
app.use("/api/banners", bannersRouter);
app.use("/api/messenger", messengerRouter);
// app.use("/api/wishlist", wishlistRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/merchants", merchantRouter);
app.use("/api/bulk-upload", bulkUploadRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/payment-methods", paymentMethodsRouter);
app.use("/api/popups", popupsRouter);
app.use("/api/stats", statsRouter);

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    rateLimiting: 'enabled',
    requestId: req.reqId
  });
});

// Rate limit info endpoint
app.get('/rate-limit-info', (req, res) => {
  res.status(200).json({
    general: '100 requests per 15 minutes',
    auth: '5 login attempts per 15 minutes',
    register: '3 registrations per hour',
    upload: '10 uploads per 15 minutes',
    search: '30 searches per minute',
    orders: '15 order operations per 15 minutes',
    wishlist: '20 operations per 5 minutes',
    products: '60 requests per minute',
    requestId: req.reqId
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestId: req.reqId
  });
});

// Global error handler
app.use((err, req, res, next) => {
  handleServerError(err, res, `${req.method} ${req.path}`);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Rate limiting and request logging enabled for all endpoints');
  console.log('Logs are being written to server/logs/ directory');
});
