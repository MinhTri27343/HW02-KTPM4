## Step 1: Xác định Input & Output

*   **Input:**
    *   `Username` (Chuỗi ký tự)
    *   `Password` (Chuỗi ký tự)
    *   `Repassword` (Chuỗi ký tự)
    *   `GioiTinh` (Chuỗi/Lựa chọn)
    *   `NgaySinh` (Kiểu ngày tháng)
*   **Output:** Đăng ký thành công **HOẶC** Thông báo lỗi (Error).

---

## Step 2: Xác định Condition (Điều kiện)

Dựa vào yêu cầu bài toán, các điều kiện hợp lệ được xác định như sau:
*   **Username:** Bắt đầu bằng ký tự **VÀ** Không có ký tự đặc biệt **VÀ** Chưa tồn tại trên hệ thống.
*   **Password:** Độ dài $\ge 6$ ký tự **VÀ** Có ít nhất 2 ký tự đặc biệt.
*   **Repassword:** Trùng khớp hoàn toàn với `Password`.
*   **Giới tính:** Có giá trị là "nam" hoặc "nữ".
*   **Ngày sinh:** Là ngày hợp lệ trên lịch **VÀ** Số tuổi phải $> 18$.

---

## Step 3: Xác định miền EP (Phân vùng tương đương)

Chia các trường hợp thành các vùng tương đương từ $E_1$ đến $E_{18}$ cho từng biến:

### 1. Đối với Username
*   $E_1$: Bắt đầu bằng ký tự (Valid).
*   $E_2$: Bắt đầu bằng số hoặc ký tự đặc biệt (Invalid).
*   $E_3$: Không chứa ký tự đặc biệt (Valid).
*   $E_4$: Có chứa ký tự đặc biệt như `@`, `!`, `#` (Invalid).
*   $E_5$: Tài khoản chưa tồn tại trên hệ thống (Valid).
*   $E_6$: Tài khoản đã tồn tại trên hệ thống (Invalid).

### 2. Đối với Password
*   $E_7$: Độ dài $\ge 6$ ký tự (Valid).
*   $E_8$: Độ dài $< 6$ ký tự (Invalid).
*   $E_9$: Có từ 2 ký tự đặc biệt trở lên (Valid).
*   $E_{10}$: Không có hoặc chỉ có 1 ký tự đặc biệt (Invalid).

### 3. Đối với Repassword
*   $E_{11}$: Trùng khớp hoàn toàn với `Password` (Valid).
*   $E_{12}$: Khác với `Password` (Invalid).

### 4. Đối với Giới tính
*   $E_{13}$: Giá trị nhập vào/chọn là "nam" hoặc "nữ" (Valid).
*   $E_{14}$: Giá trị khác hoặc để trống (Invalid).

### 5. Đối với Ngày sinh
*   $E_{15}$: Ngày tháng đúng định dạng và hợp lệ thực tế (Valid).
*   $E_{16}$: Ngày không tồn tại trên lịch như 30/02, 32/01 (Invalid).
*   $E_{17}$: Số tuổi tính đến hiện tại $> 18$ (Valid).
*   $E_{18}$: Số tuổi tính đến hiện tại $\le 18$ (Invalid).

---

## Step 4: Xác định Test Data (Ma trận dữ liệu kiểm thử)

Thiết kế các kịch bản kiểm thử (Test Cases) bằng cách phối hợp các phân vùng. Ca kiểm thử đầu tiên ($ID = 1$) sẽ bao phủ toàn bộ miền hợp lệ, các ca kiểm thử tiếp theo sẽ lần lượt kích hoạt từng miền không hợp lệ để kiểm tra hệ thống.

| ID | Username | Password | Repassword | Giới tính | Ngày sinh | Kết quả mong đợi | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `trido2026` | `Abc@#123` | `Abc@#123` | nam | 15/05/2000 | **Đăng ký thành công** | $E_1, E_3, E_5, E_7, E_9, E_{11}, E_{13}, E_{15}, E_{17}$ |
| **2** | `1trido` | `Abc@#123` | `Abc@#123` | nam | 15/05/2000 | Báo lỗi Username | $E_2$ (Bắt đầu bằng số) |
| **3** | `tri@do` | `Abc@#123` | `Abc@#123` | nam | 15/05/2000 | Báo lỗi Username | $E_4$ (Chứa ký tự đặc biệt) |
| **4** | `admin` *(đã có)* | `Abc@#123` | `Abc@#123` | nam | 15/05/2000 | Báo lỗi Username | $E_6$ (Tài khoản trùng lặp) |
| **5** | `trido2026` | `a@#1` | `a@#1` | nam | 15/05/2000 | Báo lỗi Password | $E_8$ (Độ dài chuỗi quá ngắn) |
| **6** | `trido2026` | `Abc@1234` | `Abc@1234` | nam | 15/05/2000 | Báo lỗi Password | $E_{10}$ (Thiếu ký tự đặc biệt) |
| **7** | `trido2026` | `Abc@#123` | `KhacNhau1!` | nam | 15/05/2000 | Báo lỗi Repassword | $E_{12}$ (Mật khẩu không khớp) |
| **8** | `trido2026` | `Abc@#123` | `Abc@#123` | khác | 15/05/2000 | Báo lỗi Giới tính | $E_{14}$ (Sai tùy chọn hệ thống) |
| **9** | `trido2026` | `Abc@#123` | `Abc@#123` | nữ | 31/02/2000 | Báo lỗi Ngày sinh | $E_{16}$ (Ngày sai quy định lịch) |
| **10**| `trido2026` | `Abc@#123` | `Abc@#123` | nữ | 01/01/2015 | Báo lỗi Ngày sinh | $E_{18}$ (Người dùng chưa đủ 18 tuổi) |