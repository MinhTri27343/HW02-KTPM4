### Log 1
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

