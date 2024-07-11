import useOrderStore from "../store/orderStore";

export function calculateSaleGoals() {
  const orders = useOrderStore.getState().orders;
  const now = new Date();

  function startOfWeek(date: Date) {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  }

  function startOfMonth(date: Date) {
    const start = new Date(date);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  function startOfPreviousWeek(date: Date) {
    const start = startOfWeek(date);
    start.setDate(start.getDate() - 7);
    return start;
  }

  function startOfPreviousMonth(date: Date) {
    const start = startOfMonth(date);
    start.setMonth(start.getMonth() - 1);
    return start;
  }

  const startOfCurrentWeek = startOfWeek(now);
  const startOfCurrentMonth = startOfMonth(now);
  const startOfPreviousWeekDate = startOfPreviousWeek(now);
  const startOfPreviousMonthDate = startOfPreviousMonth(now);

  let totalCurrentWeek = 0;
  let totalPreviousWeek = 0;
  let totalCurrentMonth = 0;
  let totalPreviousMonth = 0;

  const deliveredOrders = orders.filter(
    (order) => order.status === "done",
  );

  deliveredOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const orderAmount = order.totalPrice;

    if (orderDate >= startOfCurrentWeek) {
      totalCurrentWeek += orderAmount;
    } else if (orderDate >= startOfPreviousWeekDate) {
      totalPreviousWeek += orderAmount;
    }

    if (orderDate >= startOfCurrentMonth) {
      totalCurrentMonth += orderAmount;
    } else if (orderDate >= startOfPreviousMonthDate) {
      totalPreviousMonth += orderAmount;
    }
  });

  const weeklyIncrease =
    ((totalCurrentWeek - totalPreviousWeek) / totalPreviousWeek) * 100;
  const monthlyIncrease =
    ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;

  return {
    weeklyTotal: totalCurrentWeek,
    weeklyIncrease: isNaN(weeklyIncrease) ? 0 : weeklyIncrease,
    monthlyTotal: totalCurrentMonth,
    monthlyIncrease: isNaN(monthlyIncrease) ? 0 : monthlyIncrease,
  };
}
