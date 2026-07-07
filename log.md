# Log 1
# BÁO CÁO KIỂM THỬ MIỀN (DOMAIN TESTING REPORT)
### Tính năng: FR-03 - Quên mật khẩu và Đặt lại mật khẩu (Forgot password and password reset - two steps)

Báo cáo này được thực hiện bởi Kỹ sư kiểm thử chuyên nghiệp dựa trên tài liệu đặc tả nghiệp vụ, các hình ảnh giao diện UI cung cấp và phân tích trực tiếp mã nguồn Frontend/Backend hiện tại.

#### Tóm tắt phát hiện quan trọng (Critical Bug Found)
Trong quá trình phân tích, chúng tôi đã phát hiện một **lỗi logic nghiêm trọng (Logic Bug)** giữa Đặc tả nghiệp vụ và Triển khai thực tế tại Frontend:
* **Đặc tả yêu cầu:** Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt (`@, #, !, $,...`).
* **Mã nguồn thực tế (`ForgotPassword.jsx` dòng 26):**
  `const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;`
  * Biểu thức này bắt buộc phải có **khoảng trắng** (`\s`) thay vì ký tự đặc biệt.
  * Chỉ cho phép các ký tự chữ, số và khoảng trắng (`[A-Za-z\d\s]`), đồng thời cấm toàn bộ các ký tự đặc biệt thực tế (`@, #, !, $,...`).
* **Độ ưu tiên kiểm tra (Precedence):** Validation mật khẩu được thực hiện hoàn toàn ở Frontend (Client-side), trong khi kiểm tra OTP được thực hiện ở Backend (Server-side). Do đó, nếu mật khẩu không thỏa mãn kiểm tra ở Client, hệ thống sẽ cảnh báo lỗi mật khẩu ngay lập tức bằng Browser Alert và không gửi yêu cầu kiểm tra OTP lên máy chủ.

Do có sự sai khác lớn này, Báo cáo kiểm thử thiết lập các phân vùng tương đương và Ma trận dữ liệu kiểm thử riêng biệt để vừa kiểm thử theo **Đặc tả nghiệp vụ (Spec-compliant)** vừa kiểm tra theo **Hiện trạng mã nguồn (Code-compliant / Bug Verification)**.

---

## Step 1: Xác định Input & Output

* **Input:**
  * `email` (Chuỗi - String)
  * `resetToken` (Chuỗi ký tự số - String)
  * `newPassword` (Chuỗi - String)

* **Output:**
  * **Thành công (Success):** Đặt lại mật khẩu thành công và cập nhật vào hệ thống. Trình duyệt hiển thị cảnh báo alert: `"Đổi mật khẩu thành công!"` và chuyển hướng người dùng về trang đăng nhập `/login`.
  * **Thất bại 1 (Email không tồn tại):** Hiển thị lỗi `"User not found"` (thông báo lỗi trả về từ API `/api/forgot-password` ở Bước 1).
  * **Thất bại 2 (OTP trống / sai định dạng / không trùng khớp):**
    * *OTP trống:* Bị chặn submit bởi thuộc tính `required` của trình duyệt.
    * *OTP sai/không trùng khớp:* Trình duyệt hiển thị alert: `"Mã OTP không đúng hoặc có lỗi xảy ra."` (lỗi trả về từ API `/api/reset-password` ở Bước 2).
  * **Thất bại 3 (Mật khẩu mới không đủ độ phức tạp):** Hiển thị Browser Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."`.

---

## Step 2: Xác định Condition (Điều kiện)

* **`email`:**
  * Phải đúng định dạng email VÀ Phải tồn tại trong cơ sở dữ liệu hệ thống (tương khớp với tài khoản `test_user@gmail.com`).

* **`resetToken` (Mã OTP):**
  * Không được để trống VÀ Phải có độ dài đúng 4 ký tự VÀ Phải chỉ chứa các ký tự số (0-9) VÀ Phải trùng khớp hoàn toàn với OTP được hệ thống sinh ra và hiển thị tại banner xanh lá ở Bước 2.

* **`newPassword` (Mật khẩu mới):**
  * **Theo Đặc tả Nghiệp vụ (Spec-compliant):**
    * Độ dài tối thiểu 8 ký tự VÀ Chứa ít nhất 1 chữ cái viết hoa (A-Z) VÀ Chứa ít nhất 1 chữ cái viết thường (a-z) VÀ Chứa ít nhất 1 chữ số (0-9) VÀ Chứa ít nhất 1 ký tự đặc biệt (`@`, `#`, `!`, `$`,...).
  * **Theo Triển khai Thực tế (Buggy Regex Code-compliant):**
    * Độ dài tối thiểu 8 ký tự VÀ Chứa ít nhất 1 chữ cái viết hoa (A-Z) VÀ Chứa ít nhất 1 chữ cái viết thường (a-z) VÀ Chứa ít nhất 1 chữ số (0-9) VÀ Chứa ít nhất 1 khoảng trắng (`\s`) VÀ Chỉ bao gồm ký tự trong tập `[A-Za-z\d\s]` (không cho phép ký tự đặc biệt thực sự).

---

## Step 3: Xác định miền EP (Phân vùng tương đương)

### 1. Đối với `email`
* $E_1$: Email đúng định dạng và tồn tại trong hệ thống (Valid) *(Ví dụ: `test_user@gmail.com`)*.
* $E_2$: Email đúng định dạng nhưng không tồn tại trong hệ thống (Invalid) *(Ví dụ: `nonexistent_user@gmail.com`)*.
* $E_3$: Email sai định dạng hoặc để trống (Invalid) *(Ví dụ: `test_user_gmail.com`, `test_user@`, `@gmail.com`, `""`)*.

### 2. Đối với `resetToken` (Mã OTP 4 số)
* $E_4$: OTP đúng định dạng (4 số) và trùng khớp hoàn toàn với OTP được hệ thống cấp (Valid) *(Ví dụ: `6430` khi mã hiển thị ở banner là `6430`)*.
* $E_5$: OTP để trống (Invalid) *(Ví dụ: `""`)*.
* $E_6$: OTP sai độ dài (ít hơn hoặc nhiều hơn 4 số) (Invalid) *(Ví dụ: `123`, `12345`)*.
* $E_7$: OTP chứa ký tự không phải là số (Invalid) *(Ví dụ: `64a0`, `abcd`, `fdgfdg`)*.
* $E_8$: OTP đúng định dạng (4 số) nhưng không trùng khớp với OTP của hệ thống (Invalid) *(Ví dụ: `9999` khi mã hệ thống là `6430`)*.

### 3. Đối với `newPassword` (Mật khẩu mới)
* **Các phân vùng theo Đặc tả nghiệp vụ (Spec-compliant):**
  * $E_9$: Mật khẩu từ 8 ký tự trở lên, chứa đầy đủ chữ hoa, chữ thường, chữ số và ký tự đặc biệt (Valid theo Spec) *(Ví dụ: `Aa@12345`)*.
  * $E_{10}$: Mật khẩu ngắn hơn 8 ký tự (Invalid) *(Ví dụ: `Aa@123`)*.
  * $E_{11}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ cái viết hoa (Invalid) *(Ví dụ: `aa@12345`)*.
  * $E_{12}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ cái viết thường (Invalid) *(Ví dụ: `AA@12345`)*.
  * $E_{13}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ số (Invalid) *(Ví dụ: `Aa@ccccc`)*.
  * $E_{14}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu ký tự đặc biệt (Invalid) *(Ví dụ: `Aa123456`)*.

* **Các phân vùng đối sánh kiểm tra lỗi mã nguồn (Bug Verification):**
  * $E_{15}$: Mật khẩu chứa khoảng trắng thay vì ký tự đặc biệt (Valid theo Code hiện tại nhưng Invalid theo Spec) *(Ví dụ: `Aa 12345`)*.
  * $E_{16}$: Mật khẩu chứa ký tự đặc biệt và không chứa khoảng trắng (Valid theo Spec nhưng Invalid theo Code hiện tại do lỗi regex) *(Ví dụ: `Aa@12345`)*.

---

## Step 4: Xác định Test Data (Ma trận dữ liệu kiểm thử)

Dưới đây là hai ma trận kiểm thử được xây dựng để đảm bảo tính bao phủ đầy đủ và làm nổi bật sự mâu thuẫn giữa Đặc tả nghiệp vụ và Code hiện tại. Trong mỗi test case lỗi (Negative Path), chúng tôi áp dụng nguyên tắc **đơn biến biến đổi** nhằm tránh hiện tượng che khuất lỗi (masking effect).

### 4.1. Ma trận kiểm thử A: Theo Đặc tả nghiệp vụ (Spec-compliant)
*Baseline kiểm thử lý tưởng sử dụng giá trị đúng theo Đặc tả.*
*(Lưu ý: Các ca kiểm thử dùng mật khẩu $E_9$ dự kiến sẽ thất bại trên giao diện hiện tại do bug regex).*

| ID | email | resetToken | newPassword | Kết quả mong đợi | Phân vùng được bao phủ (Covered EP) |
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

### 4.2. Ma trận kiểm thử B: Theo Mã nguồn hiện tại (Code-compliant / Bug Verification)
*Ma trận này kiểm thử hành vi thực tế của ứng dụng ở phiên bản lỗi hiện tại để phục vụ xác minh bug và làm tài liệu tái hiện lỗi.*

| ID | email | resetToken | newPassword | Kết quả mong đợi trên hệ thống hiện tại | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **13** | `test_user@gmail.com` | `6430` | `Aa 12345` | **[Thành công]** Đổi mật khẩu thành công (Mặc dù vi phạm spec vì chứa khoảng trắng, không chứa ký tự đặc biệt). | $E_1, E_4, E_{15}$ |
| **14** | `test_user@gmail.com` | `6430` | `Aa@12345` | **[Thất bại thực tế]** Hiển thị alert cảnh báo mật khẩu quá yếu (Do regex chặn ký tự đặc biệt `@`, vi phạm spec). | $E_{16}$ |
| **15** | `test_user@gmail.com` | `fdgfdg` | `Aa 12345` | Báo lỗi: `"Mã OTP không đúng hoặc có lỗi xảy ra."` (Vì mật khẩu `Aa 12345` thỏa mãn regex, yêu cầu được gửi lên backend kiểm tra OTP). | $E_7, E_{15}$ |
| **16** | `test_user@gmail.com` | `fdgfdg` | `Aa@12345` | Alert: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."` (Precedence test: OTP sai nhưng mật khẩu cũng sai regex nên bị chặn ở Frontend trước, không báo lỗi OTP). | $E_7, E_{16}$ |


# Log 2 - FR09

## Tính năng: FR-09 - Mã Giảm Giá (Coupon)

### Step 1: Xác định Input & Output

* **Input:**
  * `code` (Chuỗi - String)
  * `total_amount` (Số nguyên - Integer)
  * `user_id` (Số nguyên / Chuỗi - Integer/String hoặc `null` nếu người dùng chưa đăng nhập)

* **Output:**
  * **Thành công (Success):** Áp dụng mã giảm giá thành công, trả về trạng thái `success: true` cùng số tiền giảm (`discount_amount`) và số tiền cần thanh toán cuối cùng (`final_amount`). Thông báo phản hồi: `"Áp dụng thành công! Giảm ..."`
  * **Thất bại 1 (Mã không tồn tại / vô hiệu hóa):** Trả về mã lỗi 404/400 kèm thông báo `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`.
  * **Thất bại 2 (Hết hạn sử dụng):** Trả về mã lỗi 400 kèm thông báo `"Mã giảm giá đã hết hạn"`.
  * **Thất bại 3 (Không đủ ngưỡng đơn hàng tối thiểu):** Trả về mã lỗi 400 kèm thông báo `"Đơn hàng chưa đủ giá trị tối thiểu ... để áp dụng mã này"`.
  * **Thất bại 4 (Chưa đăng nhập):** Chặn áp dụng coupon và yêu cầu đăng nhập (theo yêu cầu nghiệp vụ bắt buộc phải có JWT Token).
  * **Thất bại 5 (Hết lượt sử dụng):** Trả về mã lỗi 400 kèm thông báo `"Bạn đã sử dụng mã này [max_uses] lần (đã đạt giới hạn)"`.

---

### Step 2: Xác định Condition (Điều kiện)

* **`code`:**
  * C1 (Mã tồn tại): Mã nhập vào phải tồn tại trong cơ sở dữ liệu VÀ Đang ở trạng thái kích hoạt (`is_active = 1`).
  * C2 (Còn hạn dùng): Ngày hệ thống hiện tại phải nhỏ hơn hoặc bằng `expired_at`.

* **`total_amount`:**
  * C3 (Đủ ngưỡng): `total_amount` phải lớn hơn hoặc bằng (`>=`) giá trị `min_order_amount` của mã.
  * *Lưu ý (Lỗi logic trong code):* Trong code backend hiện tại đang sử dụng so sánh lớn hơn hẳn `total_amount > coupon.min_order_amount` thay vì lớn hơn hoặc bằng (`>=`), dẫn đến trường hợp đơn hàng bằng đúng ngưỡng sẽ bị từ chối sai quy định.

* **`user_id` (Trạng thái người dùng):**
  * C4 (Đã đăng nhập): Người dùng phải được xác thực và gửi kèm `user_id` hợp lệ.
  * *Lưu ý (Lỗi bảo mật trong code):* Endpoint `/api/apply-coupon` không dùng middleware xác thực, nếu không truyền `user_id` hệ thống vẫn cho phép áp dụng coupon và bỏ qua kiểm tra lượt dùng.
  * C5 (Chưa dùng hết lượt): Số lần dùng mã của user trong bảng `coupon_usage` phải nhỏ hơn (`<`) `max_uses_per_user`.

* **Tính toán giảm giá (Discount Calculation):**
  * *Lưu ý (Lỗi tính toán trong code):* Công thức tính phần trăm trong code hiện tại đang tính sai: `discount_amount = total_amount * (1 - coupon.discount_value)` (đáng lẽ đây là công thức tính số tiền còn lại `final_amount`). Việc này khiến số tiền giảm giá thực tế cực kỳ lớn và khách hàng chỉ phải trả phần rất nhỏ.

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

| ID | code | total_amount | user_id | Kết quả mong đợi theo Đặc tả | Kết quả thực tế (Hành vi mã nguồn hiện tại) | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **13** | `SAVE10` | `350000` | `1` (đã dùng: 0) | **[Thành công]** Áp dụng thành công. Giảm: `35,000 ₫`. Cần trả: `315,000 ₫`. | **[Lỗi tính toán]** Áp dụng thành công nhưng tính sai: Giảm `315,000 ₫`, chỉ cần trả `35,000 ₫`. | $E_{15}, E_{19}, E_{22}$ |
| **14** | `VIP100` | `300000` | `1` (đã dùng: 0) | **[Thành công]** Áp dụng thành công. Giảm: `100,000 ₫`. Cần trả: `200,000 ₫`. | **[Lỗi biên >=]** Báo lỗi `"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"`. | $E_{15}, E_{20}, E_{22}$ |
| **15** | `VIP100_DISABLED` | `350000` | `1` (đã dùng: 0) | Báo lỗi `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`. | Báo lỗi `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`. | $E_{16}$ |
| **16** | `NOSUCHCODE` | `350000` | `1` (đã dùng: 0) | Báo lỗi `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`. | Báo lỗi `"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"`. | $E_{17}$ |
| **17** | `EXPIRED` | `350000` | `1` (đã dùng: 0) | Báo lỗi `"Mã giảm giá đã hết hạn"`. | Báo lỗi `"Mã giảm giá đã hết hạn"`. | $E_{18}$ |
| **18** | `SAVE10` | `250000` | `1` (đã dùng: 0) | Báo lỗi `"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"`. | Báo lỗi `"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"`. | $E_{21}$ |
| **19** | `SAVE10` | `350000` | `null` | **[Thất bại]** Yêu cầu đăng nhập để áp dụng coupon. | **[Lỗi bảo mật]** Áp dụng thành công mà không cần tài khoản, bỏ qua kiểm tra lượt dùng. | $E_{23}$ |
| **20** | `SAVE10` | `350000` | `1` (đã dùng: 1) | Báo lỗi `"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"`. | Báo lỗi `"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"`. | $E_{24}$ |


# Log 3 - FR17

---

## Tính năng: FR-17 - Quản lý Mã Giảm Giá (Coupon CRUD)

### Giả định (Assumptions)
* **Quyền hạn:** Chỉ tài khoản có vai trò `admin` và sở hữu JWT Token hợp lệ mới có quyền thực hiện các thao tác Thêm / Xem / Xóa coupon. Nếu không hợp lệ, hệ thống trả về mã lỗi `401 Unauthorized` hoặc `403 Forbidden`.
* **Phương thức Xóa:** Thao tác xóa thực hiện xóa cứng (hard delete) bản ghi khỏi bảng `coupons` trong CSDL.
* **Xác thực mã trùng:** Hệ thống sẽ kiểm tra trùng lặp `code` trực tiếp thông qua ràng buộc `UNIQUE` của SQLite ở tầng cơ sở dữ liệu.

### Step 1: Xác định Input & Output

* **Input:**
  * `code` (Chuỗi - String, bắt buộc, duy nhất)
  * `type` (Lựa chọn - Select: `percent` hoặc `fixed`, bắt buộc)
  * `discount_value` (Số nguyên - Integer, bắt buộc)
  * `expired_at` (Ngày - Date, định dạng `YYYY-MM-DD`, bắt buộc)
  * `min_order_amount` (Số nguyên - Integer, bắt buộc)
  * `max_uses_per_user` (Số nguyên - Integer, bắt buộc)
  * `id` (Số nguyên - Integer, chỉ sử dụng khi Xóa coupon)

* **Output:**
  * **Thành công (Success):**
    * *Thêm mới:* Tạo thành công coupon, trả về JSON với thông điệp `"Coupon created"` và ID của coupon mới.
    * *Xem danh sách:* Trả về mảng danh sách toàn bộ các coupon trong CSDL.
    * *Xóa coupon:* Xóa thành công bản ghi khỏi CSDL, trả về JSON thông điệp `"Coupon deleted"`.
  * **Thất bại 1 (Trùng mã code):** Trả về mã lỗi 500 với lỗi từ cơ sở dữ liệu (ví dụ: `"SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code"`).
  * **Thất bại 2 (Thiếu trường bắt buộc):** Chặn submit ở phía Frontend (báo lỗi HTML5 validation) hoặc trả về lỗi database constraint nếu bypass frontend.
  * **Thất bại 3 (Giá trị giảm giá không hợp lệ):** Hệ thống từ chối tạo mã và báo lỗi giá trị giảm giá phải lớn hơn 0.
  * **Thất bại 4 (Ngưỡng tối thiểu không hợp lệ):** Hệ thống từ chối tạo mã và báo lỗi ngưỡng tối thiểu phải lớn hơn hoặc bằng 0.
  * **Thất bại 5 (Lượt dùng tối đa không hợp lệ):** Hệ thống từ chối tạo mã và báo lỗi lượt dùng tối đa phải lớn hơn hoặc bằng 1.
  * **Thất bại 6 (Ngày hết hạn không hợp lệ):** Hệ thống báo lỗi định dạng ngày không hợp lệ hoặc không cho phép lưu ngày trong quá khứ.

---

### Step 2: Xác định Condition (Điều kiện)

* **`code`:**
  * C1: Không được để trống VÀ Phải là duy nhất trong bảng `coupons`.

* **`type`:**
  * C2: Bắt buộc thuộc một trong hai giá trị: `percent` hoặc `fixed`.

* **`discount_value`:**
  * C3: Không được để trống VÀ Phải là số dương (`discount_value > 0`).
  * *Lưu ý (Lỗi logic trong code):* Cả Frontend và Backend hiện tại đều không kiểm tra điều kiện này khi Thêm mới, dẫn đến việc chấp nhận lưu các giá trị âm hoặc bằng 0.

* **`expired_at`:**
  * C4: Không được để trống VÀ Phải đúng định dạng ngày hợp lệ VÀ Phải lớn hơn hoặc bằng ngày hiện tại.

* **`min_order_amount`:**
  * C5: Phải là số lớn hơn hoặc bằng 0 (`min_order_amount >= 0`).
  * *Lưu ý (Lỗi logic trong code):* Hệ thống hiện tại không kiểm tra điều kiện này ở cả Frontend và Backend, cho phép lưu số âm.

* **`max_uses_per_user`:**
  * C6: Phải lớn hơn hoặc bằng 1 (`max_uses_per_user >= 1`).
  * *Lưu ý (Lỗi logic trong code):* Hệ thống hiện tại không kiểm tra điều kiện này ở backend, cho phép lưu giá trị âm hoặc bằng 0.

* **`id` (khi Xóa):**
  * C7: ID coupon cần xóa phải tồn tại trong cơ sở dữ liệu.

---

### Step 3: Xác định miền EP (Phân vùng tương đương)

Các mã phân vùng tiếp tục tăng dần từ phân vùng trước ($E_{24}$).

#### 1. Đối với `code`
* $E_{25}$: Mã không để trống và chưa tồn tại trong cơ sở dữ liệu (Valid) *(Ví dụ: `SUMMER2026`)*.
* $E_{26}$: Mã để trống (Invalid) *(Ví dụ: `""`)*.
* $E_{27}$: Mã đã tồn tại trong cơ sở dữ liệu (Invalid) *(Ví dụ: `SAVE10`)*.

#### 2. Đối với `type`
* $E_{28}$: Giá trị thuộc tập `["percent", "fixed"]` (Valid) *(Ví dụ: `"percent"`)*.
* $E_{29}$: Giá trị ngoài tập hợp trên (Invalid) *(Ví dụ: `"invalid_type"`)*.

#### 3. Đối với `discount_value`
* $E_{30}$: Giá trị là số dương (`discount_value > 0`) (Valid) *(Ví dụ: `15` với type=percent, `50000` với type=fixed)*.
* $E_{31}$: Giá trị là số âm hoặc bằng 0 (`discount_value <= 0`) (Invalid) *(Ví dụ: `-10`, `0`)*.
* $E_{32}$: Giá trị để trống (Invalid) *(Ví dụ: `""`)*.

#### 4. Đối với `expired_at`
* $E_{33}$: Ngày hết hạn hợp lệ và ở tương lai (Valid) *(Ví dụ: `2099-12-31`)*.
* $E_{34}$: Ngày hết hạn để trống (Invalid) *(Ví dụ: `""`)*.
* $E_{35}$: Ngày hết hạn là ngày trong quá khứ hoặc sai định dạng (Invalid) *(Ví dụ: `2020-01-01`)*.

#### 5. Đối với `min_order_amount`
* $E_{36}$: Giá trị lớn hơn hoặc bằng 0 (`min_order_amount >= 0`) (Valid) *(Ví dụ: `200000`, `0`)*.
* $E_{37}$: Giá trị là số âm (`min_order_amount < 0`) (Invalid) *(Ví dụ: `-50000`)*.

#### 6. Đối với `max_uses_per_user`
* $E_{38}$: Giá trị lớn hơn hoặc bằng 1 (`max_uses_per_user >= 1`) (Valid) *(Ví dụ: `1`, `3`)*.
* $E_{39}$: Giá trị nhỏ hơn 1 hoặc để trống (`max_uses_per_user < 1` hoặc `null`) (Invalid) *(Ví dụ: `0`, `-2`)*.

#### 7. Đối với `id` (Thao tác Xóa)
* $E_{40}$: ID coupon tồn tại trong cơ sở dữ liệu (Valid) *(Ví dụ: `id = 1`)*.
* $E_{41}$: ID coupon không tồn tại hoặc để trống (Invalid) *(Ví dụ: `id = 9999`, `id = null`)*.

---

### Step 4: Xác định Test Data (Ma trận dữ liệu kiểm thử)

Chiến lược thiết kế kịch bản dựa trên nguyên tắc **Đơn biến biến đổi**: Ca kiểm thử `ID 21` và `ID 22` đại diện cho kịch bản lý tưởng (Happy Path) bao phủ các phân vùng hợp lệ. Các ca kiểm thử từ `ID 23` đến `ID 33` lần lượt thay đổi duy nhất một biến sang miền không hợp lệ (`Invalid EP`) để kiểm tra độc lập khả năng xử lý lỗi.

| ID | code | type | discount_value | expired_at | min_order_amount | max_uses_per_user | id (xóa) | Kết quả mong đợi theo Đặc tả | Kết quả thực tế (Hành vi hiện tại) | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **21** | `SUMMER26` | `percent` | `15` | `2099-12-31` | `200000` | `2` | - | **[Thành công]** Tạo mã thành công. | Tạo mã thành công. | $E_{25}, E_{28}, E_{30}, E_{33}, E_{36}, E_{38}$ |
| **22** | `FIXED50` | `fixed` | `50000` | `2099-12-31` | `0` | `1` | - | **[Thành công]** Tạo mã thành công. | Tạo mã thành công. | $E_{25}, E_{28}, E_{30}, E_{33}, E_{36}, E_{38}$ |
| **23** | `SAVE10` | `percent` | `15` | `2099-12-31` | `200000` | `2` | - | Báo lỗi trùng mã giảm giá. | Báo lỗi database: `SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code`. | $E_{27}$ |
| **24** | `""` | `percent` | `15` | `2099-12-31` | `200000` | `2` | - | Báo lỗi mã không được để trống. | HTML5 validation chặn submit ở Frontend. | $E_{26}$ |
| **25** | `TESTTYPE` | `invalid` | `15` | `2099-12-31` | `200000` | `2` | - | Báo lỗi kiểu giảm giá không hợp lệ. | **[Lỗi logic]** Vẫn tạo mã thành công trong CSDL. | $E_{29}$ |
| **26** | `NEGDISC` | `percent` | `-5` | `2099-12-31` | `200000` | `2` | - | Báo lỗi giá trị giảm phải lớn hơn 0. | **[Lỗi logic]** Vẫn tạo mã thành công trong CSDL. | $E_{31}$ |
| **27** | `EMPTYDISC` | `percent` | `""` | `2099-12-31` | `200000` | `2` | - | Báo lỗi giá trị giảm không được để trống. | HTML5 validation chặn submit ở Frontend. | $E_{32}$ |
| **28** | `EMPTYDATE` | `percent` | `15` | `""` | `200000` | `2` | - | Báo lỗi ngày hết hạn không được trống. | HTML5 validation chặn submit ở Frontend. | $E_{34}$ |
| **29** | `PASTDATE` | `percent` | `15` | `2020-01-01` | `200000` | `2` | - | Báo lỗi ngày hết hạn không hợp lệ. | **[Lỗi logic]** Vẫn tạo mã thành công trong CSDL (nhưng hiển thị trạng thái "Hết hạn" trên bảng admin). | $E_{35}$ |
| **30** | `NEGMIN` | `percent` | `15` | `2099-12-31` | `-50000` | `2` | - | Báo lỗi ngưỡng đơn hàng không được nhỏ hơn 0. | **[Lỗi logic]** Vẫn tạo mã thành công trong CSDL. | $E_{37}$ |
| **31** | `ZEROUSES` | `percent` | `15` | `2099-12-31` | `200000` | `0` | - | Báo lỗi giới hạn dùng phải lớn hơn hoặc bằng 1. | **[Lỗi logic]** Vẫn tạo mã thành công trong CSDL. | $E_{39}$ |
| **32** | - | - | - | - | - | - | `1` | **[Thành công]** Xóa coupon thành công. | Xóa coupon thành công. | $E_{40}$ |
| **33** | - | - | - | - | - | - | `9999` | Báo lỗi coupon không tồn tại. | **[Lỗi logic]** Vẫn báo thành công `"Coupon deleted"` dù coupon không tồn tại. | $E_{41}$ |


# Log 4 - Fr01

## Tính năng: FR-01 - Đăng ký tài khoản

### Step 1: Xác định Input & Output

* **Input:**
  * `name` (Chuỗi - String, bắt buộc)
  * `email` (Chuỗi - String, bắt buộc, duy nhất)
  * `password` (Chuỗi - String, bắt buộc)
  * `confirmPassword` (Chuỗi - String, bắt buộc)

* **Output:**
  * **Thành công (Success):** Đăng ký tài khoản thành công, thông tin người dùng được lưu vào CSDL và hệ thống chuyển hướng người dùng tới trang Đăng nhập `/login`.
  * **Thất bại 1 (Thiếu trường bắt buộc):** Chặn gửi yêu cầu (HTML5 validation ở phía Frontend).
  * **Thất bại 2 (Email sai định dạng):** Chặn gửi yêu cầu ở Frontend hoặc hiển thị thông báo lỗi định dạng email.
  * **Thất bại 3 (Email đã tồn tại):** Hệ thống từ chối đăng ký và báo lỗi: `"Email đã được sử dụng"`.
  * **Thất bại 4 (Mật khẩu không đủ độ phức tạp):** Hệ thống từ chối đăng ký và báo lỗi: `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."`.
  * **Thất bại 5 (Xác nhận mật khẩu không khớp):** Hệ thống từ chối đăng ký và báo lỗi: `"Mật khẩu xác nhận không trùng khớp"`.

---

### Step 2: Xác định Condition (Điều kiện)

* **`name`:**
  * C1: Không được để trống.

* **`email`:**
  * C2: Không được để trống VÀ Phải đúng định dạng email (`user@domain.com`).
  * C3: Phải là duy nhất (chưa tồn tại trong cơ sở dữ liệu).

* **`password`:**
  * C4: Không được để trống VÀ Độ dài tối thiểu 8 ký tự VÀ Phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số, và 1 ký tự đặc biệt thuộc tập (`@`, `$`, `!`, `%`, `*`, `?`, `&`).

* **`confirmPassword`:**
  * C5: Không được để trống VÀ Phải trùng khớp hoàn toàn với `password`.

---

### Step 3: Xác định miền EP (Phân vùng tương đương)

Các mã phân vùng tiếp tục tăng dần từ phân vùng trước ($E_{40}$).

#### 1. Đối với `name`
* $E_{41}$: Họ tên không để trống (Valid) *(Ví dụ: `"Nguyễn Văn A"`)*.
* $E_{42}$: Họ tên để trống (Invalid) *(Ví dụ: `""`)*.

#### 2. Đối với `email`
* $E_{43}$: Email đúng định dạng và chưa tồn tại trong hệ thống (Valid) *(Ví dụ: `new_user@gmail.com`)*.
* $E_{44}$: Email để trống hoặc sai định dạng (Invalid) *(Ví dụ: `""`, `new_user_gmail.com`)*.
* $E_{45}$: Email đúng định dạng nhưng đã tồn tại trong hệ thống (Invalid) *(Ví dụ: `test@eshop.com`)*.

#### 3. Đối với `password`
* $E_{46}$: Mật khẩu từ 8 ký tự trở lên, chứa đầy đủ chữ hoa, chữ thường, chữ số và ký tự đặc biệt hợp lệ theo Spec (Valid theo Spec) *(Ví dụ: `Aa@12345`)*.
* $E_{47}$: Mật khẩu ngắn hơn 8 ký tự (Invalid) *(Ví dụ: `Aa@123`)*.
* $E_{48}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ cái viết hoa (Invalid) *(Ví dụ: `aa@12345`)*.
* $E_{49}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu chữ cái viết thường (Invalid) *(Ví dụ: `AA@12345`)*.
* $E_{50}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu số (Invalid) *(Ví dụ: `Aa@ccccc`)*.
* $E_{51}$: Mật khẩu từ 8 ký tự trở lên nhưng thiếu ký tự đặc biệt (Invalid) *(Ví dụ: `Aa123456`)*.

#### 4. Đối với `confirmPassword`
* $E_{52}$: Xác nhận mật khẩu trùng khớp hoàn toàn với mật khẩu đã nhập (Valid) *(Ví dụ: password = `Aa@12345`, confirmPassword = `Aa@12345`)*.
* $E_{53}$: Xác nhận mật khẩu để trống (Invalid) *(Ví dụ: `""`)*.
* $E_{54}$: Xác nhận mật khẩu không trùng khớp với mật khẩu đã nhập (Invalid) *(Ví dụ: password = `Aa@12345`, confirmPassword = `Different123!`)*.

---

### Step 4: Xác định Test Data (Ma trận dữ liệu kiểm thử)

Chiến lược thiết kế kịch bản dựa trên nguyên tắc **Đơn biến biến đổi**: Ca kiểm thử `ID 33` đại diện cho kịch bản lý tưởng (Happy Path) bao phủ các phân vùng hợp lệ. Các ca kiểm thử từ `ID 34` đến `ID 44` lần lượt thay đổi duy nhất một biến sang miền không hợp lệ (`Invalid EP`) để kiểm tra độc lập khả năng xử lý lỗi.

| ID | name | email | password | confirmPassword | Kết quả mong đợi | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **33** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@12345` | `Aa@12345` | **[Thành công]** Đăng ký tài khoản thành công. | $E_{41}, E_{43}, E_{46}, E_{52}$ |
| **34** | `""` | `new_user@gmail.com` | `Aa@12345` | `Aa@12345` | Báo lỗi họ tên không được để trống. | $E_{42}$ |
| **35** | `"Nguyễn Văn A"` | `new_user_gmail.com` | `Aa@12345` | `Aa@12345` | Báo lỗi định dạng email không hợp lệ. | $E_{44}$ |
| **36** | `"Nguyễn Văn A"` | `test@eshop.com` | `Aa@12345` | `Aa@12345` | Báo lỗi email đã được sử dụng. | $E_{45}$ |
| **37** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@123` | `Aa@123` | Báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."`. | $E_{47}$ |
| **38** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `aa@12345` | `aa@12345` | Báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."`. | $E_{48}$ |
| **39** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `AA@12345` | `AA@12345` | Báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."`. | $E_{49}$ |
| **40** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@ccccc` | `Aa@ccccc` | Báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."`. | $E_{50}$ |
| **41** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa123456` | `Aa123456` | Báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự..."`. | $E_{51}$ |
| **42** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@12345` | `""` | Báo lỗi xác nhận mật khẩu không được trống. | $E_{53}$ |
| **43** | `"Nguyễn Văn A"` | `new_user@gmail.com` | `Aa@12345` | `Different123!` | Báo lỗi `"Mật khẩu xác nhận không trùng khớp"`. | $E_{54}$ |



