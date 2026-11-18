# 🌍 TravelApp – Ứng dụng hỗ trợ dịch vụ du lịch

## 1. Giới thiệu dự án

**TravelApp** là ứng dụng di động được phát triển nhằm kết nối khách hàng với các nhà cung cấp dịch vụ du lịch. Hệ thống hỗ trợ người dùng tiếp cận các dịch vụ du lịch thông qua nền tảng di động, đồng thời cung cấp các chức năng quản lý dành cho nhà cung cấp và quản trị viên.

Dự án được xây dựng theo mô hình Client – Server, sử dụng Django REST Framework để phát triển hệ thống API và React Native kết hợp Expo để xây dựng ứng dụng di động đa nền tảng.

## 2. Các đối tượng sử dụng

Hệ thống được thiết kế với 3 nhóm người dùng chính:

| Đối tượng | Mô tả |
|---|---|
| **Admin (Quản trị viên)** | Quản lý và giám sát hoạt động của hệ thống. |
| **Traveler (Khách du lịch)** | Người dùng tìm kiếm và sử dụng các dịch vụ du lịch. |
| **Provider (Nhà cung cấp)** | Đơn vị hoặc cá nhân cung cấp và quản lý dịch vụ du lịch. |

## 3. Công nghệ sử dụng

### Backend
- Python
- Django 5.2.4
- Django REST Framework
- MySQL
- OAuth Toolkit

### Frontend
- React Native 0.79.5
- Expo SDK 53
- JavaScript
- React Native Paper

### Dịch vụ bên thứ ba
- Cloudinary: Lưu trữ và quản lý hình ảnh.
- Expo Location: Hỗ trợ các chức năng liên quan đến vị trí.
- MoMo / VNPay: Nghiên cứu và thử nghiệm tích hợp thanh toán.

### Công cụ phát triển
- Visual Studio Code
- Android Studio
- Git & GitHub
- Expo Go

## 4. Kiến trúc hệ thống

Dự án sử dụng kiến trúc Client – Server, trong đó ứng dụng di động giao tiếp với máy chủ thông qua RESTful API.

```text
       ỨNG DỤNG DI ĐỘNG
        React Native
            Expo
              |
              | HTTP / REST API
              |
       BACKEND SERVER
           Django
     Django REST Framework
       Authentication
              |
        +-----+------+
        |            |
        v            v
      MySQL      Cloudinary
    Database    Media Storage
```

**Mô tả:**
- Frontend: Hiển thị giao diện và xử lý tương tác với người dùng.
- Backend: Xử lý nghiệp vụ, xác thực người dùng và cung cấp API.
- MySQL: Lưu trữ dữ liệu của hệ thống.
- Cloudinary: Hỗ trợ lưu trữ hình ảnh và tài nguyên đa phương tiện.

## 5. Các chức năng chính

Hệ thống được tổ chức theo ba nhóm người dùng:

- Phân quyền và tổ chức chức năng theo vai trò Admin, Traveler và Provider.
- Giao tiếp giữa ứng dụng di động và máy chủ thông qua RESTful API.
- Quản lý và truy xuất dữ liệu thông qua Django REST Framework và MySQL.
- Hỗ trợ tích hợp xác thực thông qua OAuth Toolkit.
- Tích hợp dịch vụ lưu trữ hình ảnh Cloudinary.
- Hỗ trợ các chức năng liên quan đến vị trí thông qua Expo Location.

*Lưu ý: Mức độ hoàn thiện của từng chức năng phụ thuộc vào phiên bản mã nguồn hiện tại.*

## 6. Cấu trúc dự án

```text
TravelApp/
│
├── Backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
│
├── Frontend/
│   ├── app.json
│   ├── package.json
│   ├── assets/
│   └── ...
│
└── README.md
```

*Lưu ý: Cập nhật tên thư mục theo cấu trúc thực tế của repository.*

## 7. Hướng dẫn cài đặt và chạy dự án

### 7.1. Yêu cầu môi trường

Cài đặt các công cụ cần thiết:

- Python
- Node.js
- MySQL Server
- Git
- Android Studio (nếu sử dụng máy ảo Android)
- Expo Go (nếu chạy trên thiết bị di động)

### 7.2. Clone repository

```bash
git clone https://github.com/Vo-Van-Mai/TravelApp.git

cd TravelApp
```

### 7.3. Cài đặt Backend

Di chuyển vào thư mục Backend:

```bash
cd Backend
```

Tạo môi trường ảo:

```bash
python -m venv venv
```

Kích hoạt môi trường ảo trên Windows:

```bash
venv\Scripts\activate
```

Cài đặt các thư viện:

```bash
pip install -r requirements.txt
```

Thực hiện migrate cơ sở dữ liệu:

```bash
python manage.py migrate
```

Khởi chạy Backend:

```bash
python manage.py runserver
```

### 7.4. Cài đặt Frontend

Mở terminal mới và di chuyển vào thư mục Frontend:

```bash
cd Frontend
```

Cài đặt các dependencies:

```bash
npm install
```

Khởi chạy ứng dụng:

```bash
npx expo start
```

Sau đó sử dụng Expo Go hoặc Android Emulator để chạy ứng dụng.

## 8. Cấu hình môi trường

Cần cấu hình các thông tin kết nối cơ sở dữ liệu và dịch vụ bên thứ ba trước khi chạy dự án.

Ví dụ cấu hình Backend:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Các biến môi trường trên mang tính minh họa. Hãy sử dụng đúng tên biến được khai báo trong mã nguồn dự án.

**Lưu ý bảo mật:** Không tải lên GitHub các thông tin nhạy cảm như mật khẩu cơ sở dữ liệu, SECRET_KEY hoặc API Secret.

## 9. Định hướng phát triển

Một số chức năng và khía cạnh có thể tiếp tục cải thiện:

- Hoàn thiện hệ thống phân quyền người dùng.
- Nâng cao tính bảo mật và quy trình xác thực.
- Hoàn thiện tích hợp bản đồ Google Maps.
- Hoàn thiện tích hợp cổng thanh toán MoMo và VNPay.
- Tối ưu hiệu suất và trải nghiệm người dùng.
- Bổ sung kiểm thử tự động cho Backend API.
- Hoàn thiện tài liệu API và xử lý ngoại lệ.

## 10. Tác giả

**Võ Văn Mãi**

- GitHub: [Vo-Van-Mai](https://github.com/Vo-Van-Mai)

---

*Dự án được thực hiện với mục đích học tập, nghiên cứu và xây dựng sản phẩm thực tế phục vụ Portfolio cá nhân.*
