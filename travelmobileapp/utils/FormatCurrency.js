export default function (value) {
  const price = Number(value) || 0;
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}