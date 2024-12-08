import { Order } from "@/lib/store/orderStore";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  SectionType,
  WidthType,
} from "docx";
import * as XLSX from "xlsx";

const hebrewHeaders = {
  "Order ID": "מספר הזמנה",
  "User Name": "שם משתמש",
  Items: "פריטים",
  "Total Price": "מחיר כולל",
  Status: "סטטוס",
  "Created At": "נוצר ב",
  "Updated At": "עודכן ב",
};

// Function to create summarized order details string
const createSummarizedOrderDetails = (order: Order) => {
  return order.items
    .map((item: any) => {
      const modifiers = item.modifiers
        .map(
          (mod: any) =>
            `${mod.name}: ${mod.options
              .map((opt: any) => opt.name)
              .join(", ")}`,
        )
        .join("; ");
      return `${item.name} (${item.quantity}) - ${modifiers}`;
    })
    .join("\n");
};

// Function to filter orders by date range
const filterOrdersByDate = (orders: Order[], fromDate: Date, toDate: Date) => {
  return orders?.filter((order: Order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= fromDate && orderDate <= toDate;
  });
};

// Function to export as DOCX
export const exportAsDOCX = (orders: Order[], fromDate: Date, toDate: Date) => {
  try {
    const filteredOrders = filterOrdersByDate(orders, fromDate, toDate);

    const table = new Table({
      rows: [
        new TableRow({
          children: Object.values(hebrewHeaders).map(
            (header) =>
              new TableCell({
                children: [new Paragraph(header)],
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
          ),
        }),
        ...filteredOrders.map(
          (order: Order) =>
            new TableRow({
              children: [
                order._id,
                order.customerName,
                createSummarizedOrderDetails(order),
                order.totalPrice.toString(),
                order.status,
                new Date(order.createdAt).toLocaleString("he-IL"),
                new Date(order.updatedAt).toLocaleString("he-IL"),
              ].map(
                (cell) =>
                  new TableCell({
                    children: [new Paragraph(cell.toString())],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
              ),
            }),
        ),
      ],
    });

    const doc = new Document({
      sections: [
        {
          properties: { type: SectionType.CONTINUOUS },
          children: [table],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `הזמנות_${fromDate.toISOString().split("T")[0]}_to_${
        toDate.toISOString().split("T")[0]
      }.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  } catch (error) {
    console.error("Error exporting DOCX:", error);
  }
};

// Function to export as XLSX
export const exportAsXLSX = (orders: Order[], fromDate: Date, toDate: Date) => {
  const filteredOrders = filterOrdersByDate(orders, fromDate, toDate);

  const worksheet = XLSX.utils.json_to_sheet(
    filteredOrders.map((order: Order) => ({
      [hebrewHeaders["Order ID"]]: order._id,
      [hebrewHeaders["User Name"]]: order.customerName,
      [hebrewHeaders["Items"]]: createSummarizedOrderDetails(order),
      [hebrewHeaders["Total Price"]]: order.totalPrice,
      [hebrewHeaders["Status"]]: order.status,
      [hebrewHeaders["Created At"]]: new Date(order.createdAt).toLocaleString(
        "he-IL",
      ),
      [hebrewHeaders["Updated At"]]: new Date(order.updatedAt).toLocaleString(
        "he-IL",
      ),
    })),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "הזמנות");

  XLSX.writeFile(
    workbook,
    `הזמנות_${fromDate.toISOString().split("T")[0]}_to_${
      toDate.toISOString().split("T")[0]
    }.xlsx`,
  );
};
