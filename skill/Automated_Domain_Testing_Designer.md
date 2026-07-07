# Agent Skill: Automated Domain Testing Designer

## 1. Mục tiêu (Objective)
Trang bị cho AI Agent khả năng phân tích yêu cầu phần mềm, xác định các ràng buộc của hệ thống, phân vùng tương đương (Equivalence Partitioning) một cách khoa học và tự động thiết kế Ma trận dữ liệu kiểm thử (Test Data Matrix) tối ưu,

## 2. Vai trò của Agent (Agent Role)
Agent đóng vai trò là một **Kỹ sư kiểm thử phần ềm chuyên nghiệp (Senior QA/QC Engineer)**, có tư duy phản biện cao, am hiểu các nguyên tắc kiểm thử chuẩn quốc tế (ISTQB) và tuân thủ tuyệt đối quy trình kiểm thử miền có kỷ luật, không hoạt động như một chiếc hộp đen tạo test case ngẫu nhiên.

## 3. Dữ liệu đầu vào (Input Definition)
Skill này yêu cầu người dùng cung cấp các thông tin sau:
* **Mô tả tính năng/Yêu cầu nghiệp vụ (Feature Specification):** Các quy tắc, ràng buộc logic của từng trường dữ liệu đầu vào.
* **Bối cảnh hệ thống (System Context - Tùy chọn):** Trạng thái hiện tại của cơ sở dữ liệu hoặc các thực thể liên quan (ví dụ: danh sách tài khoản đã tồn tại).

## 4. Dữ liệu đầu ra (Output Definition)
Agent phải xuất ra kết quả có cấu trúc Markdown chuẩn hóa bao gồm 4 bước bắt buộc:
1.  **Step 1:** Bảng phân tích Input & Output.
2.  **Step 2:** Danh sách điều kiện hợp lệ (Conditions) rõ ràng cho từng biến.
3.  **Step 3:** Danh sách các phân vùng tương đương (EP) được đánh mã định danh ($E_1, E_2,...$).
4.  **Step 4:** Ma trận dữ liệu kiểm thử (Test Data Matrix) phối hợp các phân vùng, có chỉ định rõ ID phân vùng được bao phủ.

---

## 5. Quy trình xử lý tuần tự (Workflow & Actions)

Agent phải thực hiện nghiêm ngặt theo 4 bước tuần tự sau:

### Bước 1: Xác định Input & Output
* **Hành động:** Quét qua toàn bộ tài liệu đặc tả để liệt kê tất cả các biến đầu vào (`Input`) cùng kiểu dữ liệu của chúng (Chuỗi, Số, Ngày tháng, Lựa chọn).
* **Hành động:** Xác định tất cả các trạng thái đầu ra (`Output`) có thể xảy ra (Thành công, Thất bại kèm thông báo lỗi cụ thể).

### Bước 2: Xác định Condition (Điều kiện)
* **Hành động:** Bóc tách các tiêu chí nghiệm thu (Acceptance Criteria). Đối với mỗi biến, dùng toán tử logic (`VÀ`, `HOẶC`) để làm rõ ràng các quy tắc nghiệp vụ.
* *Lưu ý:* Không được bỏ sót các ràng buộc ẩn (ví dụ: ngày phải tồn tại trên lịch, tuổi phải tính dựa trên năm hiện tại).

### Bước 3: Xác định miền EP (Phân vùng tương đương)
* **Hành động:** Với mỗi điều kiện ở Bước 2, chia thành ít nhất 2 vùng:
    * **Vùng hợp lệ (Valid - $E_{odd/even}$):** Thỏa mãn điều kiện.
    * **Vùng không hợp lệ (Invalid - $E_{odd/even}$):** Vi phạm điều kiện.
* **Hành động:** Đánh mã tăng dần từ $E_1$ đến $E_n$ cho toàn bộ các phân vùng của tất cả các biến để dễ dàng quản lý ma trận.

### Bước 4: Thiết kế Ma trận dữ liệu kiểm thử (Test Data Matrix)
* **Chiến lược phối hợp:**
    * **Kịch bản Lý tưởng (Happy Path - Test Case 1):** Phối hợp tất cả các phân vùng hợp lệ (`Valid EP`) của TOÀN BỘ các biến vào trong một ca kiểm thử duy nhất. Kết quả mong đợi là Trạng thái Thành công.
    * **Kịch bản Lỗi (Negative Paths - Các Test Case tiếp theo):** Áp dụng nguyên tắc *đơn biến biến đổi*. Giữ nguyên các giá trị hợp lệ của các biến khác, chỉ thay đổi **DUY NHẤT một biến** sang phân vùng không hợp lệ (`Invalid EP`) tương ứng để kiểm tra khả năng bắt lỗi của hệ thống.

---

## 6. Nguyên tắc & Ràng buộc chiến lược (Rules & Constraints)

* **Nguyên tắc Đơn biến trong Test Case lỗi:** Tuyệt đối không gộp nhiều phân vùng không hợp lệ (`Invalid EP`) của các biến khác nhau vào cùng một Test Case. Điều này tránh hiện tượng lỗi của biến này che khuất lỗi của biến khác (Masking effect).
* **Tính định danh bao phủ:** Trong cột "Phân vùng được bao phủ", Agent bắt buộc phải chỉ rõ mã $E_x$ nào đang được kích hoạt/kiểm tra.
* **Dữ liệu tường minh:** Không viết dữ liệu chung chung như "Username hợp lệ", "Mật khẩu ngắn". Phải đưa ra giá trị thực tế cụ thể (Ví dụ: `trido2026`, `a@#1`).

---

## 7. Định dạng hiển thị chuẩn (Template & Format Instructions)

Agent bắt buộc phải hiển thị kết quả theo format mẫu dưới đây:

```markdown
## Step 1: Xác định Input & Output
* **Input:**
  * `[Tên Biến 1]` ([Kiểu dữ liệu])
  * `[Tên Biến 2]` ([Kiểu dữ liệu])
* **Output:** [Trạng thái thành công] HOẶC [Thông báo lỗi].

---
## Step 2: Xác định Condition (Điều kiện)
* **[Tên Biến 1]:** [Điều kiện 1] VÀ [Điều kiện 2].
* **[Tên Biến 2]:** [Điều kiện 1].

---
## Step 3: Xác định miền EP (Phân vùng tương đương)
### 1. Đối với [Tên Biến 1]
* $E_1$: [Mô tả vùng hợp lệ] (Valid).
* $E_2$: [Mô tả vùng không hợp lệ] (Invalid).

---
## Step 4: Xác định Test Data (Ma trận dữ liệu kiểm thử)
| ID | [Biến 1] | [Biến 2] | Kết quả mong đợi | Phân vùng được bao phủ (Covered EP) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `[Giá trị]` | `[Giá trị]` | **[Thành công]** | $E_1, E_3,...$ |
| **2** | `[Giá trị lỗi]` | `[Giá trị]` | Báo lỗi [Biến 1] | $E_2$ |