Tôi cung cấp cho bạn:

1. Một file skill về `Automated_Domain_Testing_Designer.md`.
2. Các hình ảnh giao diện UI liên quan đến tính năng cần kiểm thử.
3. Dữ liệu đầu vào gồm Feature Specification, Navigation Flow, Business Rules, Input Constraints, Expected Output Statuses và System Context.

Nhiệm vụ của bạn:

- Đọc và hi templaểu toàn bộ skill `Automated_Domain_Testing_Designer.md`.
- Phân tích các quy trình, phương pháp,te và tiêu chí trong skill.
- Quan sát các hình ảnh UI được cung cấp để hiểu giao diện, field input, trạng thái hiển thị, validation message và user flow.
- Dựa trên skill và dữ liệu đầu vào, hãy tạo một **Domain Testing Report hoàn chỉnh** cho tính năng được mô tả.

Feature cần phân tích:

FR-03: Forgot password and password reset (two steps)

Input Specification:

"""
Mô tả tính năng/Yêu cầu nghiệp vụ (Feature Specification):

Luồng điều hướng (Navigation Flow):
Tại màn hình Đăng nhập (Login), nhấn liên kết "Quên mật khẩu?" để chuyển sang màn hình Nhập Email.
Sau khi nhập Email hợp lệ, hệ thống hiển thị mã OTP (4 số) giả lập ở thanh thông báo xanh lá, đồng thời mở rộng thêm 2 trường nhập:
"Mã OTP (4 số)" và "Mật khẩu mới".

Ràng buộc logic của các trường dữ liệu đầu vào:

Email:
- Chuỗi ký tự định dạng email.
- Phải tồn tại trong cơ sở dữ liệu hệ thống.

Mã OTP (4 số):
- Chuỗi ký tự số.
- Không được để trống.
- Bắt buộc đúng 4 ký tự số.
- Phải trùng khớp hoàn toàn với OTP hệ thống đã cấp.

Mật khẩu mới:
- Độ dài tối thiểu 8 ký tự.
- Phải chứa:
  + Ít nhất 1 chữ cái viết hoa.
  + Ít nhất 1 chữ cái viết thường.
  + Ít nhất 1 chữ số.
  + Ít nhất 1 ký tự đặc biệt (@, #, !, $,...).

Expected Output Statuses:

Thất bại 1:
Email không tồn tại
→ Hiển thị lỗi "User not found".

Thất bại 2:
OTP trống / sai định dạng / không trùng khớp
→ Hiển thị thông báo lỗi tương ứng.

Thất bại 3:
Mật khẩu mới không đủ độ phức tạp
→ Hiển thị Browser Alert:
"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."

Thành công:
Đặt lại mật khẩu thành công và cập nhật vào hệ thống.

System Context:

Database giả định:

Existing account:
test_user@gmail.com

Non-existing account:
nonexistent_user@gmail.com


"""

Yêu cầu tạo báo cáo:

Hãy xuất kết quả dưới dạng file Markdown:

`Domain_testing_report.md`

File phải là một Domain Testing Report hoàn chỉnh, không phải là bản tóm tắt.

Bắt buộc tuân theo cấu trúc của skill `Automated_Domain_Testing_Designer` đã cung cấp.