# BÁO CÁO KIỂM THỬ MIỀN (DOMAIN TESTING REPORT)
## Tính năng: FR-03 - Quên mật khẩu và Đặt lại mật khẩu (Forgot password and password reset - two steps)


### Step 1: Xác định Input & Output

* **Input:**
  * `email` (Chuỗi - String)
  * `otpCode` (Chuỗi ký tự số - String)
  * `newPassword` (Chuỗi - String)

* **Output:**
  * **Thành công (Success):** Đặt lại mật khẩu thành công và cập nhật vào hệ thống. Trình duyệt hiển thị cảnh báo alert: `"Đổi mật khẩu thành công!"` và chuyển hướng người dùng về trang đăng nhập `/login`.
  * **Thất bại 1 (Email không tồn tại):** Hiển thị lỗi `"User not found"` (thông báo lỗi trả về từ API `/api/forgot-password` ở Bước 1).
  * **Thất bại 2 (OTP trống / sai định dạng / không trùng khớp):**
    * *OTP trống:* Bị chặn submit bởi thuộc tính `required` của trình duyệt.
    * *OTP sai/không trùng khớp:* Trình duyệt hiển thị alert: `"Mã OTP không đúng hoặc có lỗi xảy ra."` 
  * **Thất bại 3 (Mật khẩu mới không đủ độ phức tạp):** Hiển thị Browser Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."`.

---

### Step 2: Xác định Condition (Điều kiện)

* **`email`:**
  * Phải đúng định dạng email VÀ Phải tồn tại trong cơ sở dữ liệu hệ thống (tương khớp với tài khoản `test_user@gmail.com`).

* **`otpCode` (Mã OTP):**
  * Không được để trống VÀ Phải có độ dài đúng 4 ký tự VÀ Phải chỉ chứa các ký tự số (0-9) VÀ Phải trùng khớp hoàn toàn với OTP được hệ thống sinh ra và hiển thị tại banner xanh lá ở Bước 2.

* **`newPassword` (Mật khẩu mới):**
  * **Theo Đặc tả Nghiệp vụ (Spec-compliant):**
    * Độ dài tối thiểu 8 ký tự VÀ Chứa ít nhất 1 chữ cái viết hoa (A-Z) VÀ Chứa ít nhất 1 chữ cái viết thường (a-z) VÀ Chứa ít nhất 1 chữ số (0-9) VÀ Chứa ít nhất 1 ký tự đặc biệt (`@`, `#`, `!`, `$`,...).
  * **Theo Triển khai Thực tế (Buggy Regex Code-compliant):**
    * Độ dài tối thiểu 8 ký tự VÀ Chứa ít nhất 1 chữ cái viết hoa (A-Z) VÀ Chứa ít nhất 1 chữ cái viết thường (a-z) VÀ Chứa ít nhất 1 chữ số (0-9) VÀ Chứa ít nhất 1 khoảng trắng (`\s`) VÀ Chỉ bao gồm ký tự trong tập `[A-Za-z\d\s]` (không cho phép ký tự đặc biệt thực sự).

---

### Step 3: Xác định miền EP (Phân vùng tương đương)

#### 1. Đối với `email`
* $E_1$: Email đúng định dạng và tồn tại trong hệ thống (Valid) *(Ví dụ: `test_user@gmail.com`)*.
* $E_2$: Email đúng định dạng nhưng không tồn tại trong hệ thống (Invalid) *(Ví dụ: `nonexistent_user@gmail.com`)*.
* $E_3$: Email sai định dạng hoặc để trống (Invalid) *(Ví dụ: `test_user_gmail.com`, `test_user@`, `@gmail.com`, `""`)*.

#### 2. Đối với `otpCode` (Mã OTP 4 số)
* $E_4$: OTP đúng định dạng (4 số) và trùng khớp hoàn toàn với OTP được hệ thống cấp (Valid) *(Ví dụ: `6430` khi mã hiển thị ở banner là `6430`)*.
* $E_5$: OTP để trống (Invalid) *(Ví dụ: `""`)*.
* $E_6$: OTP sai độ dài (ít hơn hoặc nhiều hơn 4 số) (Invalid) *(Ví dụ: `123`, `12345`)*.
* $E_7$: OTP chứa ký tự không phải là số (Invalid) *(Ví dụ: `64a0`, `abcd`, `fdgfdg`)*.
* $E_8$: OTP đúng định dạng (4 số) nhưng không trùng khớp với OTP của hệ thống (Invalid) *(Ví dụ: `9999` khi mã hệ thống là `6430`)*.

#### 3. Đối với `newPassword` (Mật khẩu mới)
* **Các phân vùng theo Đặc tả nghiệp vụ (Spec-compliant):**
  * $E_9$: Mật khẩu từ 8 ký tự trở lên, chứa đầy đủ chữ hoa, chữ thường, chữ số và ký tự đặc biệt (Valid theo Spec) *(Ví dụ: `Aa@12345`)*.
  * $E_{10}$: Mật khẩu ngắn hơn 8 ký tự (Invalid) *(Ví dụ: `Aa@123`)*.
  * $E_{11}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ cái viết hoa (Invalid) *(Ví dụ: `aa@12345`)*.
  * $E_{12}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ cái viết thường (Invalid) *(Ví dụ: `AA@12345`)*.
  * $E_{13}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ số (Invalid) *(Ví dụ: `Aa@ccccc`)*.
  * $E_{14}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu ký tự đặc biệt (Invalid) *(Ví dụ: `Aa123456`)*.

---

### Step 4: Xác định Test Data (Ma trận dữ liệu kiểm thử)


| ID | email | otpCode | newPassword | Kết quả mong đợi | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `test_user@gmail.com` | `6430` | `Aa@12345` | **[Thành công]** Đặt lại mật khẩu thành công. | $E_1, E_4, E_9$ |
| **2** | `nonexistent_user@gmail.com` | `6430` | `Aa@12345` | Báo lỗi: `"User not found"` (ở Bước 1) | $E_2$ |
| **3** | `test_user_gmail.com` | `6430` | `Aa@12345` | Báo lỗi định dạng email (HTML5 validation) | $E_3$ |
| **4** | `test_user@gmail.com` | `""` | `Aa@12345` | Báo lỗi: OTP trống (chặn submit) | $E_5$ |
| **5** | `test_user@gmail.com` | `123` | `Aa@12345` | Báo lỗi: `"Mã OTP không đúng hoặc có lỗi xảy ra."` | $E_6$ |
| **6** | `test_user@gmail.com` | `fdgfdg` | `Aa@12345` | Báo lỗi: `"Mã OTP không đúng hoặc có lỗi xảy ra."` | $E_7$ |
| **7** | `test_user@gmail.com` | `9999` | `Aa@12345` | Báo lỗi: `"Mã OTP không đúng hoặc có lỗi xảy ra."` | $E_8$ |
| **8** | `test_user@gmail.com` | `6430` | `Aa@123` | Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."` | $E_{10}$ |
| **9** | `test_user@gmail.com` | `6430` | `aa@12345` | Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."` | $E_{11}$ |
| **10** | `test_user@gmail.com` | `6430` | `AA@12345` | Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."` | $E_{12}$ |
| **11** | `test_user@gmail.com` | `6430` | `Aa@ccccc` | Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."` | $E_{13}$ |
| **12** | `test_user@gmail.com` | `6430` | `Aa123456` | Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."` | $E_{14}$ |

---

## Tính năng: FR-09 - Mã Giảm Giá (Coupon)

### Step 1: Xác định Input & Output

* **Input:**
  * `code` (Chuỗi - String)
  * `total_amount` (Số nguyên - Integer)
  * `user_id` (Số nguyên / Chuỗi - Integer/String hoặc `null` nếu người dùng chưa đăng nhập)

* **Output:**
  * **Thành công (Success):** Áp dụng mã giảm giá thành công, trả về trạng thái `success: true` cùng số tiền giảm (`discount_amount`) và số tiền cần thanh toán cuối cùng (`final_amount`). Thông báo phản hồi: `"Áp dụng thành công! Giảm ..."`
  * **Thất bại 1 (Mã không tồn tại / vô hiệu hóa):** Trả về mã lỗi 404/400 kèm thông báo `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`.
  * **Thất bại 2 (Hết hạn sử dụng):** thông báo `"Mã giảm giá đã hết hạn"`.
  * **Thất bại 3 (Không đủ ngưỡng đơn hàng tối thiểu):** thông báo `"Đơn hàng chưa đủ giá trị tối thiểu ... để áp dụng mã này"`.
  * **Thất bại 4 (Chưa đăng nhập):** Chặn áp dụng coupon và yêu cầu đăng nhập (theo yêu cầu nghiệp vụ bắt buộc phải có JWT Token).
  * **Thất bại 5 (Hết lượt sử dụng):** thông báo `"Bạn đã sử dụng mã này [max_uses] lần (đã đạt giới hạn)"`.

---

### Step 2: Xác định Condition (Điều kiện)

* **`code`:**
  * C1 (Mã tồn tại): Mã nhập vào phải tồn tại trong cơ sở dữ liệu VÀ Đang ở trạng thái kích hoạt (`is_active = 1`).
  * C2 (Còn hạn dùng): Ngày hệ thống hiện tại phải nhỏ hơn hoặc bằng `expired_at`.

* **`total_amount`:**
  * C3 (Đủ ngưỡng): `total_amount` phải lớn hơn hoặc bằng (`>=`) giá trị `min_order_amount` của mã.

* **`user_id` (Trạng thái người dùng):**
  * C4 (Đã đăng nhập): Người dùng phải được xác thực và gửi kèm `user_id` hợp lệ.
  * C5 (Chưa dùng hết lượt): Số lần dùng mã của user trong bảng `coupon_usage` phải nhỏ hơn (`<`) `max_uses_per_user`.


---

### Step 3: Xác định miền EP (Phân vùng tương đương)

#### 1. Đối với `code`
* $E_{15}$: Mã tồn tại trong cơ sở dữ liệu và đang hoạt động (`is_active = 1`) (Valid) *(Ví dụ: `SAVE10`)*.
* $E_{16}$: Mã tồn tại nhưng đã bị vô hiệu hóa (`is_active = 0`) (Invalid) *(Ví dụ: `VIP100_DISABLED`)*.
* $E_{17}$: Mã không tồn tại trong hệ thống (Invalid) *(Ví dụ: `NOSUCHCODE`)*.
* $E_{18}$: Mã tồn tại nhưng đã hết hạn (Invalid) *(Ví dụ: `EXPIRED`)*.

#### 2. Đối với `total_amount` (Tổng giá trị đơn hàng)
*Xét với mã `SAVE10` có `min_order_amount = 300,000`:*
* $E_{19}$: Tổng đơn hàng lớn hơn ngưỡng tối thiểu (`total_amount > min_order_amount`) (Valid) *(Ví dụ: `350,000`)*.
* $E_{20}$: Tổng đơn hàng bằng đúng ngưỡng tối thiểu (`total_amount == min_order_amount`) (Valid theo Spec, nhưng Invalid theo Code lỗi hiện tại) *(Ví dụ: `300,000`)*.
* $E_{21}$: Tổng đơn hàng nhỏ hơn ngưỡng tối thiểu (`total_amount < min_order_amount`) (Invalid) *(Ví dụ: `250,000`)*.

#### 3. Đối với `user_id` (Xác thực và Lượt sử dụng)
*Xét với user và mã `SAVE10` có `max_uses_per_user = 1`:*
* $E_{22}$: Người dùng đã đăng nhập và chưa dùng hết lượt sử dụng (`usage_count < max_uses`) (Valid) *(Ví dụ: `user_id = 1` có số lần dùng là `0`)*.
* $E_{23}$: Người dùng chưa đăng nhập (`user_id = null` hoặc không gửi JWT) (Invalid theo Spec, nhưng Valid theo Code hiện tại do thiếu xác thực) *(Ví dụ: `user_id = null`)*.
* $E_{24}$: Người dùng đã đăng nhập nhưng đã sử dụng hết lượt (`usage_count >= max_uses`) (Invalid) *(Ví dụ: `user_id = 1` có số lần dùng trước đó là `1`)*.

---

### Step 4: Xác định Test Data (Ma trận dữ liệu kiểm thử)

Bảng ma trận kiểm thử dưới đây áp dụng nguyên tắc **đơn biến biến đổi** để kiểm tra độ bao phủ cho từng miền phân vùng của tính năng FR-09:

Chiến lược thiết kế kịch bản dựa trên nguyên tắc **Đơn biến biến đổi**: Ca kiểm thử `ID 13` và `ID 14` đại diện cho kịch bản lý tưởng (Happy Path) bao phủ toàn bộ các phân vùng hợp lệ. Các ca kiểm thử từ `ID 15` đến `ID 20` lần lượt kích hoạt duy nhất một phân vùng không hợp lệ (`Invalid EP`) trong khi giữ nguyên trạng thái hợp lệ của các biến còn lại để kiểm tra độc lập khả năng xử lý lỗi ngoại lệ của hệ thống.

| ID | code | total_amount | user_id | Kết quả mong đợi | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **13** | `SAVE10` | `350000` | `1` (đã dùng: 0) | **[Thành công]** Áp dụng thành công. Giảm: `35,000 ₫`. Cần trả: `315,000 ₫`. | $E_{15}, E_{19}, E_{22}$ |
| **14** | `VIP100` | `300000` | `1` (đã dùng: 0) | **[Thành công]** Áp dụng thành công. Giảm: `100,000 ₫`. Cần trả: `200,000 ₫`. | $E_{15}, E_{20}, E_{22}$ |
| **15** | `VIP100_DISABLED` | `350000` | `1` (đã dùng: 0) | Báo lỗi `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`. | $E_{16}$ |
| **16** | `NOSUCHCODE` | `350000` | `1` (đã dùng: 0) | Báo lỗi `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`. | $E_{17}$ |
| **17** | `EXPIRED` | `350000` | `1` (đã dùng: 0) | Báo lỗi `"Mã giảm giá đã hết hạn"`. | $E_{18}$ |
| **18** | `SAVE10` | `250000` | `1` (đã dùng: 0) | Báo lỗi `"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"`. | $E_{21}$ |
| **19** | `SAVE10` | `350000` | `null` | Báo lỗi `"Yêu cầu đăng nhập để áp dụng mã giảm giá"`. | $E_{23}$ |
| **20** | `SAVE10` | `350000` | `1` (đã dùng: 1) | Báo lỗi `"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"`. | $E_{24}$ |

