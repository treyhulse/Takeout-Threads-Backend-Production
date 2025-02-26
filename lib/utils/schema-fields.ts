import { Metric, Dimension, BaseRecordType } from "@/types/reports"

// Transaction Metrics
const transactionMetrics: Metric[] = [
  { id: "total", label: "Total Revenue", table: "Transactions", aggregation: "sum" },
  { id: "tax_amount", label: "Tax Amount", table: "Transactions", aggregation: "sum" },
  { id: "shipping_cost", label: "Shipping Cost", table: "Transactions", aggregation: "sum" },
  { id: "discount_total", label: "Discount Total", table: "Transactions", aggregation: "sum" },
  { id: "total_amount", label: "Total Amount", table: "Transactions", aggregation: "sum" },
  { id: "transaction_count", label: "Transaction Count", table: "Transactions", aggregation: "count" },
]

// Item Metrics
const itemMetrics: Metric[] = [
  { id: "price", label: "Item Price", table: "Items", aggregation: "avg" },
  { id: "inventory_quantity", label: "Inventory Quantity", table: "Items", aggregation: "sum" },
  { id: "low_stock_alert", label: "Low Stock Alert Level", table: "Items", aggregation: "min" },
]

// Customer Metrics
const customerMetrics: Metric[] = [
  { id: "customer_count", label: "Customer Count", table: "Customers", aggregation: "count" },
  { id: "orders_per_customer", label: "Orders per Customer", table: "Transactions", aggregation: "avg" },
]

// Cart Metrics
const cartMetrics: Metric[] = [
  { id: "cart_total", label: "Cart Total", table: "Cart", aggregation: "sum" },
  { id: "cart_items", label: "Items in Cart", table: "CartItems", aggregation: "count" },
  { id: "abandoned_carts", label: "Abandoned Carts", table: "Cart", aggregation: "count" },
]

// Transaction Dimensions
const transactionDimensions: Dimension[] = [
  { id: "type", label: "Transaction Type", table: "Transactions", field: "type" },
  { id: "status", label: "Transaction Status", table: "Transactions", field: "status" },
  { id: "payment_status", label: "Payment Status", table: "Transactions", field: "payment_status" },
  { id: "payment_method", label: "Payment Method", table: "Transactions", field: "payment_method" },
  { id: "created_at", label: "Transaction Date", table: "Transactions", field: "created_at" },
]

// Item Dimensions
const itemDimensions: Dimension[] = [
  { id: "item_name", label: "Item Name", table: "Items", field: "name" },
  { id: "item_type", label: "Item Type", table: "Items", field: "type" },
  { id: "item_status", label: "Item Status", table: "Items", field: "status" },
  { id: "item_sku", label: "SKU", table: "Items", field: "sku" },
]

// Customer Dimensions
const customerDimensions: Dimension[] = [
  { id: "customer_name", label: "Customer Name", table: "Customers", field: "first_name,last_name" },
  { id: "customer_company", label: "Company", table: "Customers", field: "company_name" },
  { id: "customer_category", label: "Customer Category", table: "Customers", field: "customer_category" },
  { id: "customer_location", label: "Location", table: "Addresses", field: "city,state,country" },
]

export const baseRecordTypes: BaseRecordType[] = [
  {
    id: "transactions",
    label: "Transactions",
    table: "Transactions",
    metrics: [
      { id: "total", label: "Total Revenue", table: "Transactions", aggregation: "sum" },
      { id: "tax_amount", label: "Tax Amount", table: "Transactions", aggregation: "sum" },
      { id: "shipping_cost", label: "Shipping Cost", table: "Transactions", aggregation: "sum" },
      { id: "discount_total", label: "Discount Total", table: "Transactions", aggregation: "sum" },
      { id: "total_amount", label: "Total Amount", table: "Transactions", aggregation: "sum" },
      { id: "transaction_count", label: "Transaction Count", table: "Transactions", aggregation: "count" }
    ],
    dimensions: [
      { id: "type", label: "Transaction Type", table: "Transactions", field: "type" },
      { id: "status", label: "Transaction Status", table: "Transactions", field: "status" },
      { id: "payment_status", label: "Payment Status", table: "Transactions", field: "payment_status" },
      { id: "payment_method", label: "Payment Method", table: "Transactions", field: "payment_method" },
      { id: "created_at", label: "Transaction Date", table: "Transactions", field: "created_at" }
    ],
    relations: [
      {
        table: "Customers",
        joinField: "entity_id",
        metrics: [
          { id: "customer_count", label: "Customer Count", table: "Customers", aggregation: "count" },
          { id: "orders_per_customer", label: "Orders per Customer", table: "Customers", aggregation: "avg" }
        ],
        dimensions: [
          { id: "customer_name", label: "Customer Name", table: "Customers", field: "first_name,last_name" },
          { id: "customer_company", label: "Company", table: "Customers", field: "company_name" },
          { id: "customer_category", label: "Customer Category", table: "Customers", field: "customer_category" }
        ]
      },
      {
        table: "Items",
        joinField: "item_id",
        joinThrough: "TransactionItems",
        metrics: [
          { id: "total_sold", label: "Total Sold", table: "TransactionItems", aggregation: "sum" },
          { id: "average_price_sold", label: "Average Price Sold", table: "TransactionItems", aggregation: "avg" }
        ],
        dimensions: [
          { id: "last_sold_date", label: "Last Sold Date", table: "Transactions", field: "created_at" },
          { id: "transaction_type", label: "Transaction Type", table: "Transactions", field: "type" }
        ]
      }
    ]
  },
  {
    id: "items",
    label: "Items",
    table: "Items",
    metrics: [
      { id: "price", label: "Item Price", table: "Items", aggregation: "avg" },
      { id: "inventory_quantity", label: "Inventory Quantity", table: "Items", aggregation: "sum" },
      { id: "low_stock_alert", label: "Low Stock Alert Level", table: "Items", aggregation: "min" }
    ],
    dimensions: [
      { id: "item_name", label: "Item Name", table: "Items", field: "name" },
      { id: "item_type", label: "Item Type", table: "Items", field: "type" },
      { id: "item_status", label: "Item Status", table: "Items", field: "status" },
      { id: "item_sku", label: "SKU", table: "Items", field: "sku" }
    ],
    relations: [
      {
        table: "Transactions",
        joinField: "transaction_id",
        joinThrough: "TransactionItems",
        metrics: [
          { id: "total_sold", label: "Total Sold", table: "TransactionItems", aggregation: "sum" },
          { id: "average_price_sold", label: "Average Price Sold", table: "TransactionItems", aggregation: "avg" }
        ],
        dimensions: [
          { id: "last_sold_date", label: "Last Sold Date", table: "Transactions", field: "created_at" },
          { id: "transaction_type", label: "Transaction Type", table: "Transactions", field: "type" }
        ]
      }
    ]
  },
  {
    id: "customers",
    label: "Customers",
    table: "Customers",
    metrics: [
      { id: "customer_count", label: "Customer Count", table: "Customers", aggregation: "count" },
      { id: "total_revenue", label: "Total Revenue", table: "Transactions", aggregation: "sum" }
    ],
    dimensions: [
      { id: "customer_name", label: "Customer Name", table: "Customers", field: "first_name,last_name" },
      { id: "customer_company", label: "Company", table: "Customers", field: "company_name" },
      { id: "customer_category", label: "Customer Category", table: "Customers", field: "customer_category" }
    ],
    relations: [
      {
        table: "Transactions",
        joinField: "entity_id",
        metrics: [
          { id: "total", label: "Total Revenue", table: "Transactions", aggregation: "sum" },
          { id: "transaction_count", label: "Transaction Count", table: "Transactions", aggregation: "count" }
        ],
        dimensions: [
          { id: "last_transaction_date", label: "Last Transaction Date", table: "Transactions", field: "created_at" },
          { id: "payment_method", label: "Payment Method", table: "Transactions", field: "payment_method" }
        ]
      }
    ]
  }
]

export const availableMetrics = [
  { group: "Transactions", items: transactionMetrics },
  { group: "Items", items: itemMetrics },
  { group: "Customers", items: customerMetrics },
  { group: "Cart", items: cartMetrics },
]

export const availableDimensions = [
  { group: "Transactions", items: transactionDimensions },
  { group: "Items", items: itemDimensions },
  { group: "Customers", items: customerDimensions },
] 