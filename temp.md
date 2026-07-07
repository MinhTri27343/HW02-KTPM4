Tôi cung cấp cho bạn:

1. Một file skill về `Automated_Domain_Testing_Designer.md`.
3. Dữ liệu đầu vào gồm Feature Specification, Navigation Flow, Business Rules, Input Constraints, Expected Output Statuses và System Context.

Nhiệm vụ của bạn:

- Đọc và hiểu toàn bộ skill `Automated_Domain_Testing_Designer.md`.
- Phân tích các quy trình, phương pháp,te và tiêu chí trong skill.
- Dựa trên skill và dữ liệu đầu vào, hãy tạo một **Domain Testing Report hoàn chỉnh** cho tính năng được mô tả.

Feature cần phân tích:

FR-09: Mã Giảm Giá (Coupon)

Input Specification:

"""
Mô tả tính năng/Yêu cầu nghiệp vụ (Feature Specification):

### FR-09: Mã Giảm Giá (Coupon)

Tại bước Checkout, người dùng có thể nhập mã giảm giá. Hệ thống áp dụng giảm giá dựa trên **5 điều kiện** sau, tất cả phải thỏa mãn:

| #   | Điều kiện              | Mô tả                                                       |
| --- | ---------------------- | ----------------------------------------------------------- |
| C1  | **Mã tồn tại**         | Mã phải có trong CSDL và đang hoạt động (`is_active = 1`)   |
| C2  | **Còn hạn sử dụng**    | Ngày hiện tại phải trước `expired_at`                       |
| C3  | **Đủ ngưỡng đơn hàng** | Tổng đơn hàng **>= (lớn hơn hoặc bằng)** `min_order_amount` |
| C4  | **Đã đăng nhập**       | Người dùng phải có JWT Token hợp lệ                         |
| C5  | **Chưa dùng hết lượt** | Số lần đã dùng mã này của user < `max_uses_per_user`        |

**Công thức tính giảm giá:**

- Loại `percent`: `discount_amount = total × discount_value / 100`
- Loại `fixed`: `discount_amount = discount_value`
- `final_amount = total - discount_amount`

**Mã giảm giá mẫu trong hệ thống:**

| Mã        | Loại    | Giá trị   | Ngưỡng tối thiểu | Hạn dùng   | Số lần/người |
| --------- | ------- | --------- | ---------------- | ---------- | ------------ |
| `SAVE10`  | percent | 10%       | 300,000 ₫        | 2099-12-31 | 1            |
| `BIGBUY`  | fixed   | 50,000 ₫  | 500,000 ₫        | 2099-12-31 | 1            |
| `VIP100`  | fixed   | 100,000 ₫ | 300,000 ₫        | 2099-12-31 | 2            |
| `EXPIRED` | percent | 20%       | 100,000 ₫        | 2020-01-01 | 1            |



"""

Yêu cầu tạo báo cáo:

Tham khảo template đã được viết sẵn ở  `Domain_testing_report.md`

Hãy viết tiếp  kết quả dưới dạng file Markdown:

`Domain_testing_report.md`


Bắt buộc tuân theo cấu trúc của skill `Automated_Domain_Testing_Designer` đã cung cấp.
Bắt buộc tuân theo template `Domain_testing_report.md`