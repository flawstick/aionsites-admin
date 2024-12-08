import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdersTableItem } from "@/components/orders/orders-table-item";
import OrderTableHeader from "@/components/orders/orders-table-header";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IOrder as Order } from "@/types";
import useOrderStore from "@/lib/store/orderStore";

interface OrderTableProps {
  description: string;
  orders: Order[];
  isLoading: boolean;
  onHover: (order: Order | null) => void;
  onRefresh: () => void;
  isSpinning: boolean;
  maxPages: number; // Total server pages available
  onFetchMore: () => Promise<void>; // Function to load more orders from server
}

const ITEMS_PER_PAGE = 10;
const MAX_ORDERS_PER_REQUEST = 40; // Each server page = 40 orders = 4 client pages

const OrderTable: React.FC<OrderTableProps> = ({
  description,
  orders,
  isLoading,
  onHover,
  onRefresh,
  isSpinning,
  maxPages,
  onFetchMore,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const { loadedServerPages, ordersHashmap, fetchOrdersPage, totalCount } =
    useOrderStore();

  const totalPotentialPages = useMemo(
    () => Math.ceil(totalCount / ITEMS_PER_PAGE),
    [totalCount],
  );

  const loadedPages = useMemo(
    () => loadedServerPages * (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE),
    [loadedServerPages],
  );

  const loadedPageIndexes = useMemo(() => {
    return Object.keys(ordersHashmap).map((page) => parseInt(page));
  }, [ordersHashmap]);

  useEffect(() => {
    if (
      currentPage % (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE) === 0 &&
      loadedServerPages < maxPages
    ) {
      onFetchMore();
    }
  }, [currentPage, loadedServerPages, maxPages, onFetchMore]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    let shiftValue =
      page % (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE) === 0 ? 0 : 1;
    let serverPage = Math.floor(
      page / (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE) + shiftValue,
    );
    if (!loadedPageIndexes.includes(serverPage)) {
      setLoadingPage(true);
      await fetchOrdersPage(serverPage);
      setLoadingPage(false);
    }

    if (page <= loadedPages) {
      setCurrentPage(page);
    } else {
      if (loadedServerPages < maxPages) {
        const oldLoadedServerPages = loadedServerPages;

        if (
          loadedServerPages > oldLoadedServerPages &&
          page <= loadedServerPages * 4
        ) {
          setCurrentPage(page);
        } else {
          console.log("No additional pages available to reach page", page);
        }
      } else {
        console.log("No more pages available.");
      }
    }
  };

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return orders.slice(start, end);
  }, [orders, currentPage]);

  const currentPageServerPage = useMemo(() => {
    let shiftValue =
      currentPage % (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE) === 0 ? 0 : 1;
    return Math.floor(
      currentPage / (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE) + shiftValue,
    );
  }, [currentPage]);

  useEffect(() => {
    console.log("currentPage", currentPage);
    console.log("currentPageServerPage", currentPageServerPage);
    console.log(
      ((currentPage - 1) % (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE)) *
        ITEMS_PER_PAGE,
      ((currentPage - 1) % (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE)) *
        ITEMS_PER_PAGE +
        ITEMS_PER_PAGE,
    );
  }, [currentPage]);

  if (isLoading || !orders.length || loadingPage) {
    return (
      <Card>
        <CardHeader className="px-7 flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <Skeleton className="w-1/2 h-4" />
        </CardHeader>
        <CardContent>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <Skeleton className="w-1/3 h-8" />
              <Skeleton className="w-1/6 h-8" />
              <Skeleton className="w-1/4 h-8" />
              <Skeleton className="w-1/5 h-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const totalPages = totalPotentialPages;
  const maxPageLinksToShow = 5;
  let pagesToShow: number[] = [];

  if (totalPages <= maxPageLinksToShow) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    let pagesToAdd = maxPageLinksToShow - 1;
    let beforeCount = Math.floor(pagesToAdd / 2);
    let afterCount = pagesToAdd - beforeCount;
    let startPage = Math.max(currentPage - beforeCount, 1);
    let endPage = Math.min(currentPage + afterCount, totalPages);

    if (startPage === 1) {
      endPage = Math.min(maxPageLinksToShow, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(totalPages - (maxPageLinksToShow - 1), 1);
    }

    pagesToShow = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }

  return (
    <Card>
      <CardHeader className="px-7">
        <OrderTableHeader onRefresh={onRefresh} isSpinning={isSpinning} />
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersHashmap[currentPageServerPage]
              ?.slice(
                ((currentPage - 1) %
                  (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE)) *
                  ITEMS_PER_PAGE,
                ((currentPage - 1) %
                  (MAX_ORDERS_PER_REQUEST / ITEMS_PER_PAGE)) *
                  ITEMS_PER_PAGE +
                  ITEMS_PER_PAGE,
              )
              .map((order) => (
                <OrdersTableItem
                  key={order._id}
                  order={order}
                  onHover={onHover}
                />
              ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {pagesToShow[0] !== 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pagesToShow[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {pagesToShow.map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={pageNum === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {pagesToShow[pagesToShow.length - 1] !== totalPages && (
                  <>
                    {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      } else {
                        await handlePageChange(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === totalPotentialPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTable;
