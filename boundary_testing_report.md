# BÁO CÁO KIỂM THỬ GIÁ TRỊ BIÊN (BOUNDARY TESTING REPORT)

## Tính năng: FR-03 - Quên mật khẩu và Đặt lại mật khẩu (Forgot password and password reset - two steps)
## II. Phương pháp Phân tích giá trị biên (Boundary Value Analysis - BVA)

### Step 1: Xác định các biến có giá trị biên
Trong tính năng này, có 2 trường dữ liệu có ranh giới rõ ràng cần phân tích biên:
1. **Độ dài Mã OTP (4 số):** Ranh giới xét duyệt là bắt buộc bằng đúng 4 ký tự số.
2. **Độ dài Mật khẩu mới:** Ranh giới xét duyệt là độ dài tối thiểu phải bằng 8 ký tự.

### Step 2: Xác định các điểm biên cần kiểm thử (3-point BVA)

* **Ranh giới Độ dài Mã OTP (Mốc biên: 4 ký tự):**
  * Giá trị ngay dưới biên ($Min - 1$): Độ dài OTP = 3 ký tự (Ví dụ: `123`) $\rightarrow$ Kết quả mong đợi: Hệ thống từ chối và báo lỗi OTP không đúng định dạng.
  * Giá trị chính xác tại biên ($Min$ hoặc $Max$): Độ dài OTP = 4 ký tự (Ví dụ: `6430`) $\rightarrow$ Kết quả mong đợi: Hệ thống chấp nhận (thành công, nếu trùng với OTP được hệ thống sinh ra).
  * Giá trị ngay trên biên ($Max + 1$): Độ dài OTP = 5 ký tự (Ví dụ: `64301`) $\rightarrow$ Kết quả mong đợi: Hệ thống từ chối và báo lỗi OTP không đúng định dạng.

* **Ranh giới Độ dài Mật khẩu mới (Mốc biên: 8 ký tự):**
  * Giá trị ngay dưới biên ($Min - 1$): Độ dài Mật khẩu = 7 ký tự (Ví dụ: `Aa@1234`) $\rightarrow$ Kết quả mong đợi: Trình duyệt hiển thị Alert báo lỗi mật khẩu quá yếu.
  * Giá trị chính xác tại biên ($Min$): Độ dài Mật khẩu = 8 ký tự (Ví dụ: `Aa@12345`) $\rightarrow$ Kết quả mong đợi: Đặt lại mật khẩu thành công và cập nhật vào hệ thống.
  * Giá trị ngay trên biên ($Min + 1$): Độ dài Mật khẩu = 9 ký tự (Ví dụ: `Aa@123456`) $\rightarrow$ Kết quả mong đợi: Đặt lại mật khẩu thành công và cập nhật vào hệ thống.

---

### Step 3: Thiết kế BVA Test Data Matrix

Bảng ma trận kiểm thử giá trị biên dưới đây áp dụng nguyên tắc **đơn biến** (giữ các trường không liên quan ở giá trị hợp lệ tiêu chuẩn để kiểm tra độc lập các điểm biên):

| BVA_ID | email | otpCode | newPassword | Kết quả mong đợi theo BVA | Loại điểm biên kiểm tra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BVA_01** | `test_user@gmail.com` | `123` | `Aa@12345` | Báo lỗi định dạng mã OTP (OTP sai định dạng). | Ngay dưới biên dưới độ dài OTP ($Min - 1$) |
| **BVA_02** | `test_user@gmail.com` | `6430` | `Aa@12345` | **[Thành công]** Đổi mật khẩu thành công. *(Giả định OTP hệ thống cấp là `6430`)* | Chính xác tại biên độ dài OTP ($Min$/$Max$) |
| **BVA_03** | `test_user@gmail.com` | `64301` | `Aa@12345` | Báo lỗi định dạng mã OTP (OTP sai định dạng). | Ngay trên biên trên độ dài OTP ($Max + 1$) |
| **BVA_04** | `test_user@gmail.com` | `6430` | `Aa@1234` | Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."` | Ngay dưới biên dưới độ dài mật khẩu ($Min - 1$) |
| **BVA_05** | `test_user@gmail.com` | `6430` | `Aa@12345` | **[Thành công]** Đổi mật khẩu thành công. *(Giả định OTP hệ thống cấp là `6430`)* | Chính xác tại biên dưới độ dài mật khẩu ($Min$) |
| **BVA_06** | `test_user@gmail.com` | `6430` | `Aa@123456` | **[Thành công]** Đổi mật khẩu thành công. *(Giả định OTP hệ thống cấp là `6430`)* | Ngay trên biên dưới độ dài mật khẩu ($Min + 1$) |

---

## Tính năng: FR-09 - Mã Giảm Giá (Coupon)
## II. Phương pháp Phân tích giá trị biên (Boundary Value Analysis - BVA)

### Step 1: Xác định các biến có giá trị biên
Trong tính năng này, có 3 trường dữ liệu có ranh giới rõ ràng cần phân tích biên:
1. **Tổng giá trị đơn hàng (`total_amount`):** Ranh giới xét duyệt là lớn hơn hoặc bằng (`>=`) ngưỡng tối thiểu `min_order_amount` của mã coupon.
2. **Số lần người dùng đã sử dụng mã (`usage_count`):** Ranh giới xét duyệt là nhỏ hơn (`<`) số lần dùng tối đa `max_uses_per_user` của mã coupon.
3. **Ngày áp dụng mã (`current_date`):** Ranh giới xét duyệt là phải trước (`<`) ngày hết hạn `expired_at` của mã coupon.

### Step 2: Xác định các điểm biên cần kiểm thử (3-point BVA)

* **Ranh giới Ngưỡng đơn hàng tối thiểu (Mốc biên: `min_order_amount = 300,000` của mã `SAVE10`):**
  * Giá trị ngay dưới biên ($Min - 1$): `299,999` ₫ $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi giá trị đơn hàng chưa đủ ngưỡng tối thiểu.
  * Giá trị chính xác tại biên ($Min$): `300,000` ₫ $\rightarrow$ Kết quả mong đợi: Thành công, mã giảm giá được áp dụng.
  * Giá trị ngay trên biên ($Min + 1$): `300,001` ₫ $\rightarrow$ Kết quả mong đợi: Thành công, mã giảm giá được áp dụng.

* **Ranh giới Lượt sử dụng tối đa (Mốc biên: `max_uses_per_user = 1` của mã `SAVE10`):**
  * Giá trị ngay dưới biên ($Max - 1$): `0` lần sử dụng trước đó $\rightarrow$ Kết quả mong đợi: Thành công, mã giảm giá được áp dụng.
  * Giá trị chính xác tại biên ($Max$): `1` lần sử dụng trước đó $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi người dùng đã đạt giới hạn sử dụng mã.
  * Giá trị ngay trên biên ($Max + 1$): `2` lần sử dụng trước đó $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi người dùng đã đạt giới hạn sử dụng mã.

* **Ranh giới Ngày hết hạn (Mốc biên: `expired_at = 2099-12-31` của mã `SAVE10`):**
  * Giá trị ngay dưới biên ($Max - 1$ ngày): Ngày áp dụng là `2099-12-30` $\rightarrow$ Kết quả mong đợi: Thành công, mã giảm giá được áp dụng.
  * Giá trị chính xác tại biên ($Max$ ngày): Ngày áp dụng là `2099-12-31` $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi mã giảm giá đã hết hạn.
  * Giá trị ngay trên biên ($Max + 1$ ngày): Ngày áp dụng là `2100-01-01` $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi mã giảm giá đã hết hạn.

---

### Step 3: Thiết kế BVA Test Data Matrix
Bảng ma trận kiểm thử giá trị biên dưới đây áp dụng nguyên tắc **đơn biến** (giữ các trường không liên quan ở giá trị hợp lệ tiêu chuẩn để kiểm tra độc lập các điểm biên):

| BVA_ID | code | total_amount | user_id (lượt dùng) | current_date | Kết quả mong đợi theo BVA | Loại điểm biên kiểm tra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BVA_07** | `SAVE10` | `299999` | `1` (đã dùng: 0) | `2026-07-07` | Báo lỗi đơn hàng không đủ ngưỡng tối thiểu. | Ngay dưới biên dưới ngưỡng đơn hàng ($Min - 1$) |
| **BVA_08** | `SAVE10` | `300000` | `1` (đã dùng: 0) | `2026-07-07` | **[Thành công]** Áp dụng thành công. Giảm: `30,000 ₫`. | Chính xác tại biên dưới ngưỡng đơn hàng ($Min$) |
| **BVA_09** | `SAVE10` | `300001` | `1` (đã dùng: 0) | `2026-07-07` | **[Thành công]** Áp dụng thành công. Giảm: `30,000 ₫`. | Ngay trên biên dưới ngưỡng đơn hàng ($Min + 1$) |
| **BVA_10** | `SAVE10` | `350000` | `1` (đã dùng: 0) | `2026-07-07` | **[Thành công]** Áp dụng thành công. Giảm: `35,000 ₫`. | Ngay dưới biên trên số lần sử dụng ($Max - 1$) |
| **BVA_11** | `SAVE10` | `350000` | `1` (đã dùng: 1) | `2026-07-07` | Báo lỗi đã dùng hết giới hạn số lần cho phép. | Chính xác tại biên trên số lần sử dụng ($Max$) |
| **BVA_12** | `SAVE10` | `350000` | `1` (đã dùng: 2) | `2026-07-07` | Báo lỗi đã dùng hết giới hạn số lần cho phép. | Ngay trên biên trên số lần sử dụng ($Max + 1$) |
| **BVA_13** | `SAVE10` | `350000` | `1` (đã dùng: 0) | `2099-12-30` | **[Thành công]** Áp dụng thành công. Giảm: `35,000 ₫`. | Ngay dưới biên ngày hết hạn ($Max - 1$ ngày) |
| **BVA_14** | `SAVE10` | `350000` | `1` (đã dùng: 0) | `2099-12-31` | Báo lỗi mã giảm giá đã hết hạn. | Chính xác tại biên ngày hết hạn ($Max$ ngày) |
| **BVA_15** | `SAVE10` | `350000` | `1` (đã dùng: 0) | `2100-01-01` | Báo lỗi mã giảm giá đã hết hạn. | Ngay trên biên ngày hết hạn ($Max + 1$ ngày) |

---

## Tính năng: FR-17 - Quản lý Mã Giảm Giá (Coupon CRUD)

### Step 1: Xác định các biến có giá trị biên
Trong tính năng này, có 3 trường dữ liệu có ranh giới rõ ràng cần phân tích biên:
1. **Giá trị giảm giá (`discount_value`):** Ranh giới xét duyệt là số nguyên dương (`> 0`, tối thiểu bằng 1).
2. **Ngưỡng đơn hàng tối thiểu (`min_order_amount`):** Ranh giới xét duyệt là lớn hơn hoặc bằng 0 (`>= 0`).
3. **Số lượt sử dụng tối đa của mỗi người dùng (`max_uses_per_user`):** Ranh giới xét duyệt là lớn hơn hoặc bằng 1 (`>= 1`).

### Step 2: Xác định các điểm biên cần kiểm thử (3-point BVA)

* **Ranh giới Giá trị giảm giá (Mốc biên: `discount_value = 1`):**
  * Giá trị ngay dưới biên ($Min - 1$): `0` $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi giá trị giảm giá phải lớn hơn 0.
  * Giá trị chính xác tại biên ($Min$): `1` $\rightarrow$ Kết quả mong đợi: Thành công, tạo coupon thành công.
  * Giá trị ngay trên biên ($Min + 1$): `2` $\rightarrow$ Kết quả mong đợi: Thành công, tạo coupon thành công.

* **Ranh giới Ngưỡng đơn hàng tối thiểu (Mốc biên: `min_order_amount = 0`):**
  * Giá trị ngay dưới biên ($Min - 1$): `-1` $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi giá trị đơn hàng tối thiểu không được nhỏ hơn 0.
  * Giá trị chính xác tại biên ($Min$): `0` $\rightarrow$ Kết quả mong đợi: Thành công, tạo coupon thành công.
  * Giá trị ngay trên biên ($Min + 1$): `1` $\rightarrow$ Kết quả mong đợi: Thành công, tạo coupon thành công.

* **Ranh giới Lượt sử dụng tối đa của mỗi người dùng (Mốc biên: `max_uses_per_user = 1`):**
  * Giá trị ngay dưới biên ($Min - 1$): `0` $\rightarrow$ Kết quả mong đợi: Thất bại, hệ thống báo lỗi lượt dùng tối đa phải lớn hơn hoặc bằng 1.
  * Giá trị chính xác tại biên ($Min$): `1` $\rightarrow$ Kết quả mong đợi: Thành công, tạo coupon thành công.
  * Giá trị ngay trên biên ($Min + 1$): `2` $\rightarrow$ Kết quả mong đợi: Thành công, tạo coupon thành công.

---

### Step 3: Thiết kế BVA Test Data Matrix
Bảng ma trận kiểm thử giá trị biên dưới đây áp dụng nguyên tắc **đơn biến** (giữ các trường không liên quan ở giá trị hợp lệ tiêu chuẩn để kiểm tra độc lập các điểm biên):

| BVA_ID | code | type | discount_value | expired_at | min_order_amount | max_uses_per_user | Kết quả mong đợi theo BVA | Loại điểm biên kiểm tra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BVA_16** | `DISCZERO` | `percent` | `0` | `2099-12-31` | `200000` | `2` | Báo lỗi giá trị giảm phải lớn hơn 0. | Ngay dưới biên dưới giá trị giảm ($Min - 1$) |
| **BVA_17** | `DISCMIN` | `percent` | `1` | `2099-12-31` | `200000` | `2` | **[Thành công]** Tạo mã thành công. | Chính xác tại biên dưới giá trị giảm ($Min$) |
| **BVA_18** | `DISCMINPLUS` | `percent` | `2` | `2099-12-31` | `200000` | `2` | **[Thành công]** Tạo mã thành công. | Ngay trên biên dưới giá trị giảm ($Min + 1$) |
| **BVA_19** | `MINORDERNEG` | `percent` | `15` | `2099-12-31` | `-1` | `2` | Báo lỗi ngưỡng tối thiểu không được nhỏ hơn 0. | Ngay dưới biên dưới ngưỡng đơn hàng ($Min - 1$) |
| **BVA_20** | `MINORDERZERO` | `percent` | `15` | `2099-12-31` | `0` | `2` | **[Thành công]** Tạo mã thành công. | Chính xác tại biên dưới ngưỡng đơn hàng ($Min$) |
| **BVA_21** | `MINORDERMIN` | `percent` | `15` | `2099-12-31` | `1` | `2` | **[Thành công]** Tạo mã thành công. | Ngay trên biên dưới ngưỡng đơn hàng ($Min + 1$) |
| **BVA_22** | `USESZERO` | `percent` | `15` | `2099-12-31` | `200000` | `0` | Báo lỗi lượt dùng phải lớn hơn hoặc bằng 1. | Ngay dưới biên dưới lượt sử dụng ($Min - 1$) |
| **BVA_23** | `USESMIN` | `percent` | `15` | `2099-12-31` | `200000` | `1` | **[Thành công]** Tạo mã thành công. | Chính xác tại biên dưới lượt sử dụng ($Min$) |
| **BVA_24** | `USESMINPLUS` | `percent` | `15` | `2099-12-31` | `200000` | `2` | **[Thành công]** Tạo mã thành công. | Ngay trên biên dưới lượt sử dụng ($Min + 1$) |

---

## Tính năng: FR-01 - Đăng ký tài khoản

### Step 1: Xác định các biến có giá trị biên
Trong tính năng này, có 1 trường dữ liệu có ranh giới rõ ràng cần phân tích biên:
1. **Độ dài Mật khẩu mới (`password`):** Ranh giới xét duyệt là độ dài tối thiểu phải bằng 8 ký tự.

### Step 2: Xác định các điểm biên cần kiểm thử (3-point BVA)

* **Ranh giới Độ dài Mật khẩu mới (Mốc biên: 8 ký tự):**
  * Giá trị ngay dưới biên ($Min - 1$): Độ dài Mật khẩu = 7 ký tự (Ví dụ: `Aa@1234`) $\rightarrow$ Kết quả mong đợi: Hệ thống báo lỗi mật khẩu quá yếu (không đủ độ phức tạp).
  * Giá trị chính xác tại biên ($Min$): Độ dài Mật khẩu = 8 ký tự (Ví dụ: `Aa@12345`) $\rightarrow$ Kết quả mong đợi: Đăng ký tài khoản thành công.
  * Giá trị ngay trên biên ($Min + 1$): Độ dài Mật khẩu = 9 ký tự (Ví dụ: `Aa@123456`) $\rightarrow$ Kết quả mong đợi: Đăng ký tài khoản thành công.

---

### Step 3: Thiết kế BVA Test Data Matrix
Bảng ma trận kiểm thử giá trị biên dưới đây áp dụng nguyên tắc **đơn biến** (giữ các trường không liên quan ở giá trị hợp lệ tiêu chuẩn để kiểm tra độc lập các điểm biên):

| BVA_ID | name | email | password | confirmPassword | Kết quả mong đợi theo BVA | Loại điểm biên kiểm tra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BVA_25** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@1234` | `Aa@1234` | Báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."`. | Ngay dưới biên dưới độ dài mật khẩu ($Min - 1$) |
| **BVA_26** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@12345` | `Aa@12345` | **[Thành công]** Đăng ký tài khoản thành công. | Chính xác tại biên dưới độ dài mật khẩu ($Min$) |
| **BVA_27** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@123456` | `Aa@123456` | **[Thành công]** Đăng ký tài khoản thành công. | Ngay trên biên dưới độ dài mật khẩu ($Min + 1$) |



